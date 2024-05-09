import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../classes/user';
import { ResponseModel } from '../../classes/responseModel';
import { Group } from '../../classes/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

constructor(private http: HttpClient) { }

getGroups(): Observable<Array<Group>|null> {
  return this.http.get<ResponseModel<Array<Group>>>(`${environment.apiUrl}/groups`)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch groups: ' + error.message));
      })
    );
}
getGroup(groupname: string): Observable<Array<Group>|null> {
  return this.http.get<ResponseModel<Array<Group>>>(`${environment.apiUrl}/groups?groupname=` + groupname )
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch group: ' + error.message));
      })
    );
}

getUsernameGroups(username: string): Observable<Group|null> {
  return this.http.get<ResponseModel<Group>>(`${environment.apiUrl}/user_groups/` + username)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch username groups: ' + error.message));
      })
    );
}

postGroup(group: Group): Observable<Group|null> {
  return this.http.post<ResponseModel<Group>>(`${environment.apiUrl}/groups`, group)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to post group: ' + error.message));
      })
    );
}


}
