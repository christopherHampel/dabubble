import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesServiceService } from '../../../services/messages/messages.service.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  private chatSubscription: Subscription | null = null;


  chatId: string | null = null;
  chatData: any = null;
  text:string = '';

  constructor(private route: ActivatedRoute, private chatService: MessagesServiceService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id'); // Hole die Chat-ID aus der URL
      if (this.chatId) {
        this.chatService.getChatData(this.chatId).subscribe({
          next: (data) => {
            this.chatData = data;
            console.log('Chat-Daten aktualisiert:', data);
          },
          error: (err) => {
            console.error('Fehler beim Abrufen der Chat-Daten:', err);
          }
        });
      } else {
        console.error('Keine gültige Chat-ID gefunden!');
      }
    });
  }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(async params => {
  //     this.chatId = params.get('id');
  //     if (this.chatId) {
  //       this.chatData = await this.chatService.getChatData(this.chatId);
  //       console.log('Chat-Daten:', this.chatData);
  //     }
  //   });
  // }

  async sendText() {
    await this.chatService.addTextToChat(this.text, this.chatId!);
    console.log(this.text);
    this.text = '';
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }
}
