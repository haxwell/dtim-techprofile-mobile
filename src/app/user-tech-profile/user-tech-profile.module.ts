import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserTechProfilePage } from './user-tech-profile.page';
import { TechProfileComponent } from './../tech-profile/tech-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserTechProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserTechProfilePage, TechProfileComponent]
})
export class UserTechProfilePageModule {}
