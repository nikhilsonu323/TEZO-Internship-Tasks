import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Role } from '../../Models/Role';
import { DropdownFilterComponent } from '../dropdown-filter/dropdown-filter.component';
import { FilterContent } from '../../Models/FilterContent';
import { ApiService } from '../../Services/api.service';
import { Router, RouterLink } from '@angular/router';
import { RoleDetailsComponent } from '../role-details/role-details.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle,DropdownFilterComponent, RouterLink, RoleDetailsComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{
  roles: Role[] = [];
  displayedImages: { [roleId: string]: string[] } = {};

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.getRolesWithEmployees().subscribe(data =>{
      this.roles = data;
      this.getEmployeeImagesInRole(4);
    });
  }

  onFiltersChange(selectedFilters: FilterContent){
    this.apiService.getFilteredRoles(selectedFilters).subscribe(data =>{
      this.roles = data;
    });
  }

  viewRoleDetails(id: number){
    this.router.navigate(["roles",id,"employees"]);
  }

  editRole(role: Role){
    this.router.navigate(['roles','edit',role.id]);
  }

  private getEmployeeImagesInRole(imagesCount: number){
    let defaultImage = "assets/images/user3.png";
    this.roles.forEach(role => {
      let images: string[] = [];
      let count = 0;
      this.displayedImages[role.id] = images;
      let i = 0;
      if(!role.employees) return;
      while(count < imagesCount && i < role.employees.length){
        if(role.employees[i].imageData != null){
          count += 1;
          images.push(role.employees[i].imageData!);
        }
        i+=1;
      }
      this.displayedImages[role.id] = Array(Math.min(role.employees.length, imagesCount) - count).fill(defaultImage).concat(images);
    })
    console.log(this.displayedImages);
  }
}

