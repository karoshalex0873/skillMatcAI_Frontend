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

  createJob(jobData: any) {
    return this.http.post<{data:Job}>(`${this.apiUrl}/jobs/create`, jobData, {
      withCredentials: true
    });
  }

  getRecruiterJobs() {
    return this.http.get<{data:Job}>(`${this.apiUrl}/jobs/JobPost`, {
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
}
