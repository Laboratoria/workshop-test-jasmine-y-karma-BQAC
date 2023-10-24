import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitressRoutingModule } from './waitress-routing.module';
import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, WaitressRoutingModule],
})
export class WaitressModule {}
