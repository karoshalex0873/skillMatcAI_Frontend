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
  setUser(user: any, remember: boolean = false) {
    this.currentUser = user;
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
  }

  // Get user info (for roleGuard or other uses)
  getUser() {
    return this.currentUser;
  }

  //clear local storage
  clearUser() {
    this.currentUser = null;
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }


  constructor(private http: HttpClient) { 
    this.loadUserFromStorage();
  }
  

  private loadUserFromStorage(){
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }


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
    this.clearUser()
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
