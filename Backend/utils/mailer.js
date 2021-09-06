const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'voidflowit@gmail.com',
        pass: process.env.MAIL_PASS
    }
})

function sendMail(mail, subject, html){
    var mailOptions = {
        from: ` "VoidFlow" <voidflowit@gmail.com> `,
        to: mail,
        subject: subject,
        html: html
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) return err
        else{
            return true
        }
    })
}

module.exports = {
    sendMail
}