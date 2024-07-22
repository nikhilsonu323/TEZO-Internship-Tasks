import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'side-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.css'
})
export class SideNavbarComponent {
  @Output() onMinimizeNavbarClicked: EventEmitter<boolean> = new EventEmitter();
  isNavbarMinimized: boolean = false;

  toggleNavbar(){
    this.onMinimizeNavbarClicked.emit(!this.isNavbarMinimized);
    if(this.isNavbarMinimized)
      setTimeout(()=>{ this.isNavbarMinimized = !this.isNavbarMinimized },300);
    else
      setTimeout(()=>{ this.isNavbarMinimized = !this.isNavbarMinimized },150);
  }

}
