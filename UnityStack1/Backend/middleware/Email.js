const { transporter } = require("./Email.config");

const SendVerificationCode = async (email, verificationCode) =>{
    try{
        const response = await transporter.sendMail({
            from: '"UnityStack" <info.freshrose@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your account ", // Subject line
            text: "Verification OTP ", // plain text body
            html: verificationCode, // html body
          });
          console.log('Email send successfully',response);
    }catch(error){
           console.log('Email error')
    }
}
module.exports = {
    SendVerificationCode,
  };