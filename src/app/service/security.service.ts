import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private apiUrl =environment.apiUrl

    constructor(private http:HttpClient) { }

    getSecurityData(){
      const token = sessionStorage.getItem('accessToken');

      return this.http.get<{
        securityLevel: string;
        metrics: any;
        threatChartData: any;
        recentEvents: any[];
      }>(`${this.apiUrl}/systemSecurity`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
}
