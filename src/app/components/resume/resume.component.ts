import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ProjectsComponent } from '../projects/projects.component';
import { ServersComponent } from '../servers/servers.component';
import { PlansComponent } from '../plans/plans.component';
import { SuitesComponent } from '../suites/suites.component';
import { TestsComponent } from '../tests/tests.component';
import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';

export class Plan {
  id: number;
  name: string;
  parentId: number;
  projectId: number;
  type: string = "Plano: ";
}

export class Suite {
  id: number;
  name: string;
  parentId: number;
  planId: number;
  type: string = "Suíte: ";
}

export class Test {
  id: number;
  name: string;
  suiteId: number;
  type: string = "Teste: ";
}

export class PlanItemNode {
  item: Plan;
  children: any[];
}

export class SuiteItemNode {
  item: Suite;
  children: any[] = [];
}

export class TestItemNode {
  item: Test;
  children: any[] = [];
}

export class FlatNode {
  item: any
  level: number;
  expandable: boolean;
}

@Injectable()
export class ListDatabase {
  dataChange = new BehaviorSubject<PlanItemNode[]>([]);

  get data(): PlanItemNode[] { return this.dataChange.value; }

  set data(value: PlanItemNode[]) {
    this.dataChange.next(value);
  }

  constructor() { }

  initialize(TREE_DATA: PlanItemNode[]) {
    const data = this.buildPlanTree(TREE_DATA, 0);
    // console.log(data);
    this.dataChange.next(data);
  }

  buildPlanTree(obj: any[], level: number): PlanItemNode[] {
    const nodeRes: PlanItemNode[] = [];
    obj.forEach(o => {
      const node = new PlanItemNode();
      node.item = new Plan();
      node.item.id = o.id;
      node.item.name = o.name;
      node.item.projectId = o.project.id;
      if (o.suites) {
        node.children = this.buildSuiteTree(o.suites, level + 1);
      }
      nodeRes.push(node);
    })
    return nodeRes;
  }

  buildSuiteTree(obj: any[], level: number): any[] {
    const nodeRes: any[] = [];
    obj.forEach(o => {
      const node = new SuiteItemNode();
      node.item = new Suite();
      node.item.id = o.item.id;
      node.item.name = o.item.name;
      node.item.planId = o.item.planId;
      if (o.parent) {
        node.item.parentId = o.parent.id;
      }
      if (o.children) {
        node.children = node.children.concat(this.buildSuiteTree(o.children, level + 1));
      }
      if (o.tests) {
        node.children = node.children.concat(this.buildTestTree(o.tests, level + 1));
      }
      nodeRes.push(node);
    })
    return nodeRes;
  }

  buildTestTree(obj: any[], level: number): TestItemNode[] {
    const nodeRes: TestItemNode[] = [];
    obj.forEach(o => {
      const node = new TestItemNode();
      node.item = new Test();
      node.item.id = o.wit.id;
      node.item.name = o.wit.fields['System.Title'];
      node.item.suiteId = o.suite.id;
      nodeRes.push(node);
    })
    return nodeRes;
  }
}

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  providers: [ListDatabase]
})
export class ResumeComponent implements OnInit {

  @Input() tfsVstsProjects: ProjectsComponent
  @Input() tfsVstsServers: ServersComponent
  @Input() tfsVstsPlans: PlansComponent
  @Input() tfsVstsSuites: SuitesComponent
  @Input() tfsVstsTests: TestsComponent

  flatNodeMap = new Map<FlatNode, any>();
  nestedNodeMap = new Map<FlatNode, any>();
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<PlanItemNode, FlatNode>;
  dataSource: MatTreeFlatDataSource<PlanItemNode, FlatNode>;

  plansToImport: any[] = [];

  constructor(
    public database: ListDatabase
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  init() {
    this.plansToImport = this.tfsVstsPlans.plansSelection.selected;
    this.plansToImport.map(plan => {
      plan.suites = this.tfsVstsSuites.suiteChecklistSelection.selected.filter(suite => `${suite.item.planId}` === `${plan.id}` && suite.level === 0);
      plan.suites.map(suite => {
        suite = this.suiteTree(suite, 1);
      });
    })

    //rever quando seleciono direto toda a arvore de suitechecklist
    console.log(this.plansToImport);
    this.database.initialize(this.plansToImport);


    console.log("Projeto origem");
    console.log(this.tfsVstsProjects.projetoOrigem.value);
    console.log("Projeto destino");
    console.log(this.tfsVstsProjects.projetoDestino.value);
    console.log("Planos selecionados");
    console.log(this.tfsVstsPlans.plansSelection.selected);
    console.log("Plano destino");
    console.log(this.tfsVstsPlans.planoDestino.value);
    console.log("Suites selecionadas");
    console.log(this.tfsVstsSuites.suiteChecklistSelection.selected);
    console.log("Testes selecionados");
    console.log(this.tfsVstsTests.testsSelection.selected);
  }

  suiteTree(suite: any, level: number) {
    suite.children = this.tfsVstsSuites.suiteChecklistSelection.selected.filter(s => s.item.parentId && `${s.item.parentId}` == `${suite.item.id}` && s.level == level);
    suite.children.map(s => {
      s = this.suiteTree(s, level + 1);
    })
    suite.tests = this.tfsVstsTests.testsSelection.selected.filter(testCase => testCase.suite.id === suite.item.id);
    return suite;
  }

  ngOnInit() {
  }

  getLevel = (node: any) => node.level;

  isExpandable = (node: any) => node.expandable;

  getChildren = (node: any): any[] => node.children;

  hasChild = (_: number, _nodeData: any) => _nodeData.expandable;

  transformer = (node: any, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode : new FlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

}
