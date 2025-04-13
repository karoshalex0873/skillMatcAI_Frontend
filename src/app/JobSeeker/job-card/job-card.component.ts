import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Job } from '../../helpers/types';
import { JobService } from '../../service/job.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule,IconsModule,RouterModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  // properties for job card
  jobs: Job[] = []
  isLoading = true; // Add loading state
  errorMessage: string = '';
  
  constructor(
    private jobService:JobService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.jobService.getJob().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage=`Something went wrong ⚠`
        console.error('Failed to fetch jobs:', err);
        this.isLoading = false;
      }
    });
  }

  // applpy
  applyForJob(job_id: number) {
    this.router.navigate(['/application', job_id]);
  }

  getMatchColor(percentage: number): string {
    if (percentage >= 85) return 'bg-green-400/20 text-green-400';
    if (percentage >= 70) return 'bg-yellow-400/20 text-yellow-400';
    return 'bg-red-400/20 text-red-400';
  }

}
