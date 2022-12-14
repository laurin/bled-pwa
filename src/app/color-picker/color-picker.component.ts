import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import iro from '@jaames/iro';

export type RgbColor = { r: number, g: number, b: number };

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {

  @ViewChild('picker') pickerEl!: ElementRef<HTMLElement>;
  colorPicker!: iro.ColorPicker;

  @Output() input = new EventEmitter<RgbColor>();

  constructor() { }

  ngAfterViewInit(): void {
    this.colorPicker = iro.ColorPicker(this.pickerEl.nativeElement, {});
    this.colorPicker.on('input:change', () => {
      this.input.emit(this.colorPicker!.color.rgb);
    });
  }

  set(color: RgbColor) {
    this.colorPicker!.color.rgb = color;
  }
}
