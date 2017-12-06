import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { SearchFilterPipe } from 'app/shared/pipes/search-filter.pipe';

@NgModule({
  declarations: [
    //pipes
    SearchFilterPipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD0I9Hi4pdArBe7w4bxrZfLTTKfFKp64nw',
      libraries: ['places']
    })
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    AgmCoreModule,
    SearchFilterPipe
  ]
})
export class SharedModule {}
