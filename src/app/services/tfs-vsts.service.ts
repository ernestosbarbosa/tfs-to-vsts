import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TfsVstsService {

  serverUrl: string = "http://localhost:3000/tfsvsts";

  constructor(
    private http: HttpClient
  ) { }

  getProjects(baseUrl: string, credentials: any, type: string) {
    return this.http.post(this.serverUrl + "/projects", {
      baseUrl: baseUrl,
      credentials: credentials,
      type: type
    });
  }

  getPlans(baseUrl: string, credentials: any, project: string, type: string) {
    return this.http.post(this.serverUrl + "/plans", {
      baseUrl: baseUrl,
      credentials: credentials,
      project: project,
      type: type
    });
  }

  getSuites(baseUrl: string, credentials: any, project: string, planId: number, type: string) {
    return this.http.post(this.serverUrl + "/suites", {
      baseUrl: baseUrl,
      credentials: credentials,
      project: project,
      planId: planId,
      type: type
    });
  }

  getTestCases(baseUrl: string, credentials: any, project: string, planId: number, suiteId: number, type: string) {
    return this.http.post(this.serverUrl + "/tests", {
      baseUrl: baseUrl,
      credentials: credentials,
      project: project,
      planId: planId,
      suiteId: suiteId,
      type: type
    });
  }

  getWorkItemById(baseUrl: string, credentials: any, witId: number, type: string) {
    return this.http.post(this.serverUrl + "/wit", {
      baseUrl: baseUrl,
      credentials: credentials,
      witId: witId,
      type: type
    });
  }

  import(baseUrl: string, credentials: any, projectDest: string, planDest: any, plans: any, type: string) {
    return this.http.post(this.serverUrl + "/import", {
      baseUrl: baseUrl,
      credentials: credentials,
      project: projectDest,
      plan: planDest,
      type: type,
      plans: plans
    });
  }
}
