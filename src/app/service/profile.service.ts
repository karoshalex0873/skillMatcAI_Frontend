import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/info`, {
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error loading profile:', error);
        return throwError(() => new Error('Failed to load user profile'));
      })
    )

  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/user/update`, profileData, {
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error updating profile:', error);
        return throwError(() => new Error(error.error.message || 'Failed to update profile'));
      })
    );
  }
}
