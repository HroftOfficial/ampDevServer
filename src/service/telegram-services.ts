process.env.NTBA_FIX_319 = '1';
// eslint-disable-next-line import/no-extraneous-dependencies
import TelegramBot from 'node-telegram-bot-api';
import { Zakaz } from '../models/zakaz.model';
import { userModelAmp } from '../models/userAmp.model';
import { config } from '../config/config';
import { allService } from './all-service';

const bot = new TelegramBot(config?.TTOKEN, { polling: true });
const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

// eslint-disable-next-line @typescript-eslint/naming-convention
class TelegramServices {
  async prepareDataToTelegramChannel(id: string) {
    if (!id) {
      return null;
    }
    // const loc = navigator.language || 'ru-Ru';
    const loc = 'ru-Ru';
    const payOptions = { style: 'currency', currency: 'RUB' };
    const bigWc = [];
    const zakazInfo = await Zakaz.findById(id);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const inhere_user = zakazInfo?.inhere_user;
    if (!zakazInfo || !inhere_user) {
      return null;
    }
    // const { raiting, legend } = await userModelAmp.findById(zakazInfo?.inhere_user);
    const preData = await userModelAmp.findOne({ _id: inhere_user });
    const raiting = preData?.raiting;
    const legend = preData?.legend;
    if (!raiting) {
      return null;
    }
    /** raiting new */
    const noRaiting = config?.ALL_STARS_COUNT - raiting;
    const starsArray = Array(raiting).fill(config?.ZNAK);
    const starsArray2 = Array(noRaiting).fill(config?.ZNAK2);
    const resultStatsArray = [...starsArray, ...starsArray2];

    /**end raiting now */
    const grafLegend = resultStatsArray.join(' ');

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const work_category = castArray(zakazInfo?.work_category);
    /**получаем укрпненные твиды мехобработки */
    for (const key in work_category) {
      if (Object.hasOwnProperty.call(work_category, key)) {
        const element = work_category[key];
        const result = await allService.getBigWorkCategory(element);
        bigWc.push('#' + result?.[0]?.name_key);
      }
    }
    const unique = [...new Set(bigWc)].join(' ');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { title, cities, kl, kl_text, many, comment } = zakazInfo;

    const commentHtml = !!comment ? comment : '';

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const site_href = `${config?.CLIENT_URL}/telegram/${id}`;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    // const many_html = Number(many) === 0 ? 'Договорная' : many;
    const manyHtml =
      Number(many) === 0
        ? 'Договорная'
        : !!many
          ? new Intl.NumberFormat(loc, payOptions).format(many)
          : 'Договорная';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const kl_html = Number(kl) === 0 ? 'Неуказанно' : kl;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const html__text = `
        <a href="${site_href}">${title}</a>
        ${unique}
        <strong>Город: ${cities}</strong>
        <strong>Количество: ${kl_html} ${kl_text}</strong> 
        <strong>Бюджет: ${manyHtml} ${commentHtml}</strong> 
        <pre></pre>
        <strong>АМП рейтинг заказчика:</strong>
        <strong>             ${grafLegend}</strong>
        <strong>${legend}</strong>
        `;
    await bot.sendMessage(config?.CHATID, html__text, { parse_mode: 'HTML' });
  }
}
export const telegramServices = new TelegramServices();
