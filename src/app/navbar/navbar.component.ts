import { Component } from '@angular/core';
import { IconsModule } from '../helpers/icons.module';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconsModule,RouterLink],
  templateUrl:'./navbar.component.html',
  
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
