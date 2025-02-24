import { Injectable } from '@angular/core';
import { audioToTextUseCase, createThreadUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyUseCase, postQuestionUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase, translateUseCase } from '@use-cases//index';
import { from, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {

  checkOrthography(prompt: string) {
    return from(orthographyUseCase(prompt));
  }
  prosConsDiscusser(prompt: string) {
    return from(prosConsUseCase(prompt));
  }
  prosConsStreamDiscusser(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translateText(prompt: string, lang: string) {
    return from(translateUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }

  audioToText(file: File, prompt?: string) {
    return from(audioToTextUseCase(file, prompt));
  }

  imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
    return from(imageGenerationUseCase(prompt, originalImage, maskImage));
  }

  imageVariation(originalImage: string) {
    return from(imageVariationUseCase(originalImage));
  }

  createdThread(): Observable<string> {
    if (localStorage.getItem('thread')) {
      return of(localStorage.getItem('thread')!);
    }

    return from(createThreadUseCase())
      .pipe(
        tap((thread) => {
          localStorage.setItem('thread', thread);
        })
      )
  }

  postQuestion(threadId: string, question: string) {
    return from(postQuestionUseCase(threadId, question));
  }
}
