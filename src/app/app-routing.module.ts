import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { ArtikelsComponent } from './artikels/artikels.component';
import { AdminComponent } from './admin/admin.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { ArtiklesAdminComponent } from './admin/artikles-admin/artikles-admin.component';

const routes: Routes = [
  {
    component: CategoriesComponent,
    path: 'categories'
  },
  {
    component: ArtiklesAdminComponent,
    path: 'artikels'
  },
  {
    component: AdminComponent,
    path: 'admin'
  },
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    component: UserComponent,
    path: 'user'
  },
  {
    component: ArtikelsComponent,
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
