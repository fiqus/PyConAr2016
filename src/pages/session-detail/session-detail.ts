import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from 'ionic-native';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  voteEnabled: Boolean;
  deviceUUID: any;
  error: string;
  voteMade: any;

  constructor(public navParams: NavParams, public http: Http) {
    this.session = navParams.data;
    this.voteEnabled = !this.talkVoted() && this.session.kind === 'charla';
    this.http = http;
    if(Device.device) {
      this.deviceUUID = Device.device.uuid;
    } else {
      this.deviceUUID = '123412409I210'; //in dev 
    }
  }

  voteTalk() {
    if(!this.talkVoted()) {
      this.error = "";
      console.log("talk voted!", this.session.idTalk);
      let link = 'https://pyconar-talks.fiqus.com/api/scores';
      var data = {score: 'this.voteMade', user_id: '1234', talk_id: this.session.idTalk};
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.post(link, data).subscribe(data => {
        localStorage.setItem("talk" + this.session.idTalk, this.voteMade);
        this.voteEnabled = false;
        console.log(data);
      }, error => {
        console.log(data);
        if(error.errors && error.errors.talk_id_user_id) {
          this.error = "Esta charla ya fue votada";
        } else {
          this.error = "Hubo un error, por favor intente más tarde";
        }
        this.voteMade = null;
        console.log("error", error);
      });
    }
  }

  setVote(voteValue) {
    this.voteMade = voteValue;
  }

  talkVoted() {
   let wasVoted = localStorage.getItem("talk" +  this.session.idTalk);
   this.voteMade = wasVoted;
   return wasVoted;
  }
}
