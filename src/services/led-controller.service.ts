/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RgbColor } from '../app/color-picker/color-picker.component';
import { LocalStorageService } from './local-storage.service';

const LED_SERVICE_UUID = "c7564aae-99ee-4874-848b-8a01f00d71bd";
const LED_COLOR_CHARACTERISTIC_UUID = "88db6efe-6abe-477f-bced-b5b0f5984320";

const DEVICE_MANAGEMENT_SERVICE_UUID = "5f3b4458-9ae1-4f55-a3db-61e2399ff25c";
const RSU_START_CHARACTERISTIC_UUID = "46db1e53-956a-4b9b-9e83-e3d69782471a";
const REBOOT_CHARACTERISTIC_UUID = "f60cb6ab-c991-4ff4-b870-cbb32cdc5ff6";
const SETTINGS_CHARACTERISTIC_UUID = "266dba98-abcf-45e5-9772-a26ad6680f7f";

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export const settingsProperties = ['num_leds', 'device_name', 'wifi_ssid', 'wifi_password'] as const;
export type SettingPropertyName = typeof settingsProperties[number];

type LedControllerFeature = 'rsu' | 'reboot' | 'settings';

@Injectable({
  providedIn: 'root'
})
export class LedControllerService {
  connectionStatus = new BehaviorSubject<ConnectionStatus>('disconnected');
  color = new BehaviorSubject({ r: 0, g: 0, b: 0 });
  services = new Map<string, BluetoothRemoteGATTService>();
  characteristics = new Map<string, BluetoothRemoteGATTCharacteristic>();

  constructor(
    private localStorage: LocalStorageService,
  ) { }

  async selectDevice() {
    const bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{
        services: [LED_SERVICE_UUID],
      }],
      optionalServices: [DEVICE_MANAGEMENT_SERVICE_UUID],
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
        this.services.clear();
        this.characteristics.clear();
      });
      const gattServer = await bleDevice.gatt!.connect();
      console.log('gatt server connected');

      for (const service of await gattServer.getPrimaryServices()) {
        this.services.set(service.uuid, service);

        for (const characteristic of await service.getCharacteristics()) {
          this.characteristics.set(characteristic.uuid, characteristic);
        }
      }

      console.log('service retrieved');
      const colorCharacteristic = await this.characteristics.get(LED_COLOR_CHARACTERISTIC_UUID)!;

      console.log('characteristic retrieved');
      await colorCharacteristic.startNotifications();
      console.log('notifications started');
      colorCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        // @ts-ignore
        this.applyColor(event.srcElement.value);
      });
      console.log('event listener added');
      const val = await colorCharacteristic.readValue();
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
    await this.characteristics.get(LED_COLOR_CHARACTERISTIC_UUID)
      ?.writeValueWithoutResponse(new Uint8Array([color.r, color.g, color.b]));
  }

  async disconnect() {
    this.connectionStatus.next('disconnecting');
    await this.characteristics.get(LED_COLOR_CHARACTERISTIC_UUID)?.service.device.gatt?.disconnect();
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

  hasFeature(featureId: LedControllerFeature) {
    switch (featureId) {
      case 'rsu': return this.characteristics.has(RSU_START_CHARACTERISTIC_UUID);
      case 'reboot': return this.characteristics.has(REBOOT_CHARACTERISTIC_UUID);
      case 'settings': return this.characteristics.has(SETTINGS_CHARACTERISTIC_UUID);
    }
  }

  async startUpdate() {
    const url = prompt('url to update from', 'https://lamp-firmware.gh.l5w.de/firmware.bin');
    if (!url) {
      return;
    }
    await this.characteristics.get(RSU_START_CHARACTERISTIC_UUID)?.writeValueWithoutResponse(new TextEncoder().encode(url));
    await this.disconnect();
  }

  async reboot() {
    await this.characteristics.get(REBOOT_CHARACTERISTIC_UUID)?.writeValueWithoutResponse(new ArrayBuffer(0));
    await this.disconnect();
  }

  async writeSettingsValue(key: string, value: string | number) {
    await this.characteristics.get(SETTINGS_CHARACTERISTIC_UUID)
      ?.writeValueWithoutResponse(new TextEncoder().encode(`${key}\t${value}`));
    console.log(new TextEncoder().encode(`${key}\t${value}`));

  }
}
