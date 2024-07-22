import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Employee } from '../../../Models/Employee';
import { FilterService } from '../../../Services/filter.service';
import { Router } from '@angular/router';
import { Columns } from '../../../Models/Enums';

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './employee-data-table.component.html',
  styleUrl: './employee-data-table.component.css'
})
export class EmployeeDataTableComponent implements OnInit{
  
  columnNames = Columns;
  sortedColumn: Columns | null = null; 
  employeesData: Employee[] = []; 
  isSelectAllCheckboxChecked:  boolean = false;
  selectedEmployees: Set<string> = new Set();
  selectedEllipsis: string = '';
  defaultImage = "assets/images/user3.png";

  tableColumns =[
    {name: 'USER', columnType: Columns.Name},
    {name: 'LOCATION', columnType: Columns.Location},
    {name: 'DEPARTMENT', columnType: Columns.Department},
    {name: 'ROLE', columnType: Columns.Role},
    {name: 'EMP NO', columnType: Columns.EmpNo},
    {name: 'STATUS', columnType: Columns.Status},
    {name: 'JOIN DT', columnType: Columns.JoiningDate},
  ]
  
  constructor(private apiService: ApiService, private filterService: FilterService,private router: Router){ }

  ngOnInit(): void {
    this.apiService.getEmployees().subscribe((data)=>{
      this.employeesData = data;
    })

    this.filterService.filterChange.subscribe((filterData)=>{
      this.apiService.getFilteredEmployee(filterData).subscribe(data =>{
        //Setting configs to defaults
        this.selectedEmployees.clear();
        this.isSelectAllCheckboxChecked = false;
        this.sortedColumn = null;
        this.selectedEllipsis = '';

        this.employeesData = data;
      });
    });

    this.filterService.onExportClick.subscribe(()=>{
      this.downloadData()
    })
  }

  sort(columnName: Columns){
    switch(columnName){
      case Columns.Name:
        this.employeesData.sort(function (a, b) { return a.firstName.localeCompare(b.firstName) });
        break;

      case Columns.Location:
        this.employeesData.sort(function (a, b) { return a.location.localeCompare(b.location) });
        break;

      case Columns.Department:
        this.employeesData.sort(function (a, b) { return a.role.department.localeCompare(b.role.department) });
        break;

      case Columns.Role:
        this.employeesData.sort(function (a, b) { return a.role.roleName.localeCompare(b.role.roleName) });
        break;

      case Columns.EmpNo:
        this.employeesData.sort(function (a, b) { return a.empNo.localeCompare(b.empNo) });
        break;

      case Columns.Status:
        this.employeesData.sort(function (a, b) { return a.status.localeCompare(b.status) });
        break;

      case Columns.JoiningDate:
          this.employeesData.sort(
              function (emp1, emp2) {
                let a = new Date(emp1.joiningDate);
                let b = new Date(emp2.joiningDate);
                if (a.getTime() > b.getTime())
                    return 1;
                else if (a.getTime() < b.getTime())
                    return -1;
                else
                    return 0;
              });
    }
    //If column is already sorted sorting it in desecending order
    if(this.sortedColumn !== null && this.sortedColumn == columnName){
        this.employeesData.reverse();
        this.sortedColumn = null;
    }
    else{
        this.sortedColumn = columnName;
    }
  }

  onCheckBoxClick(empNo: string){
    if(this.selectedEmployees.has(empNo)){
      this.selectedEmployees.delete(empNo);
    }
    else{
      this.selectedEmployees.add(empNo);
    }
    this.isSelectAllCheckboxChecked = this.selectedEmployees.size === this.employeesData.length;
  }

  onSelectAllCheckBoxChange(event: any){
    this.isSelectAllCheckboxChecked = event.target.checked;
    if(this.isSelectAllCheckboxChecked){
      this.employeesData.forEach(emp => {
        this.selectedEmployees.add(emp.empNo);
      });
    }
    else{
      this.selectedEmployees.clear();
    }
  }

  deleteSelectedEmployees(){
    this.apiService.deleteEmployees(this.selectedEmployees).subscribe();
    this.employeesData = this.employeesData.filter(emp =>{
      return !this.selectedEmployees.has(emp.empNo);
    });
    this.selectedEmployees.clear();
  }

  viewDetails(){
    this.router.navigate(["employees",'view',this.selectedEllipsis]);
  }

  editDetails(){
    this.router.navigate(["employees",'edit',this.selectedEllipsis]);
  }

  deleteEmployee(){
    this.apiService.deleteEmployee(this.selectedEllipsis).subscribe(() =>{
        this.employeesData = this.employeesData.filter(emp => emp.empNo != this.selectedEllipsis);
        this.selectedEmployees.delete(this.selectedEllipsis);
        this.selectedEllipsis = '';
      })
  }
  
  private downloadData() {
    if(this.employeesData.length == 0) return;
    let csvData: string[] = [];
    let csvRow: any[] = [];
    // Object.keys(this.employeesData).forEach(key => csvRow.push(key));
    csvRow =['Employee Number','Name', 'Email', 'Location', 'Department', 'RoleName', 'Status', 'Joining Date', 'Date of birth'];
    csvData.push(csvRow.join(','));
    console.log(csvRow);
    
    this.employeesData.forEach(emp =>{
      // Object.keys(emp).forEach(key => csvRow.push(emp[key]));
      csvRow = [emp.empNo, emp.firstName+' '+emp.lastName, emp.email, emp.location, emp.role.department, emp.role.roleName, emp.status, emp.joiningDate, emp.dateOfBirth]
      csvData.push(csvRow.join(','));
    });

    let link = document.createElement("a");
    link.download = "Employees";
    let blob = new Blob([csvData.join("\n")], { type: "text/csv" });
    link.href = URL.createObjectURL(blob);
    link.click();
    link.remove();

    URL.revokeObjectURL(link.href);
  }

}


