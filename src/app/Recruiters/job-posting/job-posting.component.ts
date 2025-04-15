import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { JobService } from '../../service/job.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-job-posting',
  imports: [CommonModule, IconsModule, ReactiveFormsModule],
  templateUrl: './job-posting.component.html',
  styleUrl: './job-posting.component.css'

})
export class JobPostingComponent {

  isLoadingJobs = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  jobs: any = [];
  isModalOpen = false;

  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      salaryRange: ['', [Validators.required, this.validateSalaryRange]],
      type: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      postedDate: [new Date().toISOString().split('T')[0], Validators.required],
      skills: this.fb.array([], Validators.required)
    });
  }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoadingJobs = true;
    this.jobService.getRecruiterJobs().subscribe({
      next: (res) => {
        this.jobs = Array.isArray(res.data) ? res.data : [res.data];
        this.isLoadingJobs = false;
      },
      error: (err) => {
        this.showError(err);
        this.isLoadingJobs = false;
      }
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.jobForm.value,
        postedDate: new Date(this.jobForm.value.postedDate).toISOString()
      };

      this.jobService.createJob(formData).subscribe({
        next: (res) => {
          this.jobs = [res.data, ...this.jobs];
          this.showSuccess('Job posted successfully!');
          this.resetForm();
        },
        error: (err) => this.showError(err),
        complete: () => this.isSubmitting = false
      });
    }
  }

  private showError(err: HttpErrorResponse) {
    this.errorMessage = err.error?.message || 'Operation failed. Please try again.';
    setTimeout(() => this.errorMessage = '', 5000);
    this.isSubmitting = false;
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 5000);
    this.closeModal();
  }

  private resetForm() {
    this.jobForm.reset({
      postedDate: new Date().toISOString().split('T')[0]
    });
    this.skills.clear();
  }

  // Form array methods
  get skills() {
    return this.jobForm.get('skills') as FormArray;
  }

  addSkill(input: HTMLInputElement) {
    const skill = input.value.trim();
    if (skill) {
      this.skills.push(this.fb.control(skill));
      input.value = '';
    }
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  validateSalaryRange(control: any) {
    const pattern = /^\$\d+k\s*-\s*\$\d+k$/;
    return pattern.test(control.value) ? null : { invalidFormat: true };
  }

  // Modal controls
  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }
}
