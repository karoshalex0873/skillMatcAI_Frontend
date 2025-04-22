import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Job } from '../../helpers/types';
import { JobService } from '../../service/job.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../helpers/environment';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule, IconsModule, RouterModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  // properties for job card
  jobs: Job[] = []
  isLoading = true; // Add loading state
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private jobService: JobService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.jobService.getJob().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.jobs = data;
          this.isLoading = false;
        }, 2000);
      },
      error: (err) => {
        setTimeout(() => {
          this.errorMessage = err.error?.message || err.message
          this.isLoading = false;
        }, 2000);
      }
    });
  }

  // applpy
  applyForJob(job_id: number) {
    // Clear previous messages
    this.clearMessages();
    const token = sessionStorage.getItem('accessToken');
    this.http.post(
      `${environment.apiUrl}/jobs/apply/${job_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.successMessage = 'Application successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/jobs/applications']);
          this.clearMessages();
        }, 2500); // Give users 2.5 seconds to see the message
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = err.error?.message || err.message;
          setTimeout(() => this.clearMessages(), 3000); // Show error message for 3 seconds
          return;
        }
        const msg = "something went wrong, please try again later";
        this.errorMessage = msg;
        setTimeout(() => this.clearMessages(), 4000);
      }
    });
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }


  getMatchColor(percentage: number): string {
    if (percentage >= 85) return 'bg-green-400/20 text-green-400';
    if (percentage >= 70) return 'bg-yellow-400/20 text-yellow-400';
    return 'bg-red-400/20 text-red-400';
  }

}
