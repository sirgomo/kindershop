import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { ArtikelsComponent } from './artikels/artikels.component';
import { AdminComponent } from './admin/admin.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { ArtiklesAdminComponent } from './admin/artikles-admin/artikles-admin.component';
import { EinkaufskorbComponent } from './einkaufskorb/einkaufskorb.component';
import { KreditorenComponent } from './admin/kreditoren/kreditoren.component';
import { routeGuard } from './auth/route.guard';
import { WarenbuchungComponent } from './admin/warenbuchung/warenbuchung.component';
import { UserBestellungComponent } from './user/user-bestellung/user-bestellung.component';
import { BestellungenAdminComponent } from './admin/bestellungen-admin/bestellungen-admin.component';


const routes: Routes = [
  {
    component: BestellungenAdminComponent,
    path: 'admin-bestellung',
    canActivate: [routeGuard]
  },
  {
    component: UserBestellungComponent,
    path: 'user-bestellung',
  },
  {
    component: WarenbuchungComponent,
    path: 'einbuchen',
    canActivate: [routeGuard],
  },
  {
    component: KreditorenComponent,
    path: 'kreditor',
    canActivate: [routeGuard]
  },
  {
    component: CategoriesComponent,
    path: 'categories',
    canActivate: [routeGuard]
  },
  {
    component: EinkaufskorbComponent,
    path: 'korb',
  },
  {
    component: ArtiklesAdminComponent,
    path: 'artikels',
    canActivate: [routeGuard]
  },
  {
    component: AdminComponent,
    path: 'admin',
    canActivate: [routeGuard]
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
