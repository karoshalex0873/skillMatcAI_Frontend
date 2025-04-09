import { Component } from '@angular/core';
import { Applicant, Application } from '../../helpers/types';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-cadidate-match',
  imports: [CommonModule,IconsModule],
  templateUrl: './cadidate-match.component.html',
  styleUrl: './cadidate-match.component.css'
})
export class CadidateMatchComponent {
  applicants: Applicant[] = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      matchPercentage: 85,
      experience: 5,
      skills: ['JavaScript', 'Angular'],
      resume: 'my coverletter',
      coverLetter: 'alex coverlatter'
    }
  ];

  selectedApplicant: any = null;

  openHireModal(applicant: any) {
    this.selectedApplicant = applicant;
  }

  closeHireModal() {
    this.selectedApplicant = null;
  }

  confirmHire() {
    // handle hiring logic here
    console.log('Hired:', this.selectedApplicant);
    this.closeHireModal();
  }
}
