import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl

  private currentUser: any = null;



  // Set user info after login
  setUser(user: any) {
    this.currentUser = user;
  }

  // Get user info (for roleGuard or other uses)
  getUser() {
    return this.currentUser;
  }


  constructor(private http: HttpClient) { }
  // user register
  register(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, {
      withCredentials: true
    })
  }
  // user login
  login(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, userData, {
      withCredentials: true
    })
  }
  // user logout
  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    })
  }
  // verify user
  verifyAuth() {
    return this.http.get<any>(`${this.apiUrl}/auth/verify`, {
      withCredentials: true
    });
  }
}
