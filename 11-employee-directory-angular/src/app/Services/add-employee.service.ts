import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../Models/Role';
import { Department, Location, Manager, Project, Status } from '../Models/AddEmployeeOptions';
import { AddEmployee } from '../Models/AddEmployee';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddEmployeeAndRoleService {

  constructor(private http: HttpClient) { }
  private url = environment.baseUrl;

  getLocations(){
    return this.http.get<Location[]>(this.url+'/Locations');
  }
  
  getDepartments(){
    return this.http.get<Department[]>(this.url+'/Department');
  }
  
  getStatus(){
    return this.http.get<Status[]>(this.url+'/Status');
  }

  getProjects(){
    return this.http.get<Project[]>(this.url+'/Project');
  }

  getJobTitles(DepartmentId: number){
    return this.http.get<Role[]>(this.url+'/Roles/department/' + DepartmentId);
  }

  getManagers(){
    return this.http.get<Manager[]>(this.url+'/Employees/managers');
  }

  addEmployee(employee: AddEmployee){
    return this.http.post(this.url+'/Employees',employee);
  }

  editEmployee(employee: AddEmployee){
    return this.http.put(this.url+'/Employees',employee);
  }

  addRole(role: {
    roleName: string,
    departmentId: string,
    locationId: string,
    description: string | null,
    employeeIds: string[]
  }){
    return this.http.post(this.url+'/Roles', role);
  }

  editRole(role: {
    roleName: string,
    departmentId: string,
    locationId: string,
    description: string | null,
    employeeIds: string[]
  }, id: number){
    return this.http.put(this.url+'/Roles/'+id, role);
  }

}
