import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../../classes/responseModel';
import { GroupMember } from '../../classes/groupMember';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {

constructor(private http: HttpClient) { }

getGroupMembers(): Observable<Array<GroupMember>|null> {
  return this.http.get<ResponseModel<Array<GroupMember>>>(`${environment.apiUrl}/groupMembers`)
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
        return throwError(() => new Error('Failed to fetch groupMembers: ' + error.message));
      })
    );
}

getUserIdGroupMembers(userId: number): Observable<Array<GroupMember>|null> {
  return this.http.get<ResponseModel<Array<GroupMember>>>(`${environment.apiUrl}/groupMembers?id_user=` + String(userId))
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
        return throwError(() => new Error('Failed to fetch user_id groupMembers: ' + error.message));
      })
    );
}

postGroupMember(groupMember: GroupMember): Observable<GroupMember|null> {
  return this.http.post<ResponseModel<GroupMember>>(`${environment.apiUrl}/groupMember`, groupMember)
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
        return throwError(() => new Error('Failed to post groupMember: ' + error.message));
      })
    );
}


}
