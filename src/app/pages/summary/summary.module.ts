import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SummaryComponent } from './summary.component';
import { SummaryService } from './summary.service';
import { SummaryRoutingModule } from './summary-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SummaryRoutingModule
  ],
  declarations: [ SummaryComponent ],
  providers: [ SummaryService ]
})
export class SummaryModule { }
