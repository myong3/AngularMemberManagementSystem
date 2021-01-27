import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { appPath } from './app-path.const';

const routes: Routes = [{
  path: appPath.home,
  loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
},
{
  path: appPath.login,
  loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
},
{
  path: appPath.signup,
  loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
},
{
  path: appPath.backstage,
  loadChildren: () => import('./backstage/backstage.module').then(m => m.BackstageModule)
},
{
  path: '**',
  redirectTo: appPath.home,
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    // enableTracing: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
