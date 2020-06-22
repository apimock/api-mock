const nodemailer = require('nodemailer')
const config = require('config')
const mail = config.get('mail')

export default class MailService {
  static async sendMail (options) {
    const transporter = nodemailer.createTransport(mail)

    return new Promise((resolve, reject) => {
      transporter.verify(function (error) {
        if (error) {
          reject(error)
        } else {
          transporter.sendMail(options, function (error, info) {
            if (error) {
              reject(error)
            } else {
              resolve(info.response)
            }
          })
        }
      })
    })
  }

  static send (to, subject, html) {
    const transporter = nodemailer.createTransport(mail)
    const options = {
      from: `"ApiMock" <${mail.from}>`,
      to,
      subject,
      html
    }
    return new Promise((resolve, reject) => {
      transporter.verify(function (error) {
        if (error) {
          reject(error)
        } else {
          transporter.sendMail(options, function (error, info) {
            if (error) {
              reject(error)
            } else {
              resolve(info.response)
            }
          })
        }
      })
    })
  }
}
