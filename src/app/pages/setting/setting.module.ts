import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [ SettingComponent ]
})
export class SettingModule { }
