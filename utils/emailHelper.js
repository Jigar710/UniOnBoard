const nodemailer = require("nodemailer");

const mailHelper = async (option) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        // secure:false,
        // ignoreTLS:true,
        auth: {
            user: "smitghelani.bodhlabs@gmail.com",
            pass: "BoDhLaBs#4321"
        }
    });

    const message = {
        from: 'noreply@gmail.com', // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to UniOnBoard - The College Guide.</h2>
            
            <a href=${option.url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${option.txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${option.url}</div>
            </div>`
    }

    // send mail with defined transport object
    await transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const mailHelperFaculty = async (option) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        // secure:false,
        // ignoreTLS:true,
        auth: {
            user: "smitghelani.bodhlabs@gmail.com",
            pass: "BoDhLaBs#4321"
        }
    });

    const message = {
        from: 'noreply@gmail.com', // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to UniOnBoard - The College Guide.</h2>
            
        
            <div>${option.txt}</div>
            <div><h3>Thank You</h3></div>
            </div>`
    }

    // send mail with defined transport object
    await transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


module.exports.mailHelper = mailHelper;
module.exports.mailHelperFaculty = mailHelperFaculty;
