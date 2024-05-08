import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8000'; // URL de tu backend FastAPI

  constructor(private http: HttpClient) { }

  // Ejemplo de función para obtener datos del backend
  getHelloMessage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hello`);
  }

  // Otros métodos para interactuar con el backend
  


}
