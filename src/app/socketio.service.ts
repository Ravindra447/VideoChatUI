import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  url = 'http://localhost:3001';
  // ,private socket:Socket
  private socket;
  activeSockets: any=[];
  constructor(private http: HttpClient) {
    this.socket = io(this.url);
  }

  setupSocketConnection() {

    this.socket.on('connect', () => {
      console.log(this.socket.id); // 'G5p5...'
    });
    // this.socket.emit('message', "hello");
  }
  //join to the room
  joinRoom(data) {
    this.socket.emit('join', data);
  }
  //observe new user
  newUserJoined() {
    let observable = new Observable<{ user: string, msg: string }>(observer => {
      console.log("check........................")
      this.socket.on('new user joined', (data) => {
        observer.next(data);
      })
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }
  //Leave to the room
  leaveRoom(data) {
    this.socket.emit('leave', data);
  }
  userLeftRoom() {
    let observable = new Observable<{ user: string, msg: string }>(observer => {
      console.log("check........................")
      this.socket.on('left room', (data) => {
        observer.next(data);
      })
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

  //send message
  sendMessage(data) {
    this.socket.emit('message', data);
  }
  //new msg received
  newMsgReceived(){
    let observable = new Observable<{ user: string, msg: string }>(observer => {
      console.log("check........................")
      this.socket.on('new message', (data) => {
        observer.next(data);
      })
      return () => { this.socket.disconnect(); }
    });
    return observable;

  }
  //video part

  joinVideoRm(){
    this.socket.on("connection", socket => {
      const existingSocket = this.activeSockets.find(
        existingSocket => existingSocket === socket.id
      );
  
      if (!existingSocket) {
        this.activeSockets.push(socket.id);
  
        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            existingSocket => existingSocket !== socket.id
          )
        });
  
        socket.broadcast.emit("update-user-list", {
          users: [socket.id]
        });
      }
      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(
          existingSocket => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
          socketId: socket.id
        });
      });
    })
  }


  //observe new user for video
  newUserJoinedWithVideo() {
    let observable = new Observable<{ user: string, msg: string }>(observer => {
      console.log("check........................")
      this.socket.on('new user joined', (data) => {
        observer.next(data);
      })
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

}
