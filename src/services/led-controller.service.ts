/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RgbColor } from '../app/color-picker/color-picker.component';

const LED_SERVICE_UUID = "c7564aae-99ee-4874-848b-8a01f00d71bd";
const LED_COLOR_CHARACTERISTIC_UUID = "88db6efe-6abe-477f-bced-b5b0f5984320";

@Injectable({
  providedIn: 'root'
})
export class LedControllerService {
  connected = new BehaviorSubject(false);
  color = new BehaviorSubject({ r: 0, g: 0, b: 0 });
  private colorCharacteristic?: BluetoothRemoteGATTCharacteristic;

  constructor() { }

  async selectDevice() {
    const bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{
        services: [LED_SERVICE_UUID],
      }]
    });
    console.log('device selected');
    bleDevice.addEventListener('gattserverdisconnected', () => this.connected.next(false));
    const gattServer = await bleDevice.gatt!.connect();
    console.log('gatt server connected');
    const ledService = await gattServer.getPrimaryService(LED_SERVICE_UUID);
    console.log('service retrieved');
    this.colorCharacteristic = await ledService.getCharacteristic(LED_COLOR_CHARACTERISTIC_UUID);
    console.log('characteristic retrieved');
    await this.colorCharacteristic.startNotifications();
    console.log('notifications started');
    this.colorCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
      // @ts-ignore
      this.applyColor(event.srcElement.value);
    });
    console.log('event listener added');
    const val = await this.colorCharacteristic.readValue();
    console.log(val);

    this.applyColor(val);
    this.connected.next(true);
  }

  private applyColor(value: DataView) {
    const [r, g, b] = [...(new Uint8Array(value.buffer))];
    if ([r, g, b].every(v => !isNaN(v))) {
      this.color.next({ r, g, b });
    }
  }

  async setColor(color: RgbColor) {
    if (!this.colorCharacteristic) { return; }
    await this.colorCharacteristic.writeValueWithoutResponse(new Uint8Array([color.r, color.g, color.b]));
  }
}
