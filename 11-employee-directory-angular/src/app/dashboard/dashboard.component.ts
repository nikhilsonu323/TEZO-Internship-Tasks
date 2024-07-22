import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { NgClass } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SideNavbarComponent, NgClass, SearchBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isNavbarMinimized: boolean = false;

  toggleNavbar(isNavbarMinimized: boolean){
    this.isNavbarMinimized = isNavbarMinimized;
  }
}
