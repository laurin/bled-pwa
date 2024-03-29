import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { PreviousDevicesComponent } from './previous-devices/previous-devices.component';
import { AutoconnectSelectorComponent } from './autoconnect-selector/autoconnect-selector.component';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UpdateNotificationComponent } from './update-notification/update-notification.component';
import { BledControlsComponent } from './bled-controls/bled-controls.component';
import { DeviceManagementControlsComponent } from './device-management-controls/device-management-controls.component';
import { GuiModeControlsComponent } from './gui-mode-controls/gui-mode-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    PreviousDevicesComponent,
    AutoconnectSelectorComponent,
    UpdateNotificationComponent,
    BledControlsComponent,
    DeviceManagementControlsComponent,
    GuiModeControlsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
