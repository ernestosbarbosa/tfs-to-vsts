import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module'
import { LoaderModule } from './material/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent, ModalSimNao, ModalSuccess, ModalError } from './modal/modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsComponent } from './components/projects/projects.component';
import { ServersComponent } from './components/servers/servers.component';
import { PlansComponent } from './components/plans/plans.component';
import { SuitesComponent } from './components/suites/suites.component';
import { TestsComponent } from './components/tests/tests.component';
import { ResumeComponent } from './components/resume/resume.component';

@NgModule({
    declarations: [
        AppComponent,
        ModalComponent,
        ModalSimNao,
        ModalSuccess,
        ModalError,
        ProjectsComponent,
        ServersComponent,
        PlansComponent,
        SuitesComponent,
        TestsComponent,
        ResumeComponent
        ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        MaterialModule,
        LoaderModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        ModalComponent,
        ModalSimNao,
        ModalSuccess,
        ModalError
    ]
})
export class AppModule { }
