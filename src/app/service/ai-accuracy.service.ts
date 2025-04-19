import { Injectable } from '@angular/core';
import { environment } from '../helpers/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccuracyMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[];
  version: string;
  lastUpdated: string;
}

export interface TrainingParams {
  learningRate: number;
  batchSize: number;
}

export interface AccuracyResponse {
  metrics: AccuracyMetrics;
  trends: {
    labels: string[];
    values: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AiAccuracyService {
  private apiUrl = environment.apiUrl


  constructor(private http: HttpClient) { }

  getMetrics():Observable<AccuracyResponse>{
    const token = sessionStorage.getItem('accessToken');

    return this.http.get<AccuracyResponse>(`${this.apiUrl}/systemAIAcurracy`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  
}
