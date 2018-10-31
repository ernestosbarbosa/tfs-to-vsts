import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports:[
    MaterialModule
  ],
  exports: [
    MaterialModule,
    LoaderComponent
  ],
  declarations: [
    LoaderComponent
  ],
  entryComponents: [
    LoaderComponent
  ]
})
export class LoaderModule { }
