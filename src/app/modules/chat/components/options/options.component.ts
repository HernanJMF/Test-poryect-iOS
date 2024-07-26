import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { ToastNotification } from 'src/app/shared/types/ToastNotification';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent  implements OnInit {

  formGroup: FormGroup;
  isValid: boolean = false;
  topicList: any[] = [];
  languageList: any[] = [ 
    {name: 'Español', value: 'spanish'},
    {name: 'Ingles', value: 'english'}
  ];

  @Input() innerWidth: number = 0;

  @Output() selectConfig = new EventEmitter<any>();  
  @Output() clearTopicEvent = new EventEmitter<any>();


  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private messageService: MessageService
    ) {
      this.resetForm();
      this.loadTopicList();
    }

  ngOnInit() {}

  resetForm(){ // inicializa el formulario de la pantalla de selección de tópico
    this.formGroup = this.formBuilder.group({
      topic: [null, [Validators.required]],
      language: [null, [Validators.required]],
    });
    this.formGroup.controls['language'].setValue(this.languageList[0]);
    this.formGroup.statusChanges.subscribe(status => {
      this.isValid = (status == "VALID");
    });
  }

  loadTopicList(): void { //obtiene la lista de topicos posibles
    this.chatService.getTopicList().subscribe({
      next: (res: any) => {
        this.topicList = res;
      },
      error: () =>{
        const notification: ToastNotification = {
          title: this.formGroup.controls['language'].value.value == 'english' ? 'Could not get list of topics' : 'No se ha podido obtener la lista de temas',
          content: '',
          success_status: false,
        };
        this.messageService.Notify(notification);
      }
    });
  }
  
  changeTopic(clearTopic? : boolean){
    if(this.innerWidth >= 768 &&  this.formGroup.controls['topic'].value){
      this.selectConfig.emit({topic_name: this.formGroup.controls['topic'].value.topic_name, topic_id: this.formGroup.controls['topic'].value.topic_id, language: this.formGroup.controls['language'].value.value});
      if(!clearTopic){
        this.clearTopicEvent.emit();
      }
    }
  }

  clearTopic(){
    if(this.innerWidth >= 768){
      this.selectConfig.emit({topic_name: "", topic_id: "", language: ""});
      this.clearTopicEvent.emit();
    }
  }

  changeLanguage(language: any){ //Cambia el idioma de la plataforma
    if(language == 'english'){
      this.languageList = [ 
        {name: 'Spanish', value: 'spanish'},
        {name: 'English', value: 'english'}
      ];
      this.formGroup.controls['language'].setValue(this.languageList[1]);
      this.changeTopic(true);
    }else{
      this.languageList = [ 
        {name: 'Español', value: 'spanish'},
        {name: 'Ingles', value: 'english'}
      ];
      this.formGroup.controls['language'].setValue(this.languageList[0]);
      this.changeTopic(true);
    }
  }

  submitConfig(){ //envia la informacion seleccionada en el formulario al componente padre
    this.selectConfig.emit({topic_name: this.formGroup.controls['topic'].value.topic_name, topic_id: this.formGroup.controls['topic'].value.topic_id, language: this.formGroup.controls['language'].value.value});
  }

}
