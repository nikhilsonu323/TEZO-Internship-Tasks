import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../Models/Employee';
import { FilterContent } from '../Models/FilterContent';
import { Role } from '../Models/Role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) { }
  private employeesUrl = environment.employeesUrl;
  private rolesUrl = environment.rolesUrl;
  
  getEmployees(){
    return this.http.get<Employee[]>(this.employeesUrl);
  }

  getEmployeeById(id: string){
    return this.http.get<Employee | null>(this.employeesUrl+'/'+id);
  }

  getFilteredEmployee(filters: FilterData){
    var filterData = {
      alphabets: Array.from(filters.alphabets),
      statusIds: Array.from(filters.dropdownFilters.status),
      locationIds: Array.from(filters.dropdownFilters.location),
      departmentIds: Array.from(filters.dropdownFilters.departments)
    };
    return this.http.post<Employee[]>(this.employeesUrl+'/filter', filterData);
  }

  getEmployeesInRole(id: number){
    return this.http.get<Employee[]>(this.employeesUrl+'/role/'+id);
  }

  deleteEmployees(empNos: Set<string>){
    return this.http.delete<string[]>(this.employeesUrl,{body: Array.from(empNos)});
  }

  deleteEmployee(empNo: string){
    return this.http.delete(this.employeesUrl + '/'+ empNo);
  }

  getRoles(){
    return this.http.get<Role[]>(this.rolesUrl);
  }

  getRoleById(id: number){
    return this.http.get<Role | null>(this.rolesUrl +"/" + id);
  }

  getRolesWithEmployees(){
    return this.http.get<Role[]>(this.rolesUrl+'/employees');
  }
  
  getFilteredRoles(filters: FilterContent){
    return this.http.post<Role[]>(this.rolesUrl+'/filter',
      {
        locationIds: Array.from(filters.location), 
        departmentIds: Array.from(filters.departments)
      });
  }

}

interface FilterData{
  alphabets: Set<string>,
  dropdownFilters: FilterContent
}