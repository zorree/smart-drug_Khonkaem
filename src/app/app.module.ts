import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  BrowserModule,
    HttpClientModule,
    NgbModule,
     IonicModule.forRoot(),
     IonicStorageModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    BarcodeScanner,
    { 
      provide: RouteReuseStrategy,
       useClass: IonicRouteStrategy 
      }
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
