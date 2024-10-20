import tr from 'googletrans';
import fs from 'fs';
import axios from 'axios';
import * as deepl from 'deepl-node';
import OpenAI from 'openai';

const gptClient = new OpenAI({
  apiKey:
    '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',
});
const key_list = [
  // 'ワンピース フィギュア',
  // 'ポーター',
  'ワンピース',
  'ワンピースドレス',
  'ブラウス',
  'カーディガン',
  'セーター',
  'ティーシャツ',
  '半ズボン',
  '短パン',
  'ジーパン',
  'スカート',
  'ジャケット',
  'コート',
  '外套',
  'ビキニ',
  '水泳服',
  '水着',
  'パンティー',
  'ブリーフ',
  'ブラジャー',
  'ブラ',
  '履物',
  '運動靴',
  'スリッパ',
  'スリッパー',
  'ブーツ',
  '長靴',
  '深靴',
  '長靴',
  'ブーツ',
  'ネクタイ',
  '野球帽',
  'フェドラ',
  'サンダル',
  '皮靴',
  '靴',
  'ハイヒール',
  'バックパック',
  'ショルダーバッグ',
  'ショルダー',
  'トートバッグ',
  'エコバッグ',
  'フィギュア',
  '飴',
  'キャラメル',
  'チョコレート',
  '菓子',
  'ケーキ',
];
const amazon_list = [
  // 'https://www.amazon.com/s?k=nike+dunks+women&crid=2H9OU7VJ21SF4&sprefix=nike+d%2Caps%2C314&ref=nb_sb_ss_pltr-mrr_3_6',
  // 'https://www.amazon.com/s?k=adidas+tops&crid=102Q4FO32VS4N&sprefix=adidas+womens+tops%2Caps%2C780&ref=nb_sb_noss_1',
  // 'https://www.amazon.com/s?k=onepiece+figures&crid=GT7JRYQ6OWYX&sprefix=onepiece+figures%2Caps%2C267&ref=nb_sb_noss_1',
  // 'https://www.amazon.com/s?k=dragonball+figures&crid=1SIYZ6Y1F0SJ8&sprefix=dragonball+figures%2Caps%2C297&ref=nb_sb_noss_1',
  // 'https://www.amazon.com/s?k=callaway+golf+balls&crid=2RJ6XSMSE0O74&sprefix=callwa%2Caps%2C322&ref=nb_sb_ss_pltr-mrr_1_6',
  // 'https://www.amazon.com/s?k=callaway+golf+hat&crid=3B83G4K8XQ9JE&sprefix=callaway+golf+hat%2Caps%2C362&ref=nb_sb_noss_1',
  // 'https://www.amazon.com/s?k=asics+running+shoes&crid=125YWET236W3N&sprefix=asics+ru%2Caps%2C298&ref=nb_sb_ss_pltr-mrr_3_8',
  // 'https://www.amazon.com/s?k=tommy+hilfiger+men&rh=n%3A7141123011%2Cp_123%3A232763&dc&ds=v1%3A4lrkSDq82HnZ6WahqxyuabjqAoa9mmum2rzYoTpx4nU&crid=2WUDJE1FQFRZO&qid=1729034706&rnid=85457740011&sprefix=tommy%2Caps%2C398&ref=sr_nr_p_123_1',
  // 'https://www.amazon.com/s?k=callaway+golf+clubs&crid=1KGKEPZ6FFH5Q&sprefix=callaway+golf+%2Caps%2C427&ref=nb_sb_ss_pltr-mrr_3_14',

  'https://www.amazon.de/s?i=office-products&srs=26063504031&rh=n%3A3167641%2Cn%3A192416031%2Cn%3A26063504031&dc&language=en&ds=v1%3ATwj2LV%2B7LlqDOp4FgNahEbvbz%2FjRT6J9S1bUtBT%2FTS0&qid=1729126406&rnid=192416031&ref=sr_nr_n_2',
  // 'https://www.amazon.de/s?i=kitchen&bbn=3167641&rh=n%3A2970885031&fs=true&language=en&ref=lp_2970885031_sar',
  // 'https://www.amazon.de/s?i=kitchen&bbn=3167641&rh=n%3A3167641%2Cn%3A3312271%2Cn%3A3437624031&dc&fs=true&language=en&ds=v1%3AcBh0uyI3CH1v4IuD0d3dI%2F5FVseb9obfHcwr7EegivY&qid=1729126568&rnid=3312271&ref=sr_nr_n_4',
  // 'https://www.amazon.de/s?i=kitchen&bbn=3167641&rh=n%3A3167641%2Cn%3A3517801%2Cn%3A343503011%2Cn%3A2864848031&dc&fs=true&language=en&ds=v1%3A6MvSDAzmryOxw9j7347W3ZS4fQtNGgZlK155ocTaE%2Bg&qid=1729126611&rnid=343503011&ref=sr_nr_n_8',
  // 'https://www.amazon.de/s?k=nail+art&rh=n%3A591298031%2Cn%3A2975651031&dc&language=en&ds=v1%3AvFJ0OJ9CoO3D5xBwLWWEb9m9m38Udxa2bnEuSIY2cOM&crid=3KRAAO8QW083W&qid=1729126650&rnid=1703609031&sprefix=nail%2Caps%2C327&ref=sr_nr_n_3',
  // 'https://www.amazon.de/s?k=toys&i=toys&rh=n%3A12950651%2Cn%3A360389031%2Cn%3A360390031%2Cn%3A360391031&dc&language=en&ds=v1%3AfWdJBK7I2b7rH6MRVT%2FZXLtTonqh6iKw%2BJBRD8sFGqA&crid=14TSPDY5LLL0F&qid=1729126764&rnid=360390031&sprefix=toy%2Caps%2C330&ref=sr_nr_n_1',
  // 'https://www.amazon.de/s?i=handmade&bbn=14133650031&dc&language=en&qid=1729127000&ref=lp_specialty-aps_nr_i_0',
];

