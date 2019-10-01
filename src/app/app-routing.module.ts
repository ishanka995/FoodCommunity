import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BaseComponent} from './base/base.component';
import {MembersComponent} from './members/members.component';


const routes: Routes = [
  {path: '', component: BaseComponent},
  {path: 'members', component: MembersComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
