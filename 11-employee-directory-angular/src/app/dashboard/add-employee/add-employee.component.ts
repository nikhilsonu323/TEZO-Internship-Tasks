import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncValidators, CustomValidator } from './CustomValidators';
import { Department, Location, Manager, Project } from '../../Models/AddEmployeeOptions';
import { Role } from '../../Models/Role';
import { AddEmployeeAndRoleService } from '../../Services/add-employee.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { AddEmployee } from '../../Models/AddEmployee';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { Employee } from '../../Models/Employee';
import { ToasterService } from '../../Services/toaster.service';
import { Observable } from 'rxjs';
import { FormModes } from '../../Models/Enums';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit{

  employeeForm!: FormGroup;
  locations: Location[] = [];
  departments: Department[] = [];
  managers: Manager[] = [];
  jobTitles: Role[] = [];
  projects: Project[] = [];
  employee: Employee | null = null;
  isEmployeeAdded: boolean = false;
  Modes  = FormModes;
  formMode: FormModes = FormModes.Add;
  imageData: string | null = null;
  defaultImageData = 'assets/images/user3.png';
  errorMessages = {
    required: 'This Field is Required',
    email: 'Invalid Email',
    name: 'Name should only contain alphabets',
    empno: "The employee ID should start with 'TZ' followed by four digits, such as 'TZ0000'",
    mobileNumber: 'The mobile number should be 10 digits long, optionally preceded by a country code. For example, +91 1234567890 or 1234567890'
  }

  constructor(private addEmployeeService: AddEmployeeAndRoleService,private router: Router, 
    private asyncValidator: AsyncValidators, private activatedRoute: ActivatedRoute,
    private apiService: ApiService, private toasterService: ToasterService) { 
      this.initiateForm();
  }

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe((data) =>{})
    // this.activatedRoute.params.subscribe(data => console.log(data));
    this.formMode = this.activatedRoute.snapshot.data['mode'];
    let empNo: string | null =  this.activatedRoute.snapshot.paramMap.get('id');

    if(this.formMode === FormModes.View){
      this.employeeForm.disable();
    }

    if(this.formMode === FormModes.Add){
      this.employeeForm.get('empno')?.addAsyncValidators(this.asyncValidator.employeeNumberValidator.bind(this.asyncValidator));
    }
    
    else if(this.formMode === FormModes.Edit || this.formMode === FormModes.View){
      let regex = new RegExp('^TZ[0-9]{4}$');
      if(empNo === null || !regex.test(empNo)){
        this.navigateToEmployees();
        return;
      }
      this.apiService.getEmployeeById(empNo).subscribe(emp =>{
        if(emp === null) {
          this.navigateToEmployees();
          return;
        }
        this.employee = emp;
        this.imageData = emp.imageData
        this.setEmployeeForm(emp);
      })
    }
    this.loadDropdownOptions();
  }

  onFormSubmit(){
    if(this.formMode === FormModes.View) return;
    if(this.employeeForm.invalid){
      this.employeeForm.markAllAsTouched();
      return;
    } 
    let employee = this.getEmployeeDetailsFromForm();
  
    let employeeObs: Observable<Object>;
    if(this.formMode === FormModes.Add)
      employeeObs = this.addEmployeeService.addEmployee(employee)
    else
      employeeObs = this.addEmployeeService.editEmployee(employee)

    employeeObs.subscribe({ next: () => this.onSuccessAddOrEditEmployee(), error: (err) => this.onErrorAddOrEditEmployee(err)});
  }

  onCancel(){
    this.navigateToEmployees()
  }

  canExit(){
    if(this.employeeForm.dirty && !this.isEmployeeAdded)
      return confirm("Do you want to navigate away without saving changes");
    return true;
  }

  onProfileInputChange(event: any){ 
    let fileReader = new FileReader();
    let input = event.target as HTMLInputElement;

    if(input.files == null || input.files.length == 0)
      return;

    var error = CustomValidator.validateProfile(input.files[0]);
    if(error !== null){
      this.toasterService.showToasterMessage(error, false);
      return;
    }
    fileReader.readAsDataURL(input.files[0]);
    fileReader.onload = ()=>{
      this.imageData = fileReader.result?.toString() ?? null;
    }
  }

  private loadDropdownOptions(){
    this.addEmployeeService.getDepartments().subscribe(data => this.departments = data);

    this.addEmployeeService.getLocations().subscribe(data => this.locations = data);

    this.addEmployeeService.getManagers().subscribe(data => this.managers = data);

    this.addEmployeeService.getProjects().subscribe(data => this.projects = data);

    this.employeeForm.get('department')?.valueChanges.subscribe(selectedDepartment =>{
      if(this.toNumberOrNull(selectedDepartment) === null) return;

      this.addEmployeeService.getJobTitles(selectedDepartment).subscribe(data => this.jobTitles = data);
      let jobTitle = this.employeeForm.get('jobTitle');
      jobTitle?.setValue(this.employee?.roleId ?? '');
      this.employee = null;
      jobTitle?.markAsUntouched();
      
      if(this.employeeForm.get('department')?.valid && jobTitle?.disabled){
        jobTitle?.enable();
      }
      else if(this.employeeForm.get('department')?.invalid && jobTitle?.enabled){
        jobTitle?.disable();
      }
    });
  }

  private setEmployeeForm(emp: Employee | null){
    this.employeeForm.setValue({
      empno: emp?.empNo ?? null,
      firstName: emp?.firstName ?? null,
      lastName: emp?.lastName ?? null,
      email: emp?.email ?? null,
      dateOfBirth: emp?.dateOfBirth ?? null,
      mobileNumber: emp?.mobileNumber ?? null,
      joiningDate: emp?.joiningDate ?? null,
      location: emp?.locationId ?? '',
      jobTitle: emp?.roleId ?? '',
      department: emp?.role.departmentId ?? '',
      project: emp?.project ?? '',
      manager: emp?.manager ?? '',
    })
  }

  private initiateForm(){
    this.employeeForm = new FormGroup({
      empno: new FormControl(null,[Validators.required, Validators.pattern("^TZ[0-9]{4}$")]),
      firstName: new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-Z]+$")]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+$")]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      dateOfBirth: new FormControl(null),
      mobileNumber: new FormControl(null, Validators.pattern("^[0-9]{10}$")),
      joiningDate: new FormControl(null, [Validators.required,CustomValidator.joiningDate]),
      location: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      project: new FormControl(''),
      manager: new FormControl(''),
    }, CustomValidator.ageValidator);
    this.employeeForm.get('jobTitle')?.disable();
  }

  private getEmployeeDetailsFromForm(){
    let dob = this.employeeForm.get('dateOfBirth')?.value;
    let manager = this.employeeForm.get('manager')?.value;
    dob = dob?.length != 0 ? dob : null; 
    let employee: AddEmployee = {
      empNo: this.employeeForm.get('empno')?.value,
      firstName: this.employeeForm.get('firstName')?.value,
      lastName: this.employeeForm.get('lastName')?.value,
      email: this.employeeForm.get('email')?.value,
      dateOfBirth: dob ? dob : null ,
      mobileNumber: this.employeeForm.get('mobileNumber')?.value,
      joiningDate: this.employeeForm.get('joiningDate')?.value,
      roleId: this.employeeForm.get('jobTitle')?.value,
      locationId: this.employeeForm.get('location')?.value,
      projectId: this.toNumberOrNull(this.employeeForm.get('project')?.value),
      managerId: manager ? manager : null,
      statusId: 1,
      imageData: this.imageData
    }

    
    return employee;
  }

  private navigateToEmployees(){
    this.router.navigate(['employees']);
  }

  private toNumberOrNull(value: string | null){
    if(value === null || value.length == 0 || Number.isNaN(value)) {
      return null;
    }
    return Number(value);
  }
  
  private onSuccessAddOrEditEmployee(){
    this.isEmployeeAdded = true;
    let message = this.formMode == FormModes.Add ? 'Employee details Added Sucessfully' : 'Employee details Updated Sucessfully';
    this.toasterService.showToasterMessage(message, true);
    //Handle For success
    this.navigateToEmployees();
    // this.setDefaultValuesToForm();
  }

  private onErrorAddOrEditEmployee(err: any){
    this.toasterService.showToasterMessage('Internal Server Error', false);
    this.isEmployeeAdded = false
  }

  private setDefaultValuesToForm(){
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      location: '',
      jobTitle: '',
      department: '',
      project: '',
      manager: ''
    })
  }

}
