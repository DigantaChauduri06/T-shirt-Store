const nodemailer = require("nodemailer");

exports.mailHelper = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    // send mail with defined transport object
    const msg = {
        from: '"Fred Foo 👻" <digantachadhuri03@gmail.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
    }
    await transport.sendMail(
        msg
    );
}

