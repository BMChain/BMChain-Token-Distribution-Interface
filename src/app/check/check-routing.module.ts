import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import {CheckComponent} from "./check.component";

const routes: Routes = Route.withShell([
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'check', component: CheckComponent, data: { title: extract('Check wallet') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CheckRoutingModule { }

