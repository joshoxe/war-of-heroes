import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { io }from 'socket.io-client';

@Component({
  selector: 'app-battle-matchmaking',
  templateUrl: './battle-matchmaking.component.html',
  styleUrls: ['./battle-matchmaking.component.css']
})
export class BattleMatchmakingComponent implements OnInit {
  private socket;
  public gameReady: boolean = false;
  public text: string;

  constructor() { }

  ngOnInit(): void {
  }

  connect(): any {
    this.socket = io("http://localhost:3000");

    this.socket.onAny((eventName, data) => {
      console.log("Received event: ", eventName);

      if (eventName == "matchmaking") {
        console.log("Event was a matchmaking request, sending name");
        this.socket.emit("matchmaking", ["TestName", [1,2,3,4]]);
      }

      if (eventName == "ready") {
        this.gameReady = true;
        this.text = data;
      }

      if (eventName == "message"){
        console.log(data);
      }
    })
  }
}
