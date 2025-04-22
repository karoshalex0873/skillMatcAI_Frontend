import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ApplicationDetails, ApplicationStatus, Interview, InterviewApplication, Job } from '../helpers/types';

interface ApiResponse {
  type: string;
  content: string;
  data?: any[];
  dataQuery?: any;
  suggestions?: string[];
  context?: any;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.apiUrl


  constructor(private http: HttpClient) { }

  createJob(jobData: any) {
    const token = sessionStorage.getItem('accessToken');

    return this.http.post<{ data: Job }>(`${this.apiUrl}/jobs/create`, jobData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getRecruiterJobs() {
    const token = sessionStorage.getItem('accessToken');

    return this.http.get<{ data: Job }>(`${this.apiUrl}/jobs/JobPost`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  //get jobs function from the api
  getJob(): Observable<Job[]> {
    const token = sessionStorage.getItem('accessToken');

    return this.http
      .get<{ success: boolean; data: Job[] }>(`${this.apiUrl}/jobs/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).pipe(map(response => response.data));

  }

  getAllApplications(): Observable<{ applications: ApplicationDetails[] }> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.get<{ applications: ApplicationDetails[] }>(
      `${this.apiUrl}/jobs/allApplications`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // For job-specific applications
  getApplicationsByJob(jobId: number): Observable<{ applications: ApplicationDetails[] }> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.get<{ applications: ApplicationDetails[] }>(
      `${this.apiUrl}/jobs/${jobId}/applicant`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<{ applications: ApplicationDetails[] }> {

    const token = sessionStorage.getItem('accessToken');

    return this.http.patch<{ applications: ApplicationDetails[] }>(
      `${this.apiUrl}/jobs/${applicationId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  deleteApplication(applicationId: number): Observable<void> {

    const token = sessionStorage.getItem('accessToken');

    return this.http.delete<void>(
      `${this.apiUrl}/jobs/applications/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }



// Add proper typing to the service method
sendQuery(query: string): Observable<ApiResponse> {
  const token = sessionStorage.getItem('accessToken');
  return this.http.post<ApiResponse>(`${environment.apiUrl}/jobs/ask`, { question: query }, {
    headers: { Authorization: `Bearer ${token}` }
  }).pipe(
    catchError(error => {
      console.error('Error:', error);
      return of({
        type: 'error',
        content: 'Failed to fetch data. Please try again.'
      });
    })
  );
}


  scheduleInterview(data: any): Observable<any> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.post(`${this.apiUrl}/jobs/createInterview`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUpcomingInterviews(): Observable<Interview[]> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.get<{ interviews: Interview[] }>(
      `${this.apiUrl}/jobs/upcomingInterview`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(map(response => response.interviews));
  }

  updateInterview(data: any): Observable<any> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.patch(`${this.apiUrl}/jobs/updateInterview`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  cancelInterview(interviewId: number): Observable<any> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.delete(`${this.apiUrl}/jobs/cancel/${interviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getApplications(): Observable<InterviewApplication[]> {
    const token = sessionStorage.getItem('accessToken');

    return this.http.get<{ applications: InterviewApplication[] }>(
      `${this.apiUrl}/jobs/interview/allApplications`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(map(response => response.applications));
  }
}
