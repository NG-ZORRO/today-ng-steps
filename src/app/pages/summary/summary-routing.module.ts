import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary.component';
import { InitGuardService } from '../../services/init-guard/init-guard.service';

const routes: Routes = [
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [ InitGuardService ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SummaryRoutingModule { }
