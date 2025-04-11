import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Job } from '../../helpers/types';
import { JobService } from '../../service/job.service';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule,IconsModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  // properties for job card
  jobs: Job[] = []
  
  constructor(private jobService:JobService){}

  ngOnInit():void{
    this.jobService.getJob().subscribe({
      next:(data)=>(this.jobs=data),
      error:(err)=>console.error('failed to fetch jobs:',err)
    })
  }

  getMatchColor(percentage: number): string {
    if (percentage >= 85) return 'bg-green-400/20 text-green-400';
    if (percentage >= 70) return 'bg-yellow-400/20 text-yellow-400';
    return 'bg-red-400/20 text-red-400';
  }

}
