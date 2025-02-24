import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public threadId = signal<string | undefined>(undefined);

  handleMessage(question: string) {
    this.isLoading.set(true);
    this.messages.update(prev => [...prev, { text: question, isGpt: false }]);

    this.openAiService.postQuestion(this.threadId()!, question)
      .subscribe(replies => {
        this.isLoading.set(false);
        const reply = replies[replies.length - 1];
        for (const message of reply.content) {
          this.messages.update(prev => [
            ...prev,
            {
              isGpt: reply.role === 'assistant',
              text: message,
            }
          ])
        }
      })
  }

  ngOnInit(): void {
    this.openAiService.createdThread()
      .subscribe(id => {
        this.threadId.set(id);
      })
  }
}
