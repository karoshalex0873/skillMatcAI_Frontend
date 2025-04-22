import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { environment } from '../../helpers/environment';
import { ProfileService } from '../../service/profile.service';
import { finalize } from 'rxjs';


interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  dob?: string;
  gender?: string;
  role?: string;
  summary?: string;
  experience?: number;
  cv?: string;
}

@Component({
  selector: 'app-skill-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule, FormsModule],
  templateUrl: './skill-profile.component.html',
  styleUrl: './skill-profile.component.css'
})
export class SkillProfileComponent implements OnInit {
  profileForm!: FormGroup;
  completionPercentage: number = 0;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  fileError: string = '';
  selectedFile: File | null = null;
  existingCvUrl: string | null = null;
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadUserProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      avatar: [''],
      phone: [''],
      bio: [''],
      location: [''],
      skills: this.fb.array([]),
      dob: [''],
      gender: [''],
      summary: [''],
      experience: [0, [Validators.min(0)]]
    });
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getUserProfile()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => this.handleProfileResponse(response),
        error: (err) => this.handleProfileError(err)
      });
  }

  private handleProfileResponse(response: any): void {
    this.populateForm(response.data);
    this.completionPercentage = response.completed || 0;
    this.existingCvUrl = response.data.cv || null;
  }

  private handleProfileError(error: Error): void {
    this.errorMessage = error.message;
  }

  private populateForm(userData: UserProfile): void {
    this.profileForm.patchValue({
      name: userData.name || '',
      email: userData.email || '',
      avatar: userData.avatar || '',
      phone: userData.phone || '',
      bio: userData.bio || '',
      location: userData.location || '',
      dob: userData.dob || '',
      gender: userData.gender || '',
      summary: userData.summary || '',
      experience: userData.experience || 0
    });

    if (userData.skills) {
      this.setSkills(userData.skills);
    }
  }

  private setSkills(skills: string[]): void {
    const skillControls = skills.map(skill => this.fb.control(skill));
    this.profileForm.setControl('skills', this.fb.array(skillControls));
  }

  get skillsFormArray(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill(input: HTMLInputElement): void {
    const skill = input.value.trim();
    if (skill && !this.skillsFormArray.value.includes(skill)) {
      this.skillsFormArray.push(this.fb.control(skill));
      input.value = '';
    }
  }

  removeSkill(index: number): void {
    this.skillsFormArray.removeAt(index);
  }

  onFileSelected(event: any): void {
    this.fileError = '';
    const file: File = event.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed';
      this.clearFileInput();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'File size must be less than 5MB';
      this.clearFileInput();
      return;
    }

    this.selectedFile = file;
  }

  clearFileInput(): void {
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  removeCv(): void {
    this.clearFileInput();
    this.existingCvUrl = null;
    this.fileError = '';
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.fileError = '';

    const formData = new FormData();

    // Append regular form fields
    Object.keys(this.profileForm.controls).forEach(key => {
      if (key !== 'skills') {
        const value = this.profileForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });

    // Append skills array
    formData.append('skills', JSON.stringify(this.skillsFormArray.value));

    // Append CV file if selected
    if (this.selectedFile) {
      formData.append('cv', this.selectedFile, this.selectedFile.name);
    }

    // Handle CV removal
    if (this.existingCvUrl && !this.selectedFile) {
      formData.append('removeCV', 'true');
    }

    this.profileService.updateUserProfile(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => this.handleSaveSuccess(response),
        error: (err) => this.handleSaveError(err)
      });
  }

  private handleSaveSuccess(response: any): void {
    this.successMessage = 'Profile updated successfully!';
    this.completionPercentage = response.profileCompletion;
    this.existingCvUrl = response.data.cv || null;
    this.selectedFile = null;
    this.clearFileInput();
    setTimeout(() => this.successMessage = '', 3000);
  }

  private handleSaveError(error: any): void {
    this.errorMessage = error.error?.message || 'An error occurred while updating your profile';
    if (error.error?.fileError) {
      this.fileError = error.error.fileError;
    }
  }

  clearForm(): void {
    this.profileForm.reset();
    this.skillsFormArray.clear();
    this.successMessage = '';
    this.errorMessage = '';
    this.fileError = '';
    this.clearFileInput();
  }
}