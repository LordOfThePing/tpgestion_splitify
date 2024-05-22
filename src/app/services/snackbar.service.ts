import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snackBar/snackBar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}
  open(message: string, type?: any, duration: number = 3000) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message,
        type,
      },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration,
      panelClass: [type],
    });
  }
}
