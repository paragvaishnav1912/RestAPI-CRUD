import mailer from 'nodemailer'
import dotenv from 'dotenv'

const user = `${process.env.AUTH_EMAIL}`;
const password = `${process.env.AUTH_PASSWORD}`;

class mailForConfirmation{
     transport = mailer.createTransport({
        service:"Gmail",
        auth:{
            user:user,
            pass:password
        },
    });

    sendConfirmationEmail = (userName:string,emailId:string,emailToken:string)=>{
        console.log('works');
        this.transport.sendMail({
            from:user,
            to:emailId,
            subject:"Please verify your Email Id",
            html:`<h1>Email Confirmation</h1>
                <h2>hello ${userName} </h2>
                <p>click on the link to verify your Account</p>
                <a href="http://localhost:8080/app/confirm/${emailToken}">Click Here</a>
            `
        }).catch(err => console.log(err));
    }
}


export default new mailForConfirmation();