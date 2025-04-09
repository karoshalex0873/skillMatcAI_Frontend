import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-schedule-conduct-interviews',
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './schedule-conduct-interviews.component.html',
  styleUrls: ['./schedule-conduct-interviews.component.css']
})
export class ScheduleConductInterviewsComponent {
  interviews = [
    {
      id: 1,
      candidate: 'John Doe',
      position: 'Senior Developer',
      date: '2024-03-20',
      time: '14:30',
      type: 'Technical',
      status: 'scheduled'
    },
    {
      id: 2,
      candidate: 'Jane Smith',
      position: 'UX Designer',
      date: '2024-03-21',
      time: '10:00',
      type: 'Cultural Fit',
      status: 'completed'
    }
  ];

  selectedInterview: any = null;

  // Add methods for CRUD operations
  scheduleInterview() {
    // Add scheduling logic
  }

  editInterview(interview: any) {
    this.selectedInterview = interview;
  }

  cancelInterview(interviewId: number) {
    // Add cancellation logic
  }
}