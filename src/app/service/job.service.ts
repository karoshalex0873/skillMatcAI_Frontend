import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApplicationDetails, ApplicationStatus, Interview, InterviewApplication, Job } from '../helpers/types';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  createJob(jobData: any) {
    return this.http.post<{ data: Job }>(`${this.apiUrl}/jobs/create`, jobData, {
      withCredentials: true
    });
  }

  getRecruiterJobs() {
    return this.http.get<{ data: Job }>(`${this.apiUrl}/jobs/JobPost`, {
      withCredentials: true
    });
  }


  //get jobs function from the api
  getJob(): Observable<Job[]> {
    return this.http
      .get<{ success: boolean; data: Job[] }>(`${this.apiUrl}/jobs/getAll`, {
        withCredentials: true // ⬅️ sends cookies like access_token
      }).pipe(map(response => response.data));

  }

  getAllApplications(): Observable<{ applications: ApplicationDetails[] }> {
    return this.http.get<{ applications: ApplicationDetails[] }>(
      `${this.apiUrl}/jobs/allApplications`,
      { withCredentials: true }
    );
  }

  // For job-specific applications
  getApplicationsByJob(jobId: number): Observable<{ applications: ApplicationDetails[] }> {
    return this.http.get<{ applications: ApplicationDetails[] }>(
      `${this.apiUrl}/jobs/${jobId}/applicant`,
      { withCredentials: true }
    );
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<{ applications: ApplicationDetails[] }> {
    return this.http.patch<{ applications: ApplicationDetails[] }>(
      `${this.apiUrl}/jobs/${applicationId}/status`,
      { status },
      { withCredentials: true }
    );
  }

  deleteApplication(applicationId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/jobs/applications/${applicationId}`,
      { withCredentials: true }
    );
  }


  sendQuery(query: string) {
    return this.http.post<{ data: any }>(
      `${environment.apiUrl}/jobs/ask`,
      { question: query },
      { withCredentials: true }
    );
  }


  scheduleInterview(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/createInterview`, data, {
      withCredentials: true
    });
  }

  getUpcomingInterviews(): Observable<Interview[]> {
    return this.http.get<{ interviews: Interview[] }>(
      `${this.apiUrl}/jobs/upcomingInterview`,
      { withCredentials: true }
    ).pipe(map(response => response.interviews));
  }

  updateInterview(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/jobs/updateInterview`, data,
      { withCredentials: true }
    );
  }

  cancelInterview(interviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/cancel/${interviewId}`, {
      withCredentials: true
    });
  }

  getApplications(): Observable<InterviewApplication[]> {
    return this.http.get<{ applications: InterviewApplication[] }>(
      `${this.apiUrl}/jobs/interview/allApplications`,
      { withCredentials: true }
    ).pipe(map(response => response.applications));
  }
}
