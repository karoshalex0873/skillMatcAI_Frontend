import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { Application, ApplicationResponse } from '../../helpers/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../helpers/environment';
import { RouterModule } from '@angular/router';


type ApplicationStatus = 'pending' | 'applied' | 'offered' | 'rejected';


@Component({
  selector: 'app-application-item',
  standalone: true,
  imports: [CommonModule, FormsModule, IconsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './application-item.component.html',
  styleUrl: './application-item.component.css'
})
export class ApplicationItemComponent {

  selectedApplicationId: number | null = null;
  allApplications: ApplicationResponse[] = [];
  isLoading = true;

  // httpclient
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchApplications();
  }
  fetchApplications() {
    this.isLoading = true
    this.http.get<any>(`${environment.apiUrl}/jobs/getApplications`, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.allApplications = res.applications;
          this.isLoading = false
        }, 1500)
      },
      error: (err) => {
        console.error('Failed to fetch applications', err);
        this.isLoading = false
      }
    })
  }

  get applications(): ApplicationResponse[] {
    return this.allApplications.filter(app => app.status.toLowerCase() !== 'applied');
  }
  get latestApplications() {
    return this.applications
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 3);
  }
  toggleDetails(id: number) {
    this.selectedApplicationId = this.selectedApplicationId === id ? null : id;
  }

  getStatusColor(status: string): string {
    return this.statusColors[status as keyof typeof this.statusColors] || 'bg-gray-400/20 text-gray-400';
  }


  statusColors: Record<ApplicationStatus, string> = {
    pending: 'bg-yellow-400/20 text-yellow-400',
    applied: 'bg-blue-400/20 text-blue-400',
    offered: 'bg-green-400/20 text-green-400',
    rejected: 'bg-red-400/20 text-red-400'
  };


}

