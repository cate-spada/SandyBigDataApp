import { DataResponse } from '../interfaces/data-response';
import {HttpClient} from '@angular/common/http';
import {  Observable} from 'rxjs';
import { Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class QueryService {
  constructor(private http: HttpClient) { }

  public getQuery(API_URL: string): Observable<DataResponse[]> {
    return this.http.get<DataResponse[]>(API_URL);
  }

}


