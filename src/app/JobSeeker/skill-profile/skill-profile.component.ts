import { Component, OnInit } from '@angular/core';
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
      role: [''],
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
    this.completionPercentage = response.completed || 0
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
      role: userData.role || '',
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

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = {
      ...this.profileForm.value,
      skills: this.skillsFormArray.value
    };

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
    setTimeout(() => this.successMessage = '', 3000);
  }

  private handleSaveError(error: Error): void {
    this.errorMessage = error.message;
  }

  clearForm(): void {
    this.profileForm.reset();
    this.skillsFormArray.clear();
    this.successMessage = '';
    this.errorMessage = '';
  }

}