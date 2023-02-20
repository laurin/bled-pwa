import { AfterViewInit, Component } from '@angular/core';
import { LedControllerService } from 'src/services/led-controller.service';

@Component({
  selector: 'app-bled-controls',
  templateUrl: './bled-controls.component.html',
  styleUrls: ['./bled-controls.component.scss']
})
export class BledControlsComponent implements AfterViewInit {
  constructor(
    public ledController: LedControllerService,
  ) { }

  ngAfterViewInit(): void {
    this.ledController.autoconnect();
  }
}
