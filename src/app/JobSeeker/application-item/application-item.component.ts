import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { Application } from '../../helpers/types';

@Component({
  selector: 'app-application-item',
  standalone: true,
  imports: [CommonModule, FormsModule, IconsModule, ReactiveFormsModule],
  templateUrl: './application-item.component.html',
  styleUrl: './application-item.component.css'
})
export class ApplicationItemComponent {
  selectedApplicationId: string | null = null;

  allApplications: Application[] = [
    {
      id: '1',
      position: 'Software Engineer',
      company: 'TechCorp',
      status: 'Applied',
      appliedDate: new Date('2025-03-20'),
      matchPercentage: 80,
      jobDescription: 'Remote role focused on backend development with Node.js.',
      requirements: ['3+ years experience', 'Proficient in Node.js', 'Familiarity with REST APIs'],
      salaryRange: '$80,000 - $100,000',
      applicationForm: {
        resume: null,
        coverLetter: '',
        questions: [
          { question: 'Why do you want this job?', answer: '' },
          { question: 'What makes you a good fit?', answer: '' }
        ]
      }
    },
    {
      id: '2',
      position: 'UI/UX Designer',
      company: 'DesignHub',
      status: 'In Review',
      appliedDate: new Date('2025-02-15'),
      matchPercentage: 72,
      jobDescription: 'Collaborate with product teams to design mobile-first user interfaces.',
      requirements: ['Experience with Figma', 'Strong portfolio', 'Good communication skills'],
      salaryRange: '$65,000 - $85,000',
      applicationForm: {
        resume: null,
        coverLetter: '',
        questions: [
          { question: 'Describe your design process.', answer: '' },
          { question: 'Share a project you’re proud of.', answer: '' }
        ]
      }
    },
    {
      id: '3',
      position: 'Machine Learning Engineer',
      company: 'AI Innovations',
      status: 'Offered',
      appliedDate: new Date('2025-01-30'),
      matchPercentage: 90,
      jobDescription: 'Build and deploy scalable ML models for enterprise use.',
      requirements: ['Python', 'TensorFlow or PyTorch', 'Data science fundamentals'],
      salaryRange: '$110,000 - $130,000',
      applicationForm: {
        resume: null,
        coverLetter: '',
        questions: [
          { question: 'Explain a recent ML model you built.', answer: '' },
          { question: 'How do you evaluate model performance?', answer: '' }
        ]
      }
    },
    {
      id: '4',
      position: 'Full Stack Developer',
      company: 'Webify',
      status: 'Rejected',
      appliedDate: new Date('2025-03-10'),
      matchPercentage: 60,
      jobDescription: 'Full stack role using React and Express.js for a SaaS platform.',
      requirements: ['React', 'Node.js', 'MongoDB', 'REST/GraphQL'],
      salaryRange: '$75,000 - $95,000',
      applicationForm: {
        resume: null,
        coverLetter: '',
        questions: [
          { question: 'How do you manage state in React apps?', answer: '' },
          { question: 'Describe your experience with backend APIs.', answer: '' }
        ]
      }
    }
  ];

  // Only show applications that are not "Applied"
  get applications(): Application[] {
    return this.allApplications.filter(app => app.status !== 'Applied');
  }
  
  // Show the 3 most recent applications
  get latestApplications() {
    return this.applications
      .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
      .slice(0, 3);
  }

  toggleDetails(id: string) {
    this.selectedApplicationId = this.selectedApplicationId === id ? null : id;
  }
  

  statusColors = {
    'Applied': 'bg-blue-400/20 text-blue-400 ',
    'In Review': 'bg-yellow-400/20 text-yellow-400',
    'Offered': 'bg-green-400/20 text-green-400',
    'Rejected': 'bg-red-400/20 text-red-400 '
  };
}
