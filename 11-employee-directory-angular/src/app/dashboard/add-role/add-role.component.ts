import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Location } from '../../Models/AddEmployeeOptions';
import { AddEmployeeAndRoleService } from '../../Services/add-employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { Observable, map } from 'rxjs';
import { ToasterService } from '../../Services/toaster.service';
import { Role } from '../../Models/Role';
import { FormModes } from '../../Models/Enums';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent implements OnInit {

  roleForm!: FormGroup;
  locations: Location[] = [];
  departments: Department[] = [];
  employees: {name: string, empNo: string, image: string | null}[] = [];
  isRoleAdded: boolean = false;
  selectedEmployees: Set<string> = new Set();
  Modes = FormModes;
  toDisplayEmployees = false;
  isSearchInputFocused = false;
  formMode: FormModes = FormModes.Add;
  searchText = '';
  roleId?: number;
  errorMessages = {
    required: 'This Field is Required',
  }
  defaultImage = 'assets/images/user3.png';

  @ViewChild('employeeList') employeeList!: ElementRef;

  constructor(private addRoleService: AddEmployeeAndRoleService,private router: Router, 
    private apiService: ApiService, private toasterService: ToasterService, private activatedRoute: ActivatedRoute) { 
      this.initiateForm();
    }

  ngOnInit(): void {
    this.formMode = this.activatedRoute.snapshot.data['mode'];
    let roleId: string | null =  this.activatedRoute.snapshot.paramMap.get('id');
    let existingEmployees: Set<string> = new Set(); 
    if(this.formMode == FormModes.Edit){
      if(roleId == null || Number.isNaN(Number(roleId))){
        this.navigateToRoles();
      }
      this.roleId = Number(roleId);
      this.apiService.getRoleById(this.roleId).subscribe(role =>{
        if(role == null){
          this.navigateToRoles();
          return;
        }

        this.setForm(role);
        role.employees?.forEach(emp => existingEmployees.add(emp.empNo));
      })
    }
    this.loadDropdownOptions(existingEmployees);
    document.body.addEventListener('click', (event: Event) => this.handleClickOutside(event));
  }

  onCheckBoxClick(empNo: string){
    if(this.selectedEmployees.has(empNo)){
      this.selectedEmployees.delete(empNo);
    }
    else{
      this.selectedEmployees.add(empNo);
    }
    console.log(this.selectedEmployees);
    
  }

  onSearchInputChange(inputEvent: Event){
    this.searchText = (inputEvent.target as HTMLInputElement).value;
  }

  onCancel(){
    this.router.navigate(['roles']);
  }

  onFormSubmit(){
    if(this.roleForm.invalid){
      this.roleForm.markAllAsTouched();
      return;
    }
    let role = this.getRoleFromForm();

    let roleObs: Observable<Object>;

    if(this.formMode == FormModes.Add)
      roleObs = this.addRoleService.addRole(role)
    
    else
      roleObs = this.addRoleService.editRole(role, this.roleId!)

    roleObs.subscribe({next: () => {
      this.isRoleAdded = true;
      this.onSuccessAddOrEditRole();
    }, 
    error: (err) => {
      this.onErrorAddOrEdit(err);
    }});
  }

  canExit(){
    if(this.roleForm.dirty && this.isRoleAdded)
      return confirm("Do you want to navigate away without saving changes");
    return true;
  }

  private setForm(role: Role){
    this.roleForm.setValue({
      roleName: role?.roleName ?? null,
      department: role?.departmentId ?? '',
      location: role?.locationId ?? '',
      description: role?.description ?? null,
    })
  }

  private getRoleFromForm(){
    let desc = this.roleForm.get('description')?.value;
    desc = desc !== null && desc.length === 0 ? null : desc;
    let role = {
      roleName: this.roleForm.get('roleName')?.value,
      departmentId: this.roleForm.get('department')?.value,
      locationId: this.roleForm.get('location')?.value,
      description: desc,
      employeeIds: Array.from(this.selectedEmployees)
    }
    return role;
  }

  private initiateForm(){
    this.roleForm = new FormGroup({
      roleName: new FormControl(null,[Validators.required]),
      department: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      description: new FormControl(null),
    });
    this.roleForm.get('jobTitle')?.disable(); 
  }

  private onSuccessAddOrEditRole(){
    this.isRoleAdded = true;
    let message = this.formMode == FormModes.Add ? 'Role details Added Sucessfully' : 'Role details Updated Sucessfully';
    this.toasterService.showToasterMessage(message, true);
    //Handle For success
    this.navigateToRoles();
  }

  private onErrorAddOrEdit(err: any){
    this.toasterService.showToasterMessage('Internal Server Error', false);
    this.isRoleAdded = false
  }

  private navigateToRoles(){
    this.router.navigate(['roles']);
  }
  
  private loadDropdownOptions(existingEmployeees: Set<string>){
    this.addRoleService.getDepartments().subscribe(data => this.departments = data);

    this.addRoleService.getLocations().subscribe(data => this.locations = data);

    this.apiService.getEmployees()
    .pipe(map( employees =>{
      return employees.map(emp => { return {name: emp.firstName+' '+emp.lastName, empNo: emp.empNo, image: emp.imageData}})
    }))
    .subscribe(data =>{ 
      this.employees = data.filter(emp => !existingEmployeees.has(emp.empNo))
    });
  }

  private handleClickOutside(event: Event) {
    if (event.target !== this.employeeList.nativeElement && !this.employeeList.nativeElement.contains(event.target as Node)) {
      this.toDisplayEmployees = false;
    }
  }
}
