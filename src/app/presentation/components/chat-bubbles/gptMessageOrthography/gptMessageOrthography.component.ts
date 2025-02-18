import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-gpt-message-orthography',
  imports: [],
  templateUrl: './gptMessageOrthography.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageOrthographyComponent {
  @Input({ required: true }) UserScore!: number;
  @Input({ required: true }) text!: string;
  @Input() errors: string[] = [];
}
