import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxFieldComponent, TextMessageEvent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-text.response';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFieldComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessageWithField( {prompt, file}: TextMessageEvent ){
    const text = prompt ?? file.name ?? 'Traduce el audio';
    this.isLoading.set(true);

    this.messages.update( prev => [...prev, { isGpt: false, text: text } ])

    this.openAiService.audioToText( file, text )
      .subscribe( resp => this.handleResponse(resp))
  }

  handleResponse(resp: AudioToTextResponse | null ) {
    this.isLoading.set(false);
    if(!resp) return;

    const text = `
    ## Transcripción:
    __Duración:__ ${ Math.round(resp.duration)} segundos.
    ## El texto es:
    ${resp.text}
    `;

    this.messages.update( prev => [...prev, { isGpt: true, text: text }]);

    for(const segment of resp.segments ) {
      const segmentMessage = `
      __De ${ Math.round(segment.start)} a ${Math.round(segment.end)} segundos.__
      ${segment.text}
      `;
      this.messages.update( prev => [...prev, { isGpt: true, text: segmentMessage }]);
    }
  }
}
