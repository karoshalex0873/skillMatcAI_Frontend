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
    const token = sessionStorage.getItem('accessToken');

    return this.http.get(`${this.apiUrl}/user/analytics/recruiter`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getUsersManagementData(params?: any) {
    const token = sessionStorage.getItem('accessToken');

    return this.http.get(`${this.apiUrl}/user/manageUser`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
