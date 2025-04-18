import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { JobService } from '../../service/job.service';
import { Interview, InterviewApplication } from '../../helpers/types';




@Component({
  selector: 'app-schedule-conduct-interviews',
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './schedule-conduct-interviews.component.html',
  styleUrls: ['./schedule-conduct-interviews.component.css']
})
export class ScheduleConductInterviewsComponent {
  interviews: Interview[] = [];
  applications: InterviewApplication[] = [];
  selectedApplicationId: number | null = null;
  selectedMode = 'technical';
  selectedDate?: string;
  selectedTime?: string;
  notes = '';

  editingInterview: Interview | null = null;
  editingDate?: string;
  editingTime?: string;

  // Loading states
  isLoadingApplications = false;
  isLoadingInterviews = false;
  isSubmitting = false;
  isUpdating = false;

  // Error messages
  errorMessage = '';
  formError = '';

  constructor(
    private interviewService: JobService,
    private applicationService: JobService
  ) { }

  ngOnInit() {
    this.loadApplications();
    this.loadUpcomingInterviews();
  }

  loadApplications() {
    this.isLoadingApplications = true;
    this.applicationService.getApplications().subscribe({
      next: (apps: InterviewApplication[]) => {
        this.applications = apps;
        this.isLoadingApplications = false;
      },
      error: (err) => {
        console.error('Failed to load applications:', err);
        this.errorMessage = err.error?.message || 'Failed to load applications';
        this.isLoadingApplications = false;
      }
    });
  }
  
  // Updated loadUpcomingInterviews method
  loadUpcomingInterviews() {
    this.isLoadingInterviews = true;
    this.interviewService.getUpcomingInterviews().subscribe({
      next: (interviews: Interview[]) => {
        this.interviews = interviews.map(i => ({
          ...i,
          date: this.formatDate(i.scheduledAt),
          time: this.formatTime(i.scheduledAt)
        }));
        this.isLoadingInterviews = false;
      },
      error: (err) => {
        console.error('Failed to load interviews:', err);
        this.errorMessage = err.error?.message || 'Failed to load interviews';
        this.isLoadingInterviews = false;
      }
    });
  }

  scheduleInterview() {
    if (!this.selectedApplicationId || !this.selectedDate || !this.selectedTime) {
      this.formError = 'Please fill all required fields';
      return;
    }

    this.formError = '';
    this.isSubmitting = true;

    const scheduledAt = new Date(
      Date.UTC(
        new Date(this.selectedDate).getFullYear(),
        new Date(this.selectedDate).getMonth(),
        new Date(this.selectedDate).getDate(),
        parseInt(this.selectedTime.split(':')[0]),
        parseInt(this.selectedTime.split(':')[1])
      )
    );

    const interviewData = {
      applicationId: this.selectedApplicationId,
      mode: this.selectedMode,
      scheduledAt: scheduledAt.toISOString(),
      notes: this.notes
    };

    this.interviewService.scheduleInterview(interviewData).subscribe({
      next: () => {
        this.loadUpcomingInterviews();
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Failed to schedule interview:', err);
        this.formError = err.error?.message || 'Failed to schedule interview';
        this.isSubmitting = false;
      }
    });
  }

  editInterview(interview: Interview) {
    this.editingInterview = { ...interview };
    const date = new Date(interview.scheduledAt);
    this.editingDate = date.toISOString().split('T')[0];
    this.editingTime = date.toTimeString().split(' ')[0].substring(0, 5);
  }

  updateInterview() {
    if (!this.editingDate || !this.editingTime || !this.editingInterview) {
      this.formError = 'Please fill all required fields';
      return;
    }

    this.formError = '';
    this.isUpdating = true;

    const updatedData = {
      interviewId: this.editingInterview.interview_id,
      mode: this.editingInterview.mode,
      scheduledAt: new Date(
        Date.UTC(
          new Date(this.editingDate).getFullYear(),
          new Date(this.editingDate).getMonth(),
          new Date(this.editingDate).getDate(),
          parseInt(this.editingTime.split(':')[0]),
          parseInt(this.editingTime.split(':')[1])
        )
      ).toISOString(),
      notes: this.editingInterview.notes
    };

    this.interviewService.updateInterview(updatedData).subscribe({
      next: () => {
        this.loadUpcomingInterviews();
        this.cancelEdit();
        this.isUpdating = false;
      },
      error: (err) => {
        console.error('Failed to update interview:', err);
        this.formError = err.error?.message || 'Failed to update interview';
        this.isUpdating = false;
      }
    });
  }

  cancelInterview(interviewId: number) {
    if (confirm('Are you sure you want to cancel this interview?')) {
      this.interviewService.cancelInterview(interviewId).subscribe({
        next: () => this.loadUpcomingInterviews(),
        error: (err) => {
          console.error('Failed to cancel interview:', err);
          this.errorMessage = err.error?.message || 'Failed to cancel interview';
        }
      });
    }
  }

  private resetForm() {
    this.selectedApplicationId = null;
    this.selectedMode = 'technical';
    this.selectedDate = undefined;
    this.selectedTime = undefined;
    this.notes = '';
  }

  public cancelEdit() {
    this.editingInterview = null;
    this.editingDate = undefined;
    this.editingTime = undefined;
  }

  private formatDate(datetime: string): string {
    return new Date(datetime).toLocaleDateString();
  }

  private formatTime(datetime: string): string {
    return new Date(datetime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  }
}