import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatComponent } from '../components/chat/chat.component';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {

  step: number = 1;
  language: string = "";
  topic_name: string = "";
  topic_id: string = "";
  innerWidth: number;

  @ViewChild(ChatComponent) chatComponent: any;

  constructor(){
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 768){
      this.step = 1
    }else{
      this.step = -1
    }
  }

  startChat(event: any){ //inicia la conversación con el tópico seleccionado
    this.language = event.language;
    this.topic_name = event.topic_name;
    this.topic_id = event.topic_id
    if(this.innerWidth < 768){
      this.step = 2;
    }
  }

  stepBack(){ // devuelve la pantalla a la seleccion de topicos
    this.step = 1;
  }

  clearTopic(){
    this.chatComponent.clearData();
  }

  @HostListener('window:resize', ['$event'])
    onResize() {
      this.innerWidth = window.innerWidth;
      if(this.innerWidth < 768){
        this.step = this.topic_id.length > 0 ? this.step : 1
      }else{
        this.step = -1
      }
  }

}
