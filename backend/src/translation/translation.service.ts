import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import tr from 'googletrans';
import * as deepl from 'deepl-node';

@Injectable()
export class TranslationService {

  constructor(private readonly configService : ConfigService,
    private readonly prismaService : PrismaService
  ) {}
    
    private readonly gptClient = new OpenAI({
        apiKey: this.configService.get('translate.gpt_key'),
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

    async translateProductDetailGpt(text : string) { 
      const chatCompletion = await this.gptClient.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                '쇼핑몰에 판매할 상품설명이야. 최대한 자연스럽게 한글로 번역해 줘',
            },
            { role: 'user', content: text },
          ],
          model: 'gpt-4o-mini',
        });
      return chatCompletion.choices[0].message.content;
  }



    async translateProductNameGoogleAPI(text : string, userId : string) { 
      // get random google api key of user 
      const googleApiKey = await this.prismaService.translationAPIKey.findMany({
        where : {
          userId : userId,
          translationSite : {
            name : "google"
          }
        }, 
      })
      const randomIndex = Math.floor(Math.random() * googleApiKey.length);
      const apiKey = googleApiKey[randomIndex].apiKey;

      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const data = {
        q: text,
        target: 'ko',
      };
  
      const result = await axios.post(url, data);
      const trans = result.data['data']['translations'][0]['translatedText'];
      return trans;

    }
    async translateProductNameGoogleFree(text : string) {
      const result = await tr(text, 'ko');
      return result.text;
      
    }

    async translateDeepl(text : string, userId : string) {
      // TODO : 딥플 번역 추가 
      const deeplApiKey = await this.prismaService.translationAPIKey.findMany({
        where : {
          userId : userId,
          translationSite : {
            name : "deepl"
          }
        }, 
      })
      const randomIndex = Math.floor(Math.random() * deeplApiKey.length);
      const apiKey = deeplApiKey[randomIndex].apiKey;
      
      const translator = new deepl.Translator(apiKey, {
        minTimeout: 30000,
      });
      const result = await translator.translateText(text, null, 'ko', {});
      return result.text;
    }

    // TODO : 파파고 번역 추가 
    async translateProductNamePapagoAPI(text : string, userId : string) {
      // get random papago api key of user 
      const papagoApiKey = await this.prismaService.translationAPIKey.findMany({
        where : {
          userId : userId,
          translationSite : {
            name : "papago"
          }
        }, 
      })
      const randomIndex = Math.floor(Math.random() * papagoApiKey.length);
      const apiKey = papagoApiKey[randomIndex].apiKey;
    }

    async check(id : number, apiKey : string) {
      const translationSite = await this.prismaService.translationSite.findUnique({
        where : { 
          id : id
        }
      })
      if (translationSite.name === "google") {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const data = {
          q: 'hi',
          target: 'ko',
        };
  
        const result = await axios.post(url, data).catch((err) => {
          return err;
        });
        const trans = result.data['data']['translations'][0]['translatedText'];
        if ( trans == "안녕" && result.status === 200) {
          return {data : true};
        }
        return {data : false};
      }
      else {
        return {data : false};
      }
    }
}