const rakuten_list = [
  'https://ranking.rakuten.co.jp/daily/559647/',
  // 'https://search.rakuten.co.jp/search/mall/-/201153/?f=13',
  // 'https://ranking.rakuten.co.jp/daily/303656/',
  // 'https://biccamera.rakuten.co.jp/search/mall/-/566113/',
  // 'https://www.rakuten.co.jp/category/502911/',
  // 'https://www.rakuten.co.jp/category/100863/?l-id=top_normal_gmenu_interior_015',
];
async function translation(text: string, type = 1) {
  if (type == 1) {
    try {
      // const eng = await tr(text, {
      //   from: 'ja',
      //   to: 'en',
      // });
      const result = await tr(text, 'ko');
      return {
        origin: text,
        translation: result.text,
      };
    } catch (error) {
      console.log(` err: ${error}`);
    }
  } else if (type == 2) {
    // DEEPL
    const authKey = '813da577-8cc0-45d4-9789-92f1a5825084:fx'; // Replace with your key
    const translator = new deepl.Translator(authKey, {
      minTimeout: 30000,
    });
    const result = await translator.translateText(text, null, 'ko', {});

    return {
      origin: text,
      translation: result.text,
    };
  } else if (type == 3) {
    const apikey = 'AIzaSyD0Qv45PtIQ5tyn4QukZb-BvoSUuTZ7NIA';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apikey}`;
    const data = {
      q: text,
      target: 'ko',
    };

    const result = await axios.post(url, data);
    const trans = result.data['data']['translations'][0]['translatedText'];

    return {
      origin: text,
      translation: trans,
    };
  } else if (type == 4) {
    const chatCompletion = await gptClient.chat.completions.create({
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
    // 초당 600회 제한에 맞춰서 SLEEP 추가
    await new Promise((resolve) => setTimeout(resolve, 130)); // 0.1초 대기

    return {
      origin: text,
      translation: chatCompletion.choices[0].message.content,
    };
  } else {
    console.log('error trans type');
  }
}
async function getList(keyword: string): Promise<[]> {
  const result = await axios.post(
    // 'http://127.0.0.1:3031/api/crawl/product_list/',
    'https://api.sellian.kr/api/crawl/product_list',
    {
      crawler_name: 'product_list_crawler',
      target: 'rakuten',
      type: 'rakuten_search',
      search_keyword: keyword,
      request_url: `https://search.rakuten.co.jp/search/mall/${keyword}`,
      proxy_mode: true,
      page_scope: {
        start_page: 1,
        end_page: 2,
      },
    },
  );

  return result.data;
}

async function getAmazonList(keyword: string): Promise<[]> {
  const result = await axios.post(
    'http://127.0.0.1:3031/api/crawl/product_list/',
    {
      crawler_name: 'product_list_crawler',
      target: 'amazon',
      type: 'amazon',
      search_keyword: keyword,
      request_url: `${keyword}`,
      proxy_mode: false,
      page_scope: {
        start_page: 1,
        end_page: 1,
      },
    },
  );
  return result.data;
}

async function getRakutenList(url: string): Promise<[]> {
  const result = await axios.post(
    // 'http://127.0.0.1:3031/api/crawl/product_list/',
    'https://api.sellian.kr/api/crawl/product_list',
    {
      crawler_name: 'product_list_crawler',
      target: 'rakuten',
      type: url.includes('ranking')
        ? 'rakuten_ranking'
        : url.includes('biccamera')
          ? 'rakuten_bic'
          : url.includes('fashion')
            ? 'rakuten_fashion'
            : 'rakuten_search',
      search_keyword: url,
      request_url: `${url}`,
      proxy_mode: false,
      page_scope: {
        start_page: 1,
        end_page: 1,
      },
    },
  );
  return result.data;
}

