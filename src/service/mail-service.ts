// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { allService } from './all-service';

class MailService {
  // constructor() {
  //     this.transporter = nodemailer.createTransport({
  //         host: process.env.HOST_EMAIL,
  //         port: process.env.PORT_EMAIL,
  //         secure: false,
  //         auth: {
  //             user: process.env.USER_EMAIL,
  //             pass: process.env.PASSWORD_EMAIL
  //         },
  //         tls: {
  //             rejectUnauthorized: false,
  //         }
  //     })
  // }

  // constructor(); 
  // {
  //   this.transporter = nodemailer.createTransport({
  //     host: config?.HOST_EMAIL,
  //     port: config?.PORT_EMAIL,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: config?.USER_EMAIL,
  //       pass: config?.PASSWORD_EMAIL,
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });
  // }

  async sendChangePasswordUrlMail(email: string, link: string) {
    const transporter = nodemailer.createTransport({
      host: config?.HOST_EMAIL,
      port: config?.PORT_EMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config?.USER_EMAIL,
        pass: config?.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // await this.transporter.sendMail({
    await transporter.sendMail({
      from: config?.USER_EMAIL,
      to:[email],
      subject: 'Смена пароля на ' + config?.CLIENT_URL,
      text: '',
      html:
              `
    <div>
      <h1>Для смены пароля перейдите по ссылке</h1>
      <a href="${link}">${link}</a>
    </div>
    `,
    });
  }

  async sendChangePasswordMail(email: string, password: string) {
    const transporter = nodemailer.createTransport({
      host: config?.HOST_EMAIL,
      port: config?.PORT_EMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config?.USER_EMAIL,
        pass: config?.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // await this.transporter.sendMail({
    await transporter.sendMail({
      from: '"Сообщение портала АМП " config?.USER_EMAIL',
      to: [email],
      bcc: [config?.FEEDBACK_EMAIL],
      subject: 'Изменение пароля на портале АМП',
      text: '',
      html: `<div>
                <h1>Пароль на вход изменен</h1>
                <h3>Для входа в личный кабинет портала используйте:</h3>
                <ul>
                    <li>
                        email: ${email}
                    </li>
                    <li>
                        пароль: ${password}
                    </li>
                </ul>
            </div>
            `,
    });
  }

  async sendPasswordMail(email: string, password: string) {
    const transporter = nodemailer.createTransport({
      host: config?.HOST_EMAIL,
      port: config?.PORT_EMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config?.USER_EMAIL,
        pass: config?.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // await this.transporter.sendMail({
    await transporter.sendMail({
      from: '"Сообщение портала АМП " config?.USER_EMAIL',
      to: [email],
      bcc: [config?.FEEDBACK_EMAIL],
      subject: 'Регистрация на портале АМП',
      text: '',
      html: `<div>
                <h1>Вы зарегистрированы на портале АМП</h1>
                <h3>Для входа в личный кабинет портала используйте:</h3>
                <ul>
                    <li>
                        email: ${email}
                    </li>
                    <li>
                        пароль: ${password}
                    </li>
                </ul>
            </div>
            `,
    });
  }

  async sendZvkMail(username: string, org: string, email: string, msg: string, mailTheme: string, url: string, uploadFile: any[]) {
    const transporter = nodemailer.createTransport({
      host: config?.HOST_EMAIL,
      port: config?.PORT_EMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config?.USER_EMAIL,
        pass: config?.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const arrayAt = [];
    for (const key in uploadFile) {
      if (Object.hasOwnProperty.call(uploadFile, key)) {
        const element = uploadFile[key];
        arrayAt.push(element);
      }
    }
    console.log(arrayAt);
    // await this.transporter.sendMail({
    await transporter.sendMail({
      from: '"Сообщение портала АМП " config?.USER_EMAIL',
      to: [config?.FEEDBACK_EMAIL],
      subject: 'Заявка АПМ',
      text: '',
      attachments: arrayAt,
      html: `<div>
                <h1>${mailTheme}</h1>
                <ul>
                    <li>
                        Имя: ${username}
                    </li>
                    <li>
                        Организация: ${org}
                    </li>
                <li>
                Email: ${email}
            </li>
            <li>
            Сообщение: ${msg}
        </li>
        <li>${url}</li>
                </ul>
            </div>
            `,
    });
    for (const key in arrayAt) {
      if (Object.hasOwnProperty.call(arrayAt, key)) {
        const element = `./public/uploads/${config?.DESTINATION_SEND_ZVK}/${arrayAt[key]?.filename}`;
        allService.unlinkFile(element);
      }
    }
  }

  async sendFeedbackMail(username: string, org: string, email: string, tel: string, msg: string, mailTheme: string) {
    const transporter = nodemailer.createTransport({
      host: config?.HOST_EMAIL,
      port: config?.PORT_EMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config?.USER_EMAIL,
        pass: config?.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // await this.transporter.sendMail({
    await transporter.sendMail({
      from: '"Сообщение портала АМП " config?.USER_EMAIL',
      to: [config?.FEEDBACK_EMAIL],
      subject: 'Заявка АПМ',
      text: '',
      html: `<div>
                <h1>${mailTheme}</h1>
                <ul>
                    <li>
                        Имя: ${username}
                    </li>
                    <li>
                        Организация: ${org}
                    </li>
                    <li>
                    Телефон: ${tel}
                </li>
                <li>
                Email: ${email}
            </li>
            <li>
            Сообщение: ${msg}
        </li>
                </ul>
            </div>
            `,
    });
  }

  async sendZvkChat(email: string, msg: string, mailTheme: string) {
    const transporter = nodemailer.createTransport({
      host: config?.HOST_EMAIL,
      port: config?.PORT_EMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config?.USER_EMAIL,
        pass: config?.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // console.log("send zvk chat >>> ", username, org, email, msg, mailTheme)
    // await this.transporter.sendMail({
    await transporter.sendMail({
      from: '"Сообщение портала АМП " config?.USER_EMAIL',
      // to: [config?.FEEDBACK_EMAIL],
      to: [email],
      bcc: [config?.FEEDBACK_EMAIL],
      subject: 'У вас есть не прочитанные сообщения в личном кабинете',
      text: '',
      html: `<div>
                <h1>${mailTheme}</h1>
                <ul>
            <li>
            Сообщение: ${msg}
        </li>
        <li>
        <a href='https://amp.copartner.ru/profile/chat' >Перейти на портал АМП</a>
        </li>
                </ul>
            </div>
            `,
    });
  }
}
export const mailService = new MailService();
// module.exports = new MailService();
