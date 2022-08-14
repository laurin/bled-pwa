import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { debounce } from '../decorators/debounce.decorator';
import { LedControllerService } from '../services/led-controller.service';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('colorPicker') colorpicker!: ColorPickerComponent;

  constructor(
    public ledController: LedControllerService,
  ) { }

  ngAfterViewInit(): void {
    this.ledController.color.subscribe(color => {
      this.colorpicker.set(color);
    });
    this.ledController.autoconnect();
  }

  @debounce(100)
  async colorChange(color: any) {
    await this.ledController.setColor(color);
  }

  async pair() {
    await this.ledController.selectDevice();
  }
}
