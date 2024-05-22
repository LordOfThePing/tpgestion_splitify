import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackBar',
  templateUrl: './snackBar.component.html',
  styleUrls: ['./snackBar.component.css'],
  standalone: true,
  imports: [
    MatIconModule
  ],
})
export class SnackBarComponent implements OnInit {
  icon: string = '';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit(): void {
    let type = this.data.type;
    if (type === 'success') this.icon = 'check';
    else if (type === 'info') this.icon = 'warning';
    else if (type === 'error') this.icon = 'error_outline';
  }
}
