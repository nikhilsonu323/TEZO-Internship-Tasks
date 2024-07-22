import { Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { AddEmployeeComponent } from './dashboard/add-employee/add-employee.component';
import { RolesComponent } from './dashboard/roles/roles.component';
import { RoleDetailsComponent } from './dashboard/role-details/role-details.component';
import { AddRoleComponent } from './dashboard/add-role/add-role.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './RouteGuards/authGuards';
import { FormModes } from './Models/Enums';

export const routes: Routes = [
    { path: '', redirectTo: 'employees', pathMatch:'full'},
    { path: 'login', component: LoginComponent},
    { path: '', component: DashboardComponent, canActivate: [authGuard] ,children: [
        { path: 'employees', component: HomeComponent, children: []},
        { path: 'employees/add', component: AddEmployeeComponent, canDeactivate: [(comp: AddEmployeeComponent) => comp.canExit()], data: {mode: FormModes.Add}},
        { path: 'employees/edit/:id', component: AddEmployeeComponent, canDeactivate: [(comp: AddEmployeeComponent) => comp.canExit()], data: {mode: FormModes.Edit}},
        { path: 'employees/view/:id', component: AddEmployeeComponent, data: {mode: FormModes.View}},
        { path:'roles', component: RolesComponent},
        { path:'roles/:id/employees', component: RoleDetailsComponent},
        { path:'roles/add', component: AddRoleComponent, data: {mode: FormModes.Add}},
        { path:'roles/edit/:id', component: AddRoleComponent, data: {mode: FormModes.Edit}},
        ]
    },
];
