import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { Job } from '../../helpers/types';




@Component({
  selector: 'app-job-posting',
  imports: [CommonModule,IconsModule,ReactiveFormsModule],
  templateUrl: './job-posting.component.html',
  styleUrl: './job-posting.component.css'

})
export class JobPostingComponent {

  jobs: Job[] = [
      {
        id: '1',
        title: 'Senior UX Designer',
        company: 'Tech Innovators Inc',
        location: 'Remote',
        matchPercentage: 72,
        skills: ['Figma', 'User Research', 'Prototyping'],
        experienceLevel: 'Senior',
        postedDate: new Date('2024-03-15'),
        salaryRange: '$100k - $130k',
        type: 'Full-time'
      },
    ];
  jobForm!: FormGroup;

  // function to open modal
  isModalOpen = false;
  openModal(){
    this.isModalOpen=true
  }
  closeModal() {
    this.isModalOpen = false;
  }

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      loaction: ['', Validators.required],
      salaryRange: ['', [Validators.required, this.validateSalaryRange]],
      type: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      postedDate: [new Date().toISOString().split('T')[0], Validators.required],
      skills: this.fb.array([], Validators.required)
    })
  }

  // geting the skills
  get skills() {
    return this.jobForm.get('skills') as FormArray;
  }

  // adingig skills
  addSkill(input: HTMLInputElement) {
    const skill = input.value.trim();
    if (skill) {
      this.skills.push(this.fb.control(skill));
      input.value = '';
    }
  }

  // removing the skills
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }
  validateSalaryRange(control: any) {
    const pattern = /^\$\d+k\s*-\s*\$\d+k$/;
    return pattern.test(control.value) ? null : { invalidFormat: true };
  }
  // onsubmit 
  onSubmit() {
    if (this.jobForm.valid) {
      console.log('Job Posted:', this.jobForm.value);
      // Add your submission logic here to the db
    }
  }
}
