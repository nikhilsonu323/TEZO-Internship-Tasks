import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'alphabet-filter',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './alphabet-filter.component.html',
  styleUrl: './alphabet-filter.component.css'
})
export class AlphabetFilterComponent {
  alphabets = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));
  selectedAlphabets: Set<string> = new Set();

  @Output() onFilterChange: EventEmitter<Set<string>> = new EventEmitter();

  onAlphabetClicked(alphabet: string){
    if(this.selectedAlphabets.has(alphabet))
      this.selectedAlphabets.delete(alphabet);
    else
      this.selectedAlphabets.add(alphabet);
    this.onFilterChange.emit(this.selectedAlphabets);
  }
  
  clearSelectedAlphabets(){
    this.selectedAlphabets.clear();
    this.onFilterChange.emit(this.selectedAlphabets);
  }
}
