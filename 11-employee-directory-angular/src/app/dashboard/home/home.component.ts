import { Component } from '@angular/core';
import { FiltersComponent } from './filters/filters.component';
import { EmployeeDataTableComponent } from './employee-data-table/employee-data-table.component';
import { FilterService } from '../../Services/filter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FiltersComponent, EmployeeDataTableComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private service: FilterService) { }
  
  downloadData(){
    this.service.downloadData();
  }
}
