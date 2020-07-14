import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketioService } from './socketio.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("localVideo", null) localVideo: ElementRef;
  @ViewChild("remoteVideo", null) remoteVideo: ElementRef;

  title = 'videoUI';
  user: string;
  room: string;
  msgText: string;
  msgArray = [];

  configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
  peerConnection: any;

  constructor(private socketService: SocketioService) {
    this.socketService.newUserJoined().subscribe(data => {
      this.msgArray.push(data);
    })
    //left room
    this.socketService.userLeftRoom().subscribe(data => {
      this.msgArray.push(data);
    })
    //new Msg
    this.socketService.newMsgReceived().subscribe(data => {
      this.msgArray.push(data);
    })
  }
  ngOnInit() {
    this.socketService.setupSocketConnection();
  }
  callVideo() {

    //creating connection with peers
    this.peerConnection = new RTCPeerConnection(this.configuration);

    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        // const localVideo =document.querySelector('video');
        if (this.localVideo) {
          console.log(stream);
          // localVideo.srcObject = stream;
          this.localVideo.nativeElement.srcObject = stream;
          stream.getTracks().forEach(track => { this.peerConnection.addTrack(track, stream) });

        }
      },
      error => {
        console.warn(error.message);
      }
    );
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      console.log(stream);

      this.remoteVideo.nativeElement.srcObject = stream
    };
  }

  createRoom(){
    this.callVideo();
    this.socketService.joinRoom({ user: this.user, room: this.room });
  }









  joinRoom() {
    this.socketService.joinRoom({ user: this.user, room: this.room });
  }
  LeaveRoom() {
    this.socketService.leaveRoom({ user: this.user, room: this.room });
  }
  sendMsg() {
    this.socketService.sendMessage({ user: this.user, room: this.room, msg: this.msgText });
  }
}
