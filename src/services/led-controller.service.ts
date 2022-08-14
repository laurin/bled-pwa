/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RgbColor } from '../app/color-picker/color-picker.component';
import { LocalStorageService } from './local-storage.service';

const LED_SERVICE_UUID = "c7564aae-99ee-4874-848b-8a01f00d71bd";
const LED_COLOR_CHARACTERISTIC_UUID = "88db6efe-6abe-477f-bced-b5b0f5984320";

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

@Injectable({
  providedIn: 'root'
})
export class LedControllerService {
  connectionStatus = new BehaviorSubject<ConnectionStatus>('disconnected');
  color = new BehaviorSubject({ r: 0, g: 0, b: 0 });
  private colorCharacteristic?: BluetoothRemoteGATTCharacteristic;

  constructor(
    private localStorage: LocalStorageService,
  ) { }

  async selectDevice() {
    const bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{
        services: [LED_SERVICE_UUID],
      }]
    });
    console.log('device selected');
    this.setDevice(bleDevice);
  }

  async setDevice(bleDevice: BluetoothDevice) {
    this.connectionStatus.next('connecting');
    try {
      bleDevice.addEventListener('gattserverdisconnected', () => {
        this.connectionStatus.next('disconnected');
        console.log('device disconnected');
        delete this.colorCharacteristic;
      });
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

      this.applyColor(val);
      this.connectionStatus.next('connected');
    } catch {
      this.connectionStatus.next('disconnected');
    }
  }

  private applyColor(value: DataView) {
    const [r = 0, g = 0, b = 0] = [...(new Uint8Array(value.buffer))];
    this.color.next({ r, g, b });
  }

  getPreviousDevices() {
    // @ts-ignore
    return navigator.bluetooth.getDevices({
      filters: [{
        services: [LED_SERVICE_UUID],
      }]
    });
  }

  async setColor(color: RgbColor) {
    if (!this.colorCharacteristic) { return; }
    await this.colorCharacteristic.writeValueWithoutResponse(new Uint8Array([color.r, color.g, color.b]));
  }

  async disconnect() {
    this.connectionStatus.next('disconnecting');
    await this.colorCharacteristic?.service.device.gatt?.disconnect();
  }

  async connectToPrevious(device: BluetoothDevice) {
    const abortController = new AbortController();
    device.addEventListener('advertisementreceived', () => {
      abortController.abort();
      this.setDevice(device);
      // @ts-ignore
      device.removeAllListeners('advertisementreceived');
    });
    device.watchAdvertisements({ signal: abortController.signal });
  }

  async autoconnect() {
    const deviceId = this.getAutoconnect();
    const device = (await this.getPreviousDevices())
      .find(device => device.id === deviceId);
    if (device) {
      console.log(`trying to autoconnect to ${device.name}`);
      this.connectToPrevious(device);
    }
  }

  setAutoconnect(deviceId: string) {
    if (deviceId !== "undefined") {
      this.localStorage.set('bled-autoconnect-id', deviceId);
    } else {
      this.localStorage.remove('bled-autoconnect-id');
    }
  }

  getAutoconnect(): string | undefined {
    return this.localStorage.get('bled-autoconnect-id');
  }
}
