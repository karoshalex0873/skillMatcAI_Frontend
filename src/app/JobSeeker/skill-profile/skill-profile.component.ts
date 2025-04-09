import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-profile',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule, FormsModule],
  templateUrl: './skill-profile.component.html',
  styleUrl: './skill-profile.component.css'
})
export class SkillProfileComponent {

  profileForm!: FormGroup;

  get skillsFormArray() {
    return this.profileForm.get('skills') as FormArray;
  }

  constructor(private fb:FormBuilder){
    this.profileForm=this.fb.group({
      name:['',Validators.required],
      email:[''],
      role:[''],
      location:[''],
      summary:[''],
      skills: this.fb.array([]),
      experience: [0, [Validators.required, Validators.min(0)]]
    })
  }

  addSkill(input: HTMLInputElement) {
    const skill = input.value.trim();
    if (skill) {
      this.skillsFormArray.push(this.fb.control(skill));
      input.value = '';
    }
  }
  removeSkill(index: number) {
    this.skillsFormArray.removeAt(index);
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      console.log('Profile saved:', formValue);
      // ... success message logic
    }
  }

  profile = {
    name: '',
    email: '',
    role: '',
    location: '',
    summary: '',
    skills: [] as string[],
    experience: 0,
  };

  skillsInput = '';
  successMessage = '';

  get completionPercentage(): number {
    const totalFields = 6; // Update this number if you add/remove fields
    let filledFields = 0;

    if (this.profile.name.trim()) filledFields++;
    if (this.profile.email.trim()) filledFields++;
    if (this.profile.role.trim()) filledFields++;
    if (this.profile.location.trim()) filledFields++;
    if (this.profile.summary.trim()) filledFields++;
    if (this.profile.skills.length > 0) filledFields++;
    if (this.profile.experience > 0) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }

  updateSkills() {
    if (this.skillsInput.trim()) {
      const newSkills = this.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !this.profile.skills.includes(s));
      this.profile.skills.push(...newSkills);
      this.skillsInput = '';
    }
  }

  clearForm() {
    this.profileForm.reset();
    this.skillsInput = '';
    this.successMessage = '';
  }
}