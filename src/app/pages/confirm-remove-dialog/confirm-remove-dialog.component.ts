import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-confirm-remove-dialog',
  imports: [],
  templateUrl: './confirm-remove-dialog.component.html',
  styleUrl: './confirm-remove-dialog.component.scss',
})
export class ConfirmRemoveDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmRemoveDialogComponent>) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
