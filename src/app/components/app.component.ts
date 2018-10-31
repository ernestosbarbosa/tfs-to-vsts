import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';
import { TfsVstsService } from '../services/tfs-vsts.service';
import { forkJoin } from 'rxjs';
import { ProjectsComponent } from './projects/projects.component';
import { ServersComponent } from './servers/servers.component';
import { PlansComponent } from './plans/plans.component';
import { SuitesComponent } from './suites/suites.component';
import { TestsComponent } from './tests/tests.component';
import { ResumeComponent } from './resume/resume.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TFS to VSTS';
  loading = false;
  tfsType = "tfs";
  vstsType = "vsts";

  importDisabled = false;

  @ViewChild(ProjectsComponent) tfsVstsProjects: ProjectsComponent;
  @ViewChild(ServersComponent) tfsVstsServers: ServersComponent;
  @ViewChild(PlansComponent) tfsVstsPlans: PlansComponent;
  @ViewChild(SuitesComponent) tfsVstsSuites: SuitesComponent;
  @ViewChild(TestsComponent) tfsVstsTests: TestsComponent;
  @ViewChild(ResumeComponent) resume: ResumeComponent;

  constructor(
    private tfsVstsService: TfsVstsService,
    public dialog: MatDialog
  ) { }

  modal: ModalComponent = new ModalComponent(this.dialog);

  ngOnInit() {
  }

  addDisableOption(array: any[]) {
    array.forEach(item => {
      item.disabled = false;
    })
    return array;
  }

  loadProjects(stepper: MatStepper) {
    if (this.tfsVstsServers.serversFormGroup.invalid) {
      this.modal.modalErro("Todos os campos devem ser preenchidos");
      return;
    }
    this.loading = true;

    this.tfsVstsServers.credentialsTfs = {
      username: this.tfsVstsServers.usuarioOrigem.value,
      password: this.tfsVstsServers.senhaOrigem.value,
      workstation: this.tfsVstsServers.workstationOrigem.value,
      domain: this.tfsVstsServers.dominioOrigem.value
    }
    this.tfsVstsServers.credentialsVsts = {
      token: this.tfsVstsServers.tokenDestino.value
    }
    if (!this.tfsVstsProjects.projects) {
      forkJoin(
        this.tfsVstsService.getProjects(this.tfsVstsServers.urlOrigem.value, this.tfsVstsServers.credentialsTfs, this.tfsType),
        this.tfsVstsService.getProjects(this.tfsVstsServers.urlDestino.value, this.tfsVstsServers.credentialsVsts, this.vstsType)
      ).subscribe(res => {
        let projects = res[0];
        let projectsDest = res[1];
        this.tfsVstsProjects.projects = projects;
        this.tfsVstsProjects.projectsDest = projectsDest;
        this.tfsVstsServers.serversFormGroup.disable();
        stepper.next();
        this.loading = false;
      })
    } else {
      stepper.next();
      this.loading = false;
    }
  }

  loadPlans(stepper: MatStepper) {
    if (this.tfsVstsProjects.projectsFormGroup.invalid) {
      this.modal.modalErro("Você deve selecionar um projeto origem e um projeto destino");
      return;
    }
    this.loading = true;
    if (!this.tfsVstsPlans.plans) {
      forkJoin(
        this.tfsVstsService.getPlans(this.tfsVstsServers.urlOrigem.value, this.tfsVstsServers.credentialsTfs, this.tfsVstsProjects.projetoOrigem.value, this.tfsType),
        this.tfsVstsService.getPlans(this.tfsVstsServers.urlDestino.value, this.tfsVstsServers.credentialsVsts, this.tfsVstsProjects.projetoDestino.value, this.vstsType)
      ).subscribe(res => {
        let plans = res[0];
        let plansDest = res[1];

        this.tfsVstsPlans.plans = plans;
        this.tfsVstsPlans.plansDataSource.data = this.addDisableOption(this.tfsVstsPlans.plans);
        this.tfsVstsPlans.plansDataSource.paginator = this.tfsVstsPlans.plansPaginator;
        this.tfsVstsPlans.plansDataSource.sort = this.tfsVstsPlans.plansSort;

        this.tfsVstsPlans.plansDest = plansDest;

        stepper.next();
        this.tfsVstsProjects.projectsFormGroup.disable();
        this.loading = false;
      });
    } else {
      stepper.next();
      this.loading = false;
    }
  }

  loadSuites(stepper: MatStepper) {
    if (this.tfsVstsPlans.plansSelection.selected.length === 0) {
      this.modal.modalErro("Você deve selecionar ao menos um plano de teste origem");
      return;
    }
    if (this.tfsVstsPlans.plansFormGroup.invalid) {
      this.modal.modalErro("Você deve selecionar um plano de teste destino");
      return;
    }

    this.loading = true;
    if (!this.tfsVstsSuites.suites) {
      let promises = this.tfsVstsPlans.plansSelection.selected.map(plan => {
        return this.tfsVstsService.getSuites(this.tfsVstsServers.urlOrigem.value, this.tfsVstsServers.credentialsTfs, this.tfsVstsProjects.projetoOrigem.value, plan.id, this.tfsType);
      });
      forkJoin(promises).subscribe(suites => {
        // console.log(suites);
        this.tfsVstsSuites.suites = suites;
        this.tfsVstsSuites.database.initialize(this.tfsVstsSuites.suites);
        stepper.next();
        this.tfsVstsPlans.disableAllPlans();
        this.tfsVstsPlans.plansFormGroup.disable();
        this.loading = false;
      })
    } else {
      stepper.next();
      this.loading = false;
    }
  }

  loadTests(stepper: MatStepper) {
    if (this.tfsVstsSuites.suiteChecklistSelection.selected.length === 0) {
      this.modal.modalErro("Você deve selecionar ao menos uma suite");
      return;
    }
    this.loading = true;
    if (!this.tfsVstsTests.tests) {
      let promises = this.tfsVstsSuites.suiteChecklistSelection.selected.map(suite => {
        return this.tfsVstsService.getTestCases(this.tfsVstsServers.urlOrigem.value, this.tfsVstsServers.credentialsTfs, this.tfsVstsProjects.projetoOrigem.value, suite.item.planId, suite.item.id, this.tfsType);
      });
      forkJoin(promises).subscribe((suites: any) => {
        let testArray = [];
        suites.forEach(suite => {
          suite.forEach(test => {
            testArray.push(test);
          })
        });
        this.tfsVstsTests.tests = testArray;
        this.tfsVstsTests.testsDataSource.data = this.addDisableOption(this.tfsVstsTests.tests);
        this.tfsVstsTests.testsDataSource.paginator = this.tfsVstsTests.testsPaginator;
        this.tfsVstsTests.testsDataSource.sort = this.tfsVstsTests.testsSort;
        stepper.next();
        this.tfsVstsSuites.disableAllSuites();
        this.loading = false;
      })
    } else {
      stepper.next();
      this.loading = false;
    }

  }

  resumo(stepper: MatStepper) {
    if (this.tfsVstsTests.testsSelection.selected.length == 0) {
      this.modal.modalErro("Você deve selecionar ao menos um teste");
      return;
    }
    this.tfsVstsTests.disableAllTests();
    this.resume.init();
    stepper.next();
  }

  import() {
    if (this.resume.plansToImport.length == 0) {
      this.modal.modalErro("Você deve processar todos os passos antes de realizar a importação!");
      return;
    }

    this.importDisabled = true;
    this.loading = true;

    this.tfsVstsService.import(this.tfsVstsServers.urlDestino.value, this.tfsVstsServers.credentialsVsts, this.tfsVstsProjects.projetoDestino.value, this.tfsVstsPlans.planoDestino.value, this.resume.plansToImport, this.vstsType).subscribe(res => {
      this.modal.modalSucesso("Importação em andamento. Aguarde alguns minutos e acesso o plano de testes criado no VSTS");
      this.loading = false;
    });
  }
}
