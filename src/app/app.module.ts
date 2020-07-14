import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketioService } from './socketio.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,FormsModule,
    ReactiveFormsModule,
    // SocketIoModule.forRoot(config)
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