function getCleanedText(txt: string) {
  let cleanedTxt = txt;
  cleanedTxt = txt.replace(
    // /【.*?】|★.*?★|※.*?※|＜.*?＞|＼.*?／|《.*?》|\(.*?\)|（.*?）|［.*?］|「.*?」|『.*?』|〈.*?〉|《.*?》|【.*?】|/g,
    // /【.*?】|★.*?★|※.*?※|＜.*?＞|＼.*?／|《.*?》|\(.*?\)|（.*?）|［.*?］|「.*?」|『.*?』|〈.*?〉|《.*?》|【.*?】|`[×！？｜～：；'"＂""''・、。，．]/g,
    /【.*?】|★.*?★|※.*?※|＜.*?＞|＼.*?／|《.*?》|\(.*?\)|（.*?）|［.*?］|「.*?」|『.*?』|〈.*?〉|《.*?》|【.*?】/g,
    '',
  );

  // 텍스트에서 유니코드 문자, 숫자, 구두점 및 공백을 제외한 모든 문자를 제거합니다. 단, 콤마나 마침표는 제거하지 않습니다.
  cleanedTxt = cleanedTxt.replace(/[^\p{L}\p{N}\p{P}\s,\.]/gu, '');
  console.log('origin : ', txt, '\n', 'clean : ', cleanedTxt);
  return cleanedTxt;
}
function getDeduplatedText(txt: string) {
  const words = txt.split(' ');
  const uniqueWords = new Set();
  const result = [];

  for (const word of words) {
    if (!uniqueWords.has(word)) {
      uniqueWords.add(word);
      result.push(word);
    }
  }

  return result.join(' ');
}

function removeEng(txt: string) {
  const cleanedTxt = txt.replace(
    /\b\d+[a-zA-Z]+\b(?!\d)|\b[a-zA-Z]+\b(?!\d)|\b\d+off\b/gu,
    '',
  );
  return cleanedTxt;
}

async function main() {
  // json data 읽어오기
  const fs = require('fs');
  const path = require('path');

  const jsonDataPath = path.join(__dirname, 'rakuten_example.txt');
  let jsonData;

  try {
    const data = fs.readFileSync(jsonDataPath, 'utf8');
    jsonData = JSON.parse(data);
    // console.log('json data : ', jsonData);
  } catch (err) {
    console.error('Error reading json data:', err);
  }

  const promises = rakuten_list.map(async (key) => {
    let translationData: any = [];
    // const url = new URL(key);
    // const kValue = url.searchParams.get('k') ?? url.searchParams.get('i');
    const title = `${Date.now()}`;
    const _result = await getRakutenList(key);
    for (var j = 0; j < _result.length; j++) {
      // for (var j = 0; j < 10; j++) {
      try {
        const txt = _result[j]['product_name'];
        const getCleanText = getCleanedText(txt);
        const tdata = await translation(getCleanText);
        const gptText = await translation(getCleanText, 4);
        const googleApiText = await translation(getCleanText, 3);
        try {
          translationData.push({
            origin: tdata.origin,
            translation: getDeduplatedText(tdata.translation),
            // deeplTranslation: getDeduplatedText(deeplText.translation),
            googleApiTranslation: getDeduplatedText(googleApiText.translation),
            gptTranslation: getDeduplatedText(gptText.translation),
          });
        } catch (error) {
          console.log('push data error : ', error);
          console.log('tdata : ', tdata);
          console.log('googleApiText : ', googleApiText);
          console.log('gptText : ', gptText);
        }
      } catch (_err) {
        console.log('!err : ', _err);
      }
    }
    const iconv = require('iconv-lite');
    const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCsvWriter({
      header: [
        { id: 'origin', title: '번역전' },
        { id: 'translation', title: '구글키없이 번역' },
        { id: 'googleApiTranslation', title: '구글API로 번역' },
        // { id: 'deeplTranslation', title: 'DEEPL번역' },
        { id: 'gptTranslation', title: 'GPT번역' },
      ],
    });

    const csvHeader = csvStringifier.getHeaderString();
    const csvData = csvStringifier.stringifyRecords(translationData);
    const buffer = iconv.encode(csvHeader + csvData, 'euc-kr'); // euc-kr로 인코딩
    fs.writeFileSync(`./rakuten_sellian_${title}.csv`, buffer);
  });

  await Promise.all(promises);
}

async function t1() {
  const txt =
    '送料無料 ONE PIECE FILM RED ワルドコレクタブルフィギュア vol1 全5種セット モンキDルフィ サンジ トニトニチョッパ フランキ ウタ ワンピス フィルムレッド ワコレ グッズ ストラップ カプセル 誕プレ';
  console.log('1 : ', (await translation(getCleanedText(txt), 1)).translation);
  console.log('2 : ', (await translation(getCleanedText(txt), 4)).translation);
  console.log('3 : ', (await translation(getCleanedText(txt), 3)).translation);
}

main();
// t1();
