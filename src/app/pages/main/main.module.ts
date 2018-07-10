import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { LeftControlComponent } from './left-control/left-control.component';
import { ListComponent } from './left-control/list/list.component';
import { RightControlComponent } from './right-control/right-control.component';
import { HeaderComponent } from './right-control/header/header.component';
import { QuickAddComponent } from './right-control/quick-add/quick-add.component';
import { TodoComponent } from './right-control/todo/todo.component';
import { SuggestComponent } from './right-control/header/suggest/suggest.component';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    MainRoutingModule,
    FormsModule
  ],
  declarations: [
    MainComponent,
    LeftControlComponent,
    ListComponent,
    RightControlComponent,
    HeaderComponent,
    QuickAddComponent,
    TodoComponent,
    SuggestComponent,
    DetailComponent
  ]
})
export class MainModule { }
