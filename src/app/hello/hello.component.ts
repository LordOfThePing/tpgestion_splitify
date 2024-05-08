import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
})
export class HelloComponent implements OnInit {
  //responseContent es un parámetro que se puede utilizar en la template asociada al componente
  responseContent: string;

  constructor(private backendService: BackendService) { 
    this.responseContent = '';
  }

   /**
   * Initializes the component and retrieves the hello message from the backend service.
   *
   * @return {void} This function does not return anything.
   */
  ngOnInit(): void {
    this.backendService.getHelloMessage().subscribe(
      (data: any) => {
        this.responseContent = data.message;
      },
      (error) => {
        console.error('Error al obtener datos del servidor:', error);
      }
    );
  }
}
