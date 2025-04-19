// portfolio-upload.component.ts
import { Component, OnInit } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { environment } from '../../helpers/environment';

@Component({
  selector: 'app-portfolio-upload',
  imports: [IconsModule, CommonModule],
  templateUrl: './portfolio-upload.component.html',
  styleUrl: './portfolio-upload.component.css'
})
export class PortfolioUploadComponent implements OnInit {

  selectedCard: { type: 'interview', data: any } | null = null;
  interviewAlerts: any[] = [];

  constructor(private http: HttpClient) {}



  ngOnInit(): void {
    this.fetchInterviews()
    timer(0,3000).subscribe(()=>this.fetchInterviews())
  }

  private fetchInterviews(){
    const token = sessionStorage.getItem('accessToken');
    this.http.get<any>(`${environment.apiUrl}/jobs/interview/myInterviews`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next:(response)=>{
        this.interviewAlerts=response.interviews.map((interview:any)=>({
          interview_id: interview.interview_id,
          position: interview.job.title,
          date: new Date(interview.scheduledAt),
          mode: interview.mode,
          notes: interview.notes,
          status: interview.status,
          meetingLink: interview.meetingLink || null
        }))
      }
    })

  }


  showCardDetails(type: 'interview', data: any) {
    this.selectedCard = { type, data };
  }

  closeCardDetails() {
    this.selectedCard = null;
  }
}