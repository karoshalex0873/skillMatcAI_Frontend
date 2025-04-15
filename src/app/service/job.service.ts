import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Job } from '../helpers/types';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }
 
  // service to creta a job 
  createJob(jobData: any) {
    return this.http.post(`${this.apiUrl}/jobs/JobPost`, jobData);
  }

  // sercive to get recruieter job
  getRecruiterJobs() {
    return this.http.get(`${this.apiUrl}/recruiter`);
  }


  //get jobs function from the api
  getJob(): Observable<Job[]> {
    return this.http
      .get<{ success: boolean; data: Job[] }>(`${this.apiUrl}/jobs/getAll`, {
        withCredentials: true // ⬅️ sends cookies like access_token
      }).pipe(map(response => response.data));

  }
}
