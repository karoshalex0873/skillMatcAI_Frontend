import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import {RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashbord',
  imports: [CommonModule,IconsModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './admin-dashbord.component.html',
  styleUrl: './admin-dashbord.component.css'
})
export class AdminDashbordComponent {

  //avatarUrl image
  avatarUrl:string='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYLCZyGFOpPKEpvJ5ux8_jmjGhGdPwNKFwPA&s'


  isMobileMenuOpen = false;
  links = [
    {
      path: 'users',
      label: 'Manage Users',
      icon: 'ionPeople'
    },
    {
      path: 'system',
      label: 'Syetem Performnace',
      icon: 'ionHardwareChip'
    },
    {
      path: 'aiAccuracy',
      label: 'AI Accuracy',
      icon: 'ionSparkles'
    },
    {
      path: 'security',
      label: 'security opimization',
      icon: 'ionShieldCheckmark'
    }
  ]
  //logout function
  logout() {
    console.log('Logged out');
  }
}
