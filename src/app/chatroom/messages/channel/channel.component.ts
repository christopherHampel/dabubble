import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  channelDb = inject(ChannelsDbService);

  constructor(private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.channelDb.subToChannel(params['id']);
    });
  }


  getChannelParticipantsDetails() {
    return this.channelDb.channelData.participantsDetails;
  }
}
