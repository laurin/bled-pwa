import { Component } from '@angular/core';
import { debounce } from '../decorators/debounce.decorator';
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

  @debounce(100)
  async colorChange({ r, g, b }: any) {
    await this.ledController.setColor(r, g, b);
  }

  async pair() {
    await this.ledController.selectDevice();
  }
}
