import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  
  selectedOption = {value: '/dashboard', name: 'Dashbooard'};
  showDropdown = false;
  routes: {[key: string]: string} = {
    '/dashboard' : 'Dashboard',
    '/active' : 'Active',
    '/completed' : 'Completed'
  }
  @Output() onAddTaskClick: EventEmitter<null> = new EventEmitter()
  @ViewChild('SelectedOption') selectedOptionDiv!: ElementRef;

  constructor(private router: Router, private authService: AuthService){ }

  ngOnInit(): void {
    let url = window.location.href.split('/');
    let currentRoute = '/'+url[url.length-1];
    this.selectedOption = { value: currentRoute, name: this.routes[currentRoute] }

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(event => {
      let url = (event as NavigationEnd).url;
      this.selectedOption = { value: url, name: this.routes[url] }
    });
  }
      
  getRoutesKeys(){
    return Object.keys(this.routes)
  }

  addTask() {
    this.onAddTaskClick.emit()
  }

  signout(){
    this.authService.logout();
  }

  onDropdownChange(route: typeof this.selectedOption){
    this.selectedOption = route;
    this.router.navigate([this.selectedOption.value]);
    this.showDropdown = false;
  }
  
  toggleDropdown(){
    this.showDropdown = !this.showDropdown;
  }

}
