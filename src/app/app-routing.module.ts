import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    component: UserComponent,
    path: 'user'
  },
  {
    component: AppComponent,
    path: ''
  },
  {
    component: AppComponent,
    path: '**'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
