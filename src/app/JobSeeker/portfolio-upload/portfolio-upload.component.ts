// portfolio-upload.component.ts
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-upload',
  imports: [IconsModule, CommonModule],
  templateUrl: './portfolio-upload.component.html',
  styleUrls: ['./portfolio-upload.component.css']
})
export class PortfolioUploadComponent {
  selectedCard: { type: 'interview' | 'job', data: any } | null = null;

  interviewAlerts = [
    {
      position: 'Frontend Developer',
      company: 'TechNova',
      date: new Date('2025-04-10T10:00:00'),
      location: 'Nairobi HQ',
      meetingLink: 'https://zoom.us/j/1234567890'
    },
    {
      position: 'UI/UX Designer',
      company: 'PixelCraft',
      date: new Date('2025-04-12T14:30:00'),
      location: 'Remote'
    },
  ];

  jobMatches = [
    {
      title: 'Full Stack Developer',
      company: 'CodeBase Inc.',
      description: 'React + Node role with AI exposure.',
      match: 92,
      postedDate: new Date('2024-03-28T09:00:00'),
      deadline: new Date('2024-04-15T23:59:00'),
      applyLink: 'https://example.com/apply'
    },
    {
      title: 'IoT Systems Engineer',
      company: 'SmartNet',
      description: 'IoT development for smart health solutions.',
      match: 88,
      postedDate: new Date('2024-03-30T14:00:00'),
      deadline: new Date('2024-04-20T23:59:00'),
      applyLink: 'https://example.com/iot-apply'
    },
  ];

  get sortedJobMatches() {
    return [...this.jobMatches].sort((a, b) => {
      // Sort by match score descending
      if (b.match !== a.match) return b.match - a.match;
      // Then sort by posted date descending
      return b.postedDate.getTime() - a.postedDate.getTime();
    });
  }

  showCardDetails(type: 'interview' | 'job', data: any) {
    this.selectedCard = { type, data };
  }

  closeCardDetails() {
    this.selectedCard = null;
  }
}