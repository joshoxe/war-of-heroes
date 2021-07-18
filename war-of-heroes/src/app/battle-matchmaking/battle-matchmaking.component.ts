import { Component, OnInit } from '@angular/core';
import { io }from 'socket.io-client';
import { UserService } from '../user.service';

@Component({
  selector: 'app-battle-matchmaking',
  templateUrl: './battle-matchmaking.component.html',
  styleUrls: ['./battle-matchmaking.component.css']
})
export class BattleMatchmakingComponent implements OnInit {
  private socket;
  public gameReady: boolean = false;
  public matchmakingInProgress: boolean = false;
  public gameOver: boolean = false;
  public text: string;
  public winner: boolean;
  public image: string = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  connect(): void {
    this.gameOver = false;
    this.gameReady = false;
    this.matchmakingInProgress = true;
    this.socket = io("http://localhost:3000");

    this.socket.onAny((eventName, data) => {

      if (eventName == "matchmaking") {
        const name = this.userService.getUserFirstName();
        this.userService.getUserDeck().subscribe((ids) => {
          // Pass the auth tokens so the server can call API endpoints for user data
          this.socket.emit("matchmaking", [name, this.userService.getUserJwtToken(), this.userService.getUserAccessToken()]);
        });
      }

      if (eventName == "ready") {
        this.gameReady = true;
        this.matchmakingInProgress = false;
      }

      if (eventName == "message"){
        console.log(data);
      }

      if (eventName == "win") {
        this.image = "assets/images/youwin.gif"
        this.winner = true;
        this.gameOver = true;
        this.gameReady = false;
      }

      if (eventName == "lose") {
        this.image = "assets/images/youlose.gif"
        this.winner = false;
        this.gameOver = true;
        this.gameReady = false;
      }
    })
  }

  winGame() {
    console.log("Hit the win button!");
    this.socket.emit("win");
  }
}
