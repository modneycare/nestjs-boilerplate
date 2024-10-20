import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
@Injectable()
export class TranslationService {
    
    private readonly gptClient = new OpenAI({
        apiKey:
          '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',
      });
    async translateProductNameGpt(text : string) { 
        const chatCompletion = await this.gptClient.chat.completions.create({
            messages: [
              {
                role: 'system',
                content:
                  '쇼핑몰에 판매할 상품명이야. 최대한 자연스럽게 한글로 번역해 줘',
              },
              { role: 'user', content: text },
            ],
            model: 'gpt-4o-mini',
          });
        return chatCompletion.choices[0].message.content;
    }
}
