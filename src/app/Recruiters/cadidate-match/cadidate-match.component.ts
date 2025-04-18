import { Component, Input } from '@angular/core';
import { ApplicationDetails, ApplicationStatus } from '../../helpers/types';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../helpers/icons.module';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../service/job.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadidate-match',
  imports: [CommonModule,IconsModule,FormsModule],
  templateUrl: './cadidate-match.component.html',
  styleUrl: './cadidate-match.component.css'
})
export class CadidateMatchComponent {
  @Input() jobId?: number;
  applications: ApplicationDetails[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  
  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    const loader = this.jobId 
      ? this.jobService.getApplicationsByJob(this.jobId)
      : this.jobService.getAllApplications();

    loader.subscribe({
      next: (response) => {
        this.applications = response.applications; // ✅ Correct property
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => this.handleError(err)
    });
  }

  updateStatus(applicationId: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as ApplicationStatus;
    
    const application = this.applications.find(app => app.applicationId === applicationId);

    
    if (!application) return;

    // Removed incorrect assignment to applicationId
    this.jobService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: () => {
        application.status = newStatus;
        this.showSuccess(`Status updated to ${newStatus}`);
        application.isUpdating = false;
      },
      error: (err) => {
        this.handleError(err);
        application.isUpdating = false;
      }
    });
  }

  deleteApplication(applicationId: number): void {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    this.jobService.deleteApplication(applicationId).subscribe({
      next: () => {
        this.applications = this.applications.filter(app => app.applicationId !== applicationId);
        this.showSuccess('Application deleted successfully');
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(err: HttpErrorResponse): void {
    this.errorMessage = err.error?.message || 'An error occurred';
    setTimeout(() => this.errorMessage = '', 5000);
    this.isLoading = false;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  statusClasses(status: ApplicationStatus): string {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'reviewed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }
}
