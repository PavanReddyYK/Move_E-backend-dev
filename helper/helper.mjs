import crypto from "crypto";
import bcryptjs from "bcryptjs";
export const getEncryptedPassword = (password) => {
  try {
    const encrypted_key = crypto.createCipher(
      "aes-128-cbc",
      process.env.REACT_APP_PRIVATE_KEY
    );
    let encrypted_password = encrypted_key.update(password, "utf8", "hex");
    encrypted_password += encrypted_key.final("hex");
    return encrypted_password;
  } catch (err) {
    console.log("error in encryption", err);
  }
};

export const getDecryptPassword = (password) => {
  try {
    let decrypted_key = crypto.createDecipher(
      "aes-128-cbc",
      process.env.REACT_APP_PRIVATE_KEY
    );
    let decrypted_password = decrypted_key.update(password, "hex", "utf8");
    decrypted_password += decrypted_key.final("utf8");
    return decrypted_password;
  } catch (err) {
    console.log("error in decrypting password", err);
  }
};


export const createOtp = async () => {
  try{
      let OTP = Math.floor(Math.random() * 899999 + 100000).toString();
      console.log("🚀 ~ file: helper.mjs:35 ~ createOtp ~ otp:", OTP)
      let salt = await bcryptjs.genSalt(10);
      let hashedOTP = await bcryptjs.hash(OTP, salt);
      return {hashedOTP,OTP};
  }
  catch(err) {
      console.log("error in generating otp", err);
  }
};