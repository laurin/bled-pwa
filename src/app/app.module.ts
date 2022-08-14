import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { PreviousDevicesComponent } from './previous-devices/previous-devices.component';

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    PreviousDevicesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
