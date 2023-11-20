import mailer, { SendMailOptions } from "nodemailer"
import ejs from "ejs"
import path from "path"
import {
  SMTP_EMAIL,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SERVICE,
} from "../constants"
import { SendActivationCodeMailOptions } from "../../types/app"

const mailConfig = {
  service: SMTP_SERVICE,
  host: SMTP_HOST,
  port: SMTP_PORT, // || 587
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
}

export const mailTransporter = mailer.createTransport(mailConfig)

// mailTransporter.verify

export const sendEmail = async (options: SendActivationCodeMailOptions) => {
  const { emailAddress, subject, template, data } = options

  const templatePath = path.join(__dirname, "../mail", template)

  const html: string = await ejs.renderFile(templatePath, data)

  const logoPath = path.join(__dirname, "../../assets/timsan_logo.png")

  const mailOptions: SendMailOptions = {
    from: SMTP_EMAIL,
    to: emailAddress,
    subject,
    html,
    // attachments: [
    //   {
    //     filename: "timsan_logo.png",
    //     path: logoPath,
    //     // cid: "logo",
    //   },
    // ],
  }

  await mailTransporter.sendMail(mailOptions)
}
