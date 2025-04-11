import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { IconsModule } from '../../helpers/icons.module';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-job-seek',
  imports: [CommonModule, RouterModule, RouterLink, IconsModule, RouterLink, RouterLinkActive,RouterOutlet],
  templateUrl: './job-seek.component.html',
  styleUrl: './job-seek.component.css'
})
export class JobSeekComponent {
  // avatarUrl
  avatarUrl:string='assets/profile.png'

  authService = inject(AuthService)
  router = inject(Router);

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
    this.authService.logout().subscribe({
      next:()=>{
        this.router.navigate(['/login'])
      },
      error:(err)=>{
        console.error('logout failed')
      }
    })
  }

}
