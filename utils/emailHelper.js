const nodemailer = require("nodemailer");

const mailHelper = async (option) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "smitghelani.bodhlabs@gmail.com",
            pass: "bodhlabs@123"
        }
    });

    const message = {
        from: 'smitghelani.bodhlabs@gmail.com', // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        text: option.message, // plain text body
        html: `<h3>${option.message}</h3>`
    }

    // send mail with defined transport object
    await transporter.sendMail(message);

};


module.exports = mailHelper;