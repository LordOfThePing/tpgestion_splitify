import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ResponseModel } from '../../classes/responseModel';
import { environment } from '../../environments/environment';
import { CategoryShare } from '../../classes/categoryShare';


@Injectable({
  providedIn: 'root'
})
export class CategoryShareService {

    constructor(private http: HttpClient) { }

    getGroupCategoryShares(groupId: number): Observable<Array<CategoryShare>|null> {
    return this.http.get<ResponseModel<Array<CategoryShare>>>(`${environment.apiUrl}/categoryShares?id_group=${groupId}`)
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

    addGroupCategoryShare(groupId: number, categoryShares: Array<CategoryShare>): any {
        return 1;
    }
}