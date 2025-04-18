import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }
  // fuction to get detail of user eg name 
  getUserInfo(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/auth/verify`, {
        withCredentials: true
      })
  }

  createUser(userData: any) {
    return this.http.post(`${this.apiUrl}/users`, userData,{withCredentials:true});
  }
  
}
