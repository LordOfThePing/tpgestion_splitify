import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../classes/user';
import { ResponseModel } from '../../classes/responseModel';
import { Expenditure } from '../../classes/expenditure';

@Injectable({
  providedIn: 'root'
})
export class ExpenditureService {

constructor(private http: HttpClient) { }

getGroupExpenditures(group_id: number): Observable<Array<Expenditure>|null> {
  return this.http.get<ResponseModel<Array<Expenditure>>>(`${environment.apiUrl}/expenditures/` + group_id)
    .pipe(
      map(response => {
        console.log(response)
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return [];
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch expenditures: ' + error.message));
      })
    );
}

getExpenditure(expenditureName: string): Observable<Array<Expenditure>|null> {
  return this.http.get<ResponseModel<Array<Expenditure>>>(`${environment.apiUrl}/expenditures?expenditureName=` + expenditureName)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null;
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch expenditure: ' + error.message));
      })
    );
}

getExpenditureById(expenditureId: number): Observable<Expenditure|null> {
  return this.http.get<ResponseModel<Expenditure>>(`${environment.apiUrl}/expenditures/` + String(expenditureId))
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null;
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch expenditure: ' + error.message));
      })
    );
}

postExpenditure(expenditure: Expenditure): Observable<Expenditure|null> {
  return this.http.post<ResponseModel<Expenditure>>(`${environment.apiUrl}/expenditures`, expenditure)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null;
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to post expenditure: ' + error.message));
      })
    );
}

putExpenditure(expenditure: Expenditure): Observable<Expenditure|null> {
  return this.http.put<ResponseModel<Expenditure>>(`${environment.apiUrl}/expenditures/` + expenditure.id_expenditure, expenditure)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null;
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to put expenditure: ' + error.message));
      })
    );
}

}
