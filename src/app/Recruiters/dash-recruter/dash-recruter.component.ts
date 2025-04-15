import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { IconsModule } from '../../helpers/icons.module';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-dash-recruter',
  imports: [CommonModule, RouterModule, RouterLink, IconsModule, RouterLinkActive, RouterOutlet],
  templateUrl: './dash-recruter.component.html',
  styleUrl: './dash-recruter.component.css'
})
export class DashRecruterComponent {

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


  ngOnInit(): void {
    this.userInfo.getUserInfo().subscribe({
      next: (data) => {
        // Correctly access nested user data
        this.name = data.user.name; // Changed from data.name
        const firstName = this.name.split(' ')[0];
        this.userName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  
        if (data.user.avatar) {
          this.profileImage = data.user.avatar;
          this.avatarUrl = this.profileImage ?? '';
        } else {
          // Ensure initial is derived after this.name is set
          this.initial = this.name.charAt(0).toUpperCase(); // Directly use this.name
          this.avatarUrl = '';
          this.avatarBg = this.getRandomBg();
        }
      },
      error: (err) => {
        this.router.navigate(['/login']);
        console.error('Failed to fetch user info:', err);
      }
    });
  }

  getRandomBg(): string {
    const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFCD3C', '#845EC2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  //logout function
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
