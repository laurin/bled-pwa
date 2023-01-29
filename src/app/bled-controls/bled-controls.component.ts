import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LedControllerService, SettingPropertyName, settingsProperties } from 'src/services/led-controller.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { debounce } from '../../decorators/debounce.decorator';

@Component({
  selector: 'app-bled-controls',
  templateUrl: './bled-controls.component.html',
  styleUrls: ['./bled-controls.component.scss']
})
export class BledControlsComponent implements AfterViewInit {
  @ViewChild('colorPicker') colorpicker!: ColorPickerComponent;

  settingsProperties = settingsProperties;
  selectedSettingsProperty: SettingPropertyName = 'device_name';

  constructor(
    public ledController: LedControllerService,
  ) { }

  @debounce(100)
  async colorChange(color: any) {
    await this.ledController.setColor(color);
  }

  ngAfterViewInit(): void {
    this.ledController.color.subscribe(color => {
      this.colorpicker.set(color);
    });
    this.ledController.autoconnect();
  }

  updateSettings(): void {
    const value = prompt(
      `value for setttings-property "${this.selectedSettingsProperty}"`,
      this.ledController.settings.get(this.selectedSettingsProperty)?.toString(),
    );
    if (!value) {
      return;
    }
    this.ledController.writeSettingsValue(this.selectedSettingsProperty, value);
  }
}
