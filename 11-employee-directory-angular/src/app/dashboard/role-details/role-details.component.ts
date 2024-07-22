import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../Models/Employee';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.css'
})
export class RoleDetailsComponent implements OnInit{

  employees: Employee[] = [];
  defaultImage = 'assets/images/user3.png';

  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id");

    if(id == null || Number.isNaN(Number(id))){
      this.router.navigate(["roles"]);      
    }

    else{
      this.apiService.getEmployeesInRole(Number(id ?? 1)).subscribe(data =>{
        this.employees = data;
      })
    }
  }

  viewEmployee(employeeId: string){
    this.router.navigate(["employees","view",employeeId]);
  }

}
