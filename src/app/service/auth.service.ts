import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { Observable, tap } from 'rxjs';

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
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }


  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }


  private loadUserFromStorage() {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }


  // user register
  register(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData,)
  }


  // user login
  login(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, userData,).pipe(
      tap((res: any) => {
        if (res.accessToken) {
          sessionStorage.setItem('access_token', res.accessToken)
          sessionStorage.setItem('refresh_token', res.refreshToken);
        }
        if (res.user) {
          this.setUser(res.user)
        }
      })
    )
  }


  // user logout
  logout() {
    this.clearUser()
    return this.http.post(`${this.apiUrl}/auth/logout`, {})
  }


  // verify user
  verifyAuth() {
    const token = sessionStorage.getItem('accessToken');
    return this.http.get<any>(`${this.apiUrl}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // verifyOtp

  verifyOtp(userId: string, otpCode: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/verifyOtp/${userId}`, 
      { otpCode }
    );
  }

  // resendOtp
  resendOtp(userId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/resendOtp/${userId}`, 
      {}
    );
  }
}
