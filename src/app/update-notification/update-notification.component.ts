import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-update-notification',
  templateUrl: './update-notification.component.html',
  styleUrls: ['./update-notification.component.scss']
})
export class UpdateNotificationComponent {

  updateAvailable = false;

  constructor(
    private readonly updates: SwUpdate,
  ) {

    this.updates.available.subscribe(event => {
      this.updateAvailable = true;
    });
  }

  activate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

}
