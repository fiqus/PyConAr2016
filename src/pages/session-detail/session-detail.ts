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
  canVote: Boolean;
  voteEnabled: Boolean;
  deviceUUID: any;
  error: string;
  voteMade: any;

  constructor(public navParams: NavParams, public http: Http) {
    this.session = navParams.data;
    this.voteEnabled = this.session.kind === 'charla';
    this.canVote = !this.talkVoted();
    this.http = http;
    if(Device.device && Device.device.uuid) {
      this.deviceUUID = Device.device.uuid;
    } else {
      this.deviceUUID = '123412409I210'; //in dev 
    }
  }

  voteTalk() {
    if(!this.talkVoted()) {
      this.error = "";
      let link = 'https://pyconar-talks.fiqus.com/api/scores';
      var data = {score: {score: this.voteMade, user_id: this.deviceUUID, talk_id: this.session.idTalk}};
      let headers = new Headers({ 'Content-Type': 'application/json',  });
      let options = new RequestOptions({ headers: headers });

      this.http.post(link, data, options).subscribe(data => {
        localStorage.setItem("talk" + this.session.idTalk, this.voteMade);
        this.canVote = false;
      }, error => {
        if(error.errors && error.errors.talk_id_user_id) {
          this.error = "Esta charla ya fue votada";
        } else {
          this.error = "Hubo un error, por favor intente más tarde";
        }
        this.voteMade = null;
      });
    }
  }

  setVote(voteValue) {
    if(!this.talkVoted()) {
      this.voteMade = voteValue;
    }
  }

  talkVoted() {
    let wasVoted = localStorage.getItem("talk" +  this.session.idTalk);
    if (wasVoted) {
      this.voteMade = wasVoted;
    }
    return wasVoted;
  }
}
