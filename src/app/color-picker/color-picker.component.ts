import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import iro from '@jaames/iro';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {

  @ViewChild('picker') pickerEl!: ElementRef<HTMLElement>;
  colorPicker!: iro.ColorPicker;

  @Output() input = new EventEmitter<{ r: number, g: number, b: number }>();

  constructor() { }

  ngAfterViewInit(): void {
    this.colorPicker = iro.ColorPicker(this.pickerEl.nativeElement, {});
    this.colorPicker.on('input:change', () => {
      this.input.emit(this.colorPicker!.color.rgb);
    });
  }

  set(r: number, g: number, b: number) {
    this.colorPicker!.color.rgb = { r, g, b };
  }
}
