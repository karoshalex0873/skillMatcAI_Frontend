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
    const token = sessionStorage.getItem('accessToken');
    return this.http
      .get<any>(`${this.apiUrl}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  }


  updateUser(userId: string, userData: any) {
    const token = sessionStorage.getItem('accessToken');
    return this.http.patch(`${this.apiUrl}/update/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createUser(userData: any) {
    const token = sessionStorage.getItem('accessToken');

    return this.http.post(`${this.apiUrl}/create`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }



  // delete user 
  deleteUser(userId: string): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    return this.http.delete(`${this.apiUrl}/auth/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
