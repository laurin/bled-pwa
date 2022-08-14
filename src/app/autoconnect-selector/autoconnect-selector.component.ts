import { Component, OnInit } from '@angular/core';
import { LedControllerService } from '../../services/led-controller.service';

@Component({
  selector: 'app-autoconnect-selector',
  templateUrl: './autoconnect-selector.component.html',
  styleUrls: ['./autoconnect-selector.component.scss']
})
export class AutoconnectSelectorComponent implements OnInit {

  devices: BluetoothDevice[] = [];
  selectedDevice: string = "undefined";

  constructor(
    private ledController: LedControllerService,
  ) { }

  async ngOnInit() {
    this.devices = await this.ledController.getPreviousDevices();
    this.selectedDevice = this.ledController.getAutoconnect() || "undefined";
  }

  onChange(event: any) {
    this.selectedDevice = event.target.value;
    this.ledController.setAutoconnect(event.target.value);
    this.ledController.autoconnect();
  }
}
