const nodemailer = require('nodemailer');

async function sendMail ({from, to, subject, text, html}) {

    let transpoter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        PORT: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    let info = await transpoter.sendMail({

        from: from, 
        to: to,
        subject: subject,
        text: text,
        html: html,

    })
}

module.exports = sendMail;