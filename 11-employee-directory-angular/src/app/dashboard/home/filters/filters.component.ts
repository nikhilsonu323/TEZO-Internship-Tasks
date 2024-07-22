import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { AlphabetFilterComponent } from './alphabet-filter/alphabet-filter.component';
import { DropdownFilterComponent } from '../../dropdown-filter/dropdown-filter.component';
import { FilterContent } from '../../../Models/FilterContent';
import { FilterService } from '../../../Services/filter.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [NgFor, AlphabetFilterComponent, DropdownFilterComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  selectedAlphabets: Set<string> = new Set();
  dropdownFilterValues: FilterContent = new FilterContent();

  constructor(private filterService: FilterService){ }

  alphabetFilterChange(selectedAlphabets: Set<string>){
    this.selectedAlphabets = selectedAlphabets;
    this.emitFilters();
  }
  
  dropdownFilterChange(values: FilterContent){
    this.dropdownFilterValues = values;
    this.emitFilters();
  }

  private emitFilters() {
    this.filterService.onFilterChange({
      alphabets: this.selectedAlphabets,
      dropdownFilters: this.dropdownFilterValues
    });
  }
}


