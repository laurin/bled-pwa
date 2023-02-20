import { Component, OnInit } from '@angular/core';
import { LedControllerService, SettingPropertyName, settingsProperties } from 'src/services/led-controller.service';

@Component({
  selector: 'app-device-management-controls',
  templateUrl: './device-management-controls.component.html',
  styleUrls: ['./device-management-controls.component.scss']
})
export class DeviceManagementControlsComponent implements OnInit {
  settingsProperties = settingsProperties;
  selectedSettingsProperty: SettingPropertyName = 'device_name';

  constructor(
    public ledController: LedControllerService,
  ) { }

  ngOnInit(): void {
  }

  updateSettings(): void {
    const value = prompt(
      `value for setttings-property "${this.selectedSettingsProperty}"`,
      this.ledController.settings.get(this.selectedSettingsProperty)?.toString(),
    );
    if (value === null) {
      return;
    }
    this.ledController.writeSettingsValue(this.selectedSettingsProperty, value.replace('\r', ''));
  }
}
