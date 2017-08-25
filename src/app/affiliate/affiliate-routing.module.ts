import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { AffiliateComponent } from './affiliate.component';

const routes: Routes = Route.withShell([
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'affiliate-area', component: AffiliateComponent, data: { title: extract('Affiliate area') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AffiliateRoutingModule { }
