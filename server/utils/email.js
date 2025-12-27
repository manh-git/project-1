import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendEmail = async(options)=>{
    const mailOptions ={
        from: `REVIEW_VOCABULARY<${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,

    }
    await transporter.sendMail(mailOptions);
}
export default sendEmail;