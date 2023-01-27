import { Component } from '@angular/core';
import { LedControllerService } from '../services/led-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public ledController: LedControllerService,
  ) { }

  async pair() {
    await this.ledController.selectDevice();
  }
}
