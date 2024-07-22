import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FilterContent } from '../../Models/FilterContent';
import { FilterApiService } from '../../Services/filter-api.service';
import { FilterHandler, FilterOptions, OptionDisplayHandler } from '../../Models/DropdownFilterModels';

@Component({
  selector: 'dropdown-filter',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './dropdown-filter.component.html',
  styleUrl: './dropdown-filter.component.css'
})
export class DropdownFilterComponent implements OnInit{
  selectedFilters = new FilterContent();
  //Retrive data from api
  filterData = new FilterOptions();  
  toDisplayFilterOptions = new OptionDisplayHandler();

  constructor(private filterApi: FilterApiService){ }

  @Output() onFilterChange: EventEmitter<FilterContent> = new EventEmitter();
  @Input() filtersHandler = new FilterHandler();
 
  @ViewChild('statusDropdown') statusDropdown?: ElementRef;
  @ViewChild('locationDropdown') locationDropdown?: ElementRef;
  @ViewChild('departmentDropdown') departmentDropdown?: ElementRef;


  ngOnInit(): void {
    document.body.addEventListener('click', (event: Event) => this.handleClickOutside(event));

    this.filterApi.getStatus().subscribe(data =>{
      this.filterData.status = data;
    })
    
    this.filterApi.getLocations().subscribe(data =>{
      this.filterData.location = data;
    })

    this.filterApi.getDepartments().subscribe(data =>{
      this.filterData.departments = data;
    })
  }

  onOptionClick(set: Set<number>, value: number){
    if(set.has(value)){
      set.delete(value);
    }
    else{
      set.add(value);
    }
  }

  clearSelectedOptions(){
    this.selectedFilters = new FilterContent();
    this.onFilterChange.emit(this.selectedFilters);
  }

  apply(){
    this.onFilterChange.emit(this.selectedFilters);
  }

  private handleClickOutside(event: Event) {
    if (event.target !== this.statusDropdown?.nativeElement && !this.statusDropdown?.nativeElement.contains(event.target as Node)) {
      this.toDisplayFilterOptions.Status = false;
    }
    
    if (event.target !== this.locationDropdown?.nativeElement && !this.locationDropdown?.nativeElement.contains(event.target as Node)) {
      this.toDisplayFilterOptions.Location = false;
    }
    
    if (event.target !== this.departmentDropdown?.nativeElement && !this.departmentDropdown?.nativeElement.contains(event.target as Node)) {
      this.toDisplayFilterOptions.Department = false;
    }
  }
  
}


