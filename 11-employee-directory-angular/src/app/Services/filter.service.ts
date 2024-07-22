import { Injectable, Output, EventEmitter } from '@angular/core';
import { FilterContent } from '../Models/FilterContent';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  @Output() filterChange: EventEmitter<{
    alphabets: Set<string>,
    dropdownFilters: FilterContent
  }> = new EventEmitter();

  @Output() onExportClick: EventEmitter<null> = new EventEmitter();

  constructor() { }

  onFilterChange(data: {
    alphabets: Set<string>,
    dropdownFilters: FilterContent
  }){
    this.filterChange.emit(data);
  }

  downloadData(){
    this.onExportClick.emit();
  }

}
