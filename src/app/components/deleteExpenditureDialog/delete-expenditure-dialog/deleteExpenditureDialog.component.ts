import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-expenditure-dialog',
  standalone: true,
  imports: [],
  templateUrl: './deleteExpenditureDialog.component.html',
  styleUrl: './deleteExpenditureDialog.component.css'
})
export class DeleteExpenditureDialogComponent {
  // Hay que hacer uso del servicio de expenditure para manejar el borrado de un gasto acá
}
