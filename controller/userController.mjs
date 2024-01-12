import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import {
  createOtp,
  getDecryptPassword,
  getEncryptedPassword,
} from "../helper/helper.mjs";
import { inviteMail, sendOtp, sentMail } from "../helper/mail.mjs";
import userMOdel from "../model/userModel.mjs";
import userGoogleSignInModel from "../model/userGoogleModel.mjs";

export const registerUser = async (req, res, next) => {
  try {
    console.log("registerUser",req.body)
    const { name, email, age, state, country, password } = req.body;
    const userData = {
      name: name,
      email: email,
      age: age,
      state: state,
      country: country,
      password: password,
    };
    const userEmailExist = await userMOdel.findOne({ email });
    if (userEmailExist) {
      console.log("This Email Already Exist", userEmailExist.email);
      return res.status(409).json("This Email Already Exist");
    } else {
      let user = await userMOdel(userData);
      user.password = getEncryptedPassword(password);
      const token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.REACT_APP_PRIVATE_KEY,
        // { expiresIn: "50m" }
      );
      user.token = token
      const savedUser = await user.save();

      inviteMail(user.name, user.email);
      console.log(
        "🚀 ~ file: userController.mjs:11 ~ registerUser ~ userData:",
        {
          id: savedUser.id,
          email: savedUser.email,
          token
        }
      );
      res.status(200).json({
        error: false,
        status: "successful",
        user: { user:savedUser, email: savedUser.email, token},
      });
    }
  } catch (error) {
    console.log("error", error.message);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    console.log("loginUser",req.body)
    const { email, password } = req.body;
    let user = await userMOdel.findOne({ email });
    if (!user) {
      return res.status(401)
      .json({ data: "ok", message: "Invalid Email or Password" });
    } else {
      const isMatch =
        password === getDecryptPassword(user.password) ? true : false;
      if (!isMatch) {
        console.log("Incorrect Password");
        res
          .status(401)
          .json({ data: "ok", message: "Invalid Email or Password" });
      } else {
        const token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.REACT_APP_PRIVATE_KEY,
          // { expiresIn: "50m" }
        );
        await userMOdel.updateOne(
          { email: user.email },
          { $set: { token: token } }
        );
        delete user.password
        res.status(200).json({ message: "SignIn Successful", token: token, user:user});
        console.log("SigIn Successful");
      }
    }
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next)=>{
  try{
    console.log("loginUser",req.body)
    const {email} = req.body;
    await userMOdel.findOneAndUpdate({email},
      {$set :{'token':null}})
      console.log("user loggedOut")
      res.json({error:true, message:"logOut successfully"})
  }
  catch(error){
    console.log("error logging out", error.message);
    next(error);
    }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userMOdel.findOne({ email });
    if (!user) {
      res.status(403).json({ message: "Email Not Found", data: "ok" });
    } else {
      const { hashedOTP, OTP } = await createOtp();
      console.log("hashedOTP", hashedOTP, "otttp", OTP);
      sendOtp(user.email, OTP, user.name);
      await userMOdel.findOneAndUpdate({ email }, { $set: { otp: hashedOTP } });
      console.log("updated otp");
      res.status(200).json({ message: "otp sent and updated", data: "ok" });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, new_password } = req.body;
    const user = await userMOdel.findOne({ email });
    if (!user) {
      console.log("Email Not Found");
      res.status(403).json({ message: "Email Not Found", data: "ok" });
    } else {
      const isMatch = await bcryptjs.compare(otp, user.otp);
      if (!isMatch) {
        console.log("Invalid OTP");
        res.status(500).json({ message: "invalid otp", data: "ok" });
      } else {
        const sameAsOld = new_password === getDecryptPassword(user.password);
        if (sameAsOld) {
          console.log("New password cannot be the same as old password.");
          res.status(500).json({
            message: "New password cannot be the same as old password.",
            data: "ok",
          });
        } else {
          const encrypted_password = getEncryptedPassword(new_password);
          const { hashedOTP, OTP } = await createOtp();
          const token = jwt.sign(
            { email: user.email, name: user.name },
            process.env.REACT_APP_PRIVATE_KEY,
            // { expiresIn: "50m" }
          );
          await userMOdel.findOneAndUpdate(
            { email },
            {
              $set: {
                otp: hashedOTP,
                password: encrypted_password,
                token: token,
              },
            }
          );
          console.log(
            "Validation Successful:-------------- OTP, password & token updated"
          );
          delete user.password
          res.status(200).json({
            message: "Validation Successful: OTP, password & token updated",
            token: token,
            user:user,
            data: "Ok",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export const googleSignUp = async (req, res, next) => {
  try {
    const request = req.body;
    // ! Set the redirection endpoint for Google to redirect back to after authentication
    request[
      "redirectionURL"
    ] = `${process.env.REACT_APP_Base_URL_FE}/${UserData.data.token}`;
    // ] = `${process.env.REACT_APP_Base_URL_BE}/user/googleRedirectionURL`;

    // ! Create an OAuth2Client instance with your Google OAuth2 credentials
    const oAuth2Client = new OAuth2Client(
      `${process.env.REACT_APP_OAuth2Client_CLIENT_ID}`,
      `${process.env.REACT_APP_OAuth2Client_CLIENT_SECRET}`,
      request.redirectionURL
    );
    //     //! Define the scopes (permissions) needed for accessing user email and profile information
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];
    //     //! Generate the authorization URL with the specified scopes and access type
    const authorizeUrl = await oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    //     //! Send the authorization URL as a response to the client for authentication
    res.send(authorizeUrl);
  } catch (error) {
    console.log("error in the googleSignUp", error.message);
  }
};

export const googleRedirectionURL = async (req, res, next) => {
  let request = req.query;
  //   //! Define payload data for making a POST request to Google's token endpoint
  let payLoadData = {
    url: "https://www.googleapis.com/oauth2/v4/token",
    data:
      "code=" +
      request.code +
      "&redirect_uri=" +
      `${process.env.REACT_APP_Base_URL_FE}` +
      // `${process.env.REACT_APP_Base_URL_BE}/user/googleRedirectionURL` +
      "&client_id=" +
      `${process.env.REACT_APP_OAuth2Client_CLIENT_ID}` +
      "&client_secret=" +
      `${process.env.REACT_APP_OAuth2Client_CLIENT_SECRET}` +
      "&scope=&grant_type=authorization_code",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  console.log("payyyyyyyyyyLOad",payLoadData)
  try {
    //     //! Send a POST request to Google's token endpoint to exchange the code for an access token
    let Response = await axios(payLoadData);
    //     //! Extract the token data from the response
    let tokenData = Response.data;
    //     //! Construct a URL to fetch the user's profile information using the access token
    request[
      `url`
    ] = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenData.access_token}`;
    //     //! Make a GET request to Google's user profile endpoint to retrieve the user's data
    let UserData = await axios.get(request.url);
    console.log("🚀 ~ file: userController.mjs:230 ~ googleRedirectionURL ~ UserData:", UserData)

    const token = jwt.sign(
      { email: UserData.data.email, name: UserData.data.name },
      process.env.REACT_APP_PRIVATE_KEY,
      { expiresIn: "30m" }
    );

    UserData.data["token"] = token;
    const user1 = await userGoogleSignInModel.findOne({
      email: UserData.data.email,
    });
    if (!user1) {
      //! Create new user model instance by passing the retrieved user details
      await userGoogleSignInModel.create(UserData.data.emailData.email);
      console.log("used created in database", { emailData: UserData.data });
    } else {
      //! Update existing user model instance by passing the retrieved user details
      await userGoogleSignInModel.updateOne(
        { email: UserData.data.email },
        { $set: { token: token } }
      );
    }
    console.log("user updated in database", { emailData: UserData.data.emailData.email });
    //     //! Send the user's profile data as a response to the client
    // res.redirect(`http://localhost:3000/${UserData.data.token}`);
    res.redirect(`${process.env.REACT_APP_Base_URL_FE}/${UserData.data.token}`);
  } catch (error) {
    console.log("Error In Getting Data In GoogleSignIn...", error.message);
    next(error);
  }
};

export const contactMail = async (req, res, next) => {
  try{
    const {userMail, userName, subject, mailContent} = req.body;
    
    const response = await sentMail(userMail,userName,subject,mailContent);
    res.status(200).json({error: false, message:`email sent successfully to ${userMail}`})
  }catch(error){
    console.log("error in contactMail function",error)
    next(error)
  }
}