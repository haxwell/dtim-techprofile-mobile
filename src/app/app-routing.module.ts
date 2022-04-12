import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',
      loadChildren: () => import('./home/home.module').then(x => x.HomePageModule) },
  { path: 'new-user',
    loadChildren: () => import('./new-user/new-user.module').then(x => x.NewUserPageModule) },
  { path: 'returning-user',
    loadChildren: () => import('./returning-user/returning-user.module').then(x => x.ReturningUserPageModule) },
  { path: 'admin',
      loadChildren: () => import('./admin/admin.module').then(x => x.AdminPageModule) },
  { path: 'user-tech-profile/:userId',
    loadChildren: () => import('./user-tech-profile/user-tech-profile.module').then(x => x.UserTechProfilePageModule) },
  { path: 'line-item-action-page/:userId/:lineItemId/:idx',
    loadChildren: () => import('./line-item-action-page/line-item-action-page.module')
      .then(x => x.LineItemActionPagePageModule) },
  { path: 'line-item-level-content-page/:userId/:lineItemId/:idx',
    loadChildren: () => import('./line-item-level-content-page/line-item-level-content-page.module')
      .then(x => x.LineItemLevelContentPagePageModule) },
  { path: 'user-question-detail/:userId/:questionId',
    loadChildren: () => import('./user-question-detail/user-question-detail.module').then(x => x.UserQuestionDetailPageModule) },
  { path: 'question-list/:lineItemId/:level',
      loadChildren: () => import('./admin/question-list/question-list.module').then(x => x.QuestionListPageModule) },
  { path: 'question-list',
    loadChildren: () => import('./admin/question-list/question-list.module').then(x => x.QuestionListPageModule) },
  { path: 'question-display/:questionId',
    loadChildren: () => import('./admin/question-display/question-display.module').then(x => x.QuestionDisplayPageModule) },
  { path: 'question-edit/new',
    loadChildren: () => import('./admin/question-edit/question-edit.module').then(x => x.QuestionEditPageModule) },
  { path: 'question-edit/:questionId',
    loadChildren: () => import('./admin/question-edit/question-edit.module').then(x => x.QuestionEditPageModule) },
  { path: 'tech-profile-edit',
    loadChildren: () => import('./tech-profile-edit/tech-profile-edit.module').then(x => x.TechProfileEditPageModule) },
  { path: 'tech-profile-line-item-edit/:lineItemId',
    loadChildren: () => import('./tech-profile-line-item-edit/tech-profile-line-item-edit.module').then(x => x.TechProfileLineItemEditPageModule) },
  { path: 'tech-profile-topic-edit/:topicId',
    loadChildren: () => import('./tech-profile-topic-edit/tech-profile-topic-edit.module').then(x => x.TechProfileTopicEditPageModule) },
  { path: 'tech-profile-question',
    loadChildren: () => import('./tech-profile-question/tech-profile-question.module').then(x => x.TechProfileQuestionPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
