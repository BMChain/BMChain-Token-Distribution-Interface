import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import {MemberComponent} from "./member.component";

const routes: Routes = Route.withShell([
  { path: 'members-area', component: MemberComponent, data: { title: extract('Личный кабинет') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MemberRoutingModule { }
