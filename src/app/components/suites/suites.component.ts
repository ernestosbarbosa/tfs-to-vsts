import { Component, OnInit, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export class Suite {
  id: number;
  name: string;
  parentId: number;
  planId: number;
}

export class SuiteItemNode {
  item: Suite;
  children: SuiteItemNode[];
}

export class SuiteItemFlatNode {
  item: Suite
  level: number;
  expandable: boolean;
}

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<SuiteItemNode[]>([]);

  get data(): SuiteItemNode[] { return this.dataChange.value; }

  set data(value: SuiteItemNode[]) {
    this.dataChange.next(value);
  }

  constructor() { }

  initialize(TREE_DATA: SuiteItemNode[]) {
    const data = this.buildSuiteTree(TREE_DATA, 0);
    this.dataChange.next(data);
  }

  buildSuiteTree(obj: any[], level: number): SuiteItemNode[] {
    const nodeRes: SuiteItemNode[] = [];
    obj.forEach(o => {
      const node = new SuiteItemNode();
      node.item = new Suite();
      node.item.id = o.id;
      node.item.name = o.name;
      node.item.planId = o.plan.id;
      if (o.parent) {
        node.item.parentId = o.parent.id;
      }
      if (o.children) {
        node.children = this.buildSuiteTree(o.children, level + 1);
      }
      nodeRes.push(node);
    })
    return nodeRes;
  }
}

@Component({
  selector: 'app-suites',
  templateUrl: './suites.component.html',
  styleUrls: ['./suites.component.css'],
  providers: [ChecklistDatabase]
})
export class SuitesComponent implements OnInit {

  suites: any;
  flatNodeMap = new Map<SuiteItemFlatNode, SuiteItemNode>();
  nestedNodeMap = new Map<SuiteItemNode, SuiteItemFlatNode>();
  treeControl: FlatTreeControl<SuiteItemFlatNode>;
  treeFlattener: MatTreeFlattener<SuiteItemNode, SuiteItemFlatNode>;
  dataSource: MatTreeFlatDataSource<SuiteItemNode, SuiteItemFlatNode>;
  suiteChecklistSelection = new SelectionModel<SuiteItemFlatNode>(true);
  suitesIsDisabled: boolean = false;

  constructor(
    public database: ChecklistDatabase
  ) { 
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<SuiteItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
  }

  disableAllSuites() {
    this.suitesIsDisabled = true;
  }

  getLevel = (node: SuiteItemFlatNode) => node.level;

  isExpandable = (node: SuiteItemFlatNode) => node.expandable;

  getChildren = (node: SuiteItemNode): SuiteItemNode[] => node.children;

  hasChild = (_: number, _nodeData: SuiteItemFlatNode) => _nodeData.expandable;

  transformer = (node: SuiteItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode : new SuiteItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  descendantsAllSelected(node: SuiteItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.suiteChecklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: SuiteItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.suiteChecklistSelection.isSelected(child));
    // return result && !this.descendantsAllSelected(node);
    return result;
  }

  todoItemSelectionToggle(node: SuiteItemFlatNode): void {
    this.suiteChecklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.suiteChecklistSelection.isSelected(node)
      ? this.suiteChecklistSelection.select(...descendants)
      : this.suiteChecklistSelection.deselect(...descendants);
  }

}
