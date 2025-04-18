import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getRecruiterAnalytics() {
    return this.http.get(`${this.apiUrl}/user/analytics/recruiter`, {
      withCredentials: true
    })
  }

  getUsersManagementData(params?: any) {
    return this.http.get(`${this.apiUrl}/user/manageUser`, { params, withCredentials: true });
  }
}
