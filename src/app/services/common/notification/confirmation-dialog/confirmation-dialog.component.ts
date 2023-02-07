import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements AfterViewInit {
  @ViewChild('accept', { static: true }) accept: ElementRef;
  public key = 'f9de6625-3e71-4160-a8ec-aaf95767b500';

  constructor(public confirmationService: ConfirmationService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.accept.nativeElement.focus();
    }, 0);
  }
}
