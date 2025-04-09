import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Job } from '../../helpers/types';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule,IconsModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  // properties for job card
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

  getMatchColor(percentage: number): string {
    if (percentage >= 85) return 'bg-green-400/20 text-green-400';
    if (percentage >= 70) return 'bg-yellow-400/20 text-yellow-400';
    return 'bg-red-400/20 text-red-400';
  }

}
