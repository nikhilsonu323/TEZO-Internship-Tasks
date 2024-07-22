import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Models/Users';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit {
 
  showLogout = false;
  @ViewChild('logoutContainer') logoutContainer?: ElementRef;
  @ViewChild('userDetails') userDetails!: ElementRef;
  user: User | null = null;

  constructor(private authService: AuthService){ }

  ngOnInit(): void {
    document.body.addEventListener('click', (event: Event) => this.handleClickOutside(event));
    this.user = this.authService.user;
  }

  toggle(){    
    this.showLogout = !this.showLogout;
  }

  logout(){
    this.authService.logout();
  }

  private handleClickOutside(event: Event) {
    if (event.target !== this.logoutContainer?.nativeElement && !this.logoutContainer?.nativeElement.contains(event.target as Node) &&
        event.target !== this.userDetails.nativeElement && !this.userDetails.nativeElement.contains(event.target as Node)) {
      this.showLogout = false;
    }
  }

}
