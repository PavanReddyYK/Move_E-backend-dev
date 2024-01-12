import nodemailer from "nodemailer";

const org_mail = process.env.REACT_APP_EMAIL_ID;
const app_name = process.env.REACT_APP_NAME;
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: org_mail,
    pass: process.env.REACT_APP_EMAIL_Mail_APP_PASSWORD,
  },
});

export const inviteMail = (name, email) => {
  const mailOptions = {
    to: email,
    from: org_mail,
    subject: `Thank You for Registering with ${app_name}`,
    html: `<h3>Hello ${name},</h3><br/>
               <p style="font-size:20px;">Thank you for registering with us.</p>
               <p>We look forward to providing all the necessary facilities so that we can connect for a better future.</p>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("inviteMail error: " + err);
    } else {
      console.log(`Invite mail sent to ${name} (${email})`);
    }
  });
};

export const sendOtp = async (email, otp, name) => {
  let mailOptions = {
    from: org_mail,
    to: email,
    subject: "OTP Mail",
    html: `<h5>Hi ${name}, Your OTP for ${app_name} Application is ${otp}</h5>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("sendOTP error: " + err);
    } else {
      console.log(`OTP mail sent to ${name} (${email})`,info);
    }
  });
};

export const sentMail = async (toMail, userName, subject, content)=>{
  let mailOption ={
    from: org_mail,
    to: toMail,
    subject:`${subject } mail sent to MoveE Application`,
    html: `<h3>Hi ${userName},</h3><br><h4>the message you dropped in our application is <br><i>"${content}"</i></h4> 
          <br><h4>Thank you for Contacting with ReddyMoveE Application, we will get back to you shortly</h4>
          <br><h4>Regards</h4><h4>Pavan Reddy Y K</h4>`
  }
  transporter.sendMail(mailOption, (err, info)=>{
    if(err){
      console.log("sentMAil error", err);
    }else{
      console.log(`error sending mail to ${toMail}`,info)
    }
  })
}