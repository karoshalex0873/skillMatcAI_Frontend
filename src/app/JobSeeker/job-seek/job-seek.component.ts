import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { IconsModule } from '../../helpers/icons.module';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-job-seek',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, IconsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './job-seek.component.html',
  styleUrl: './job-seek.component.css'
})
export class JobSeekComponent {
  // Dependencies
  authService = inject(AuthService);
  userInfo = inject(UserService);
  router = inject(Router);

  // User Info
  name: string = '';
  userName: string = '';
  profileImage: string | null = null;
  initial: string = '';
  avatarUrl: string = '';
  avatarBg: string = '#4D96FF';

  // Mobile menu toggle
  isMobileMenuOpen = false;

  // Navigation links
  links = [
    // { path: 'starts', label: 'Dashboard', icon: 'ionHomeOutline' },
    { path: 'aut', label: 'Job Matches', icon: 'ionBriefcaseOutline' },
    { path: 'applications', label: 'Applications', icon: 'ionDocumentTextOutline' },
    { path: 'profile', label: 'Update profile', icon: 'ionPersonCircleOutline' },
    { path: 'Notifications', label: 'Notifications', icon: 'ionNotifications' },
    { path: 'careerPath', label: 'Career Paths', icon: 'ionRocketOutline' }
  ];

  // On init, fetch user info
  ngOnInit(): void {
    this.userInfo.getUserInfo().subscribe({
      next: (data) => {
        this.name = data.user.name;
        const firstName = this.name.split(' ')[0];
        this.userName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

        if (data.user.avatar) {
          this.profileImage = data.user.avatar;
          this.avatarUrl = this.profileImage ?? '';
        } else {
          this.initial = this.userName.charAt(0);
          this.avatarUrl = '';
          this.avatarBg = this.getRandomBg();
        }
      },
      error: (err) => {
        console.error('Failed to fetch user info:', err);
      }
    });
  }

  // Random background color for initials
  getRandomBg(): string {
    const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFCD3C', '#845EC2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Logout function
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        console.error('Logout failed');
      }
    });
  }
}
