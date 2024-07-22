import { Component, Input } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() heading: string = '';

  constructor(private authService: AuthService){ }

  signout(){
    this.authService.logout();
  }
}
