import { Component, OnInit } from '@angular/core';
import { LedControllerService } from '../../services/led-controller.service';

@Component({
  selector: 'app-previous-devices',
  templateUrl: './previous-devices.component.html',
  styleUrls: ['./previous-devices.component.scss']
})
export class PreviousDevicesComponent implements OnInit {

  devices: BluetoothDevice[] = [];

  constructor(
    private ledController: LedControllerService,
  ) { }

  ngOnInit() {
    this.loadDevices();
  }

  async loadDevices() {
    this.devices = await this.ledController.getPreviousDevices();

  }

  connect(device: BluetoothDevice) {
    this.ledController.connectToPrevious(device);
  }

  async forget(device: BluetoothDevice) {
    await device.forget();
    this.loadDevices();
  }
}
