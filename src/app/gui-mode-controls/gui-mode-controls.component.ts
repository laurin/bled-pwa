import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { GuiMode, GUI_MODES, LedControllerService } from 'src/services/led-controller.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { debounce } from '../../decorators/debounce.decorator';

@Component({
  selector: 'app-gui-mode-controls',
  templateUrl: './gui-mode-controls.component.html',
  styleUrls: ['./gui-mode-controls.component.scss']
})
export class GuiModeControlsComponent implements AfterViewInit {
  @ViewChild('colorPicker') colorpicker!: ColorPickerComponent;
  GUI_MODES = GUI_MODES;

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

  onModeChange(newMode: GuiMode) {
    this.ledController.setGuiMode(newMode);
  }
}
