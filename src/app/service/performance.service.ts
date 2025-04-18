import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ){ }

  getPerformance(){
    return this.http.get(`${this.apiUrl}/system-performance`,{
      withCredentials:true
    })
  }
}
