import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-dash-recruter',
  imports: [CommonModule,RouterModule,RouterLink,IconsModule,RouterLinkActive],
  templateUrl: './dash-recruter.component.html',
  styleUrl: './dash-recruter.component.css'
})
export class DashRecruterComponent {
  isMobileMenuOpen = false;
  links = [
    {
      path: 'postJob',
      label: 'Add a Job post',
      icon: 'ionAdd'
    },
    {
      path: 'hireApplicants',
      label: 'Hire Applicants',
      icon: 'ionPeople'
    },
    {
      path: 'querry',
      label: 'AI Assistant',
      icon: 'ionSparkles'
    },
    {
      path: 'interviews',
      label: 'Interviews',
      icon: 'ionCalendar'
    },
    {
      path: 'analytics',
      label: 'Analytics',
      icon: 'ionStatsChart'
    }
  ]
  //logout function
  logout() {
    console.log('Logged out');
  }
}
