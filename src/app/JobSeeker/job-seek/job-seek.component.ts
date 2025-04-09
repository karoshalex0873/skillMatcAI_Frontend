import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-job-seek',
  imports: [CommonModule, RouterModule, RouterLink, IconsModule, RouterLink, RouterLinkActive],
  templateUrl: './job-seek.component.html',
  styleUrl: './job-seek.component.css'
})
export class JobSeekComponent {
  // avatarUrl
  avatarUrl:string='assets/profile.png'

  isMobileMenuOpen = false;

  links = [
    {
      path: 'starts',
      label: 'Dashboard',
      icon: 'ionHomeOutline'
    },
    {
      path: 'aut',
      label: 'Job Matches',
      icon: 'ionBriefcaseOutline'
    },
    {
      path: 'applications',
      label: 'Applications',
      icon: 'ionDocumentTextOutline'
    },
    {
      path: 'profile',
      label: 'Skill Profile',
      icon: 'ionPersonCircleOutline'
    },
    {
      path: 'Notifications',
      label: 'Notifications',
      icon: 'ionNotifications'
    },
    {
      path: 'careerPath',
      label: 'Career Paths',
      icon: 'ionRocketOutline'
    }
  ]
  //logout function
  logout() {
    console.log('Logged out');
  }

}
