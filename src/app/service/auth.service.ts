import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl=environment.apiUrl


  constructor(private http:HttpClient) { }

  register(userData:any){
    return this.http.post(`${this.apiUrl}/auth/register`,userData,{
      withCredentials:true
    })
  }
  login(userData:any){
    return this.http.post(`${this.apiUrl}/auth/login`,userData,{
      withCredentials:true
    })
  }
}
