import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import {
  createOtp,
  getDecryptPassword,
  getEncryptedPassword,
} from "../helper/helper.mjs";
import { inviteMail, sendOtp } from "../helper/mail.mjs";
import userMOdel from "../model/userModel.mjs";
import userGoogleSignInModel from "../model/userGoogleModel.mjs";

export const registerUser = async (req, res, next) => {
  const { name, email, age, state, country, password } = req.body;
  const userData = {
    name: name,
    email: email,
    age: age,
    state: state,
    country: country,
    password: password,
  };
  try {
    const userEmailExist = await userMOdel.findOne({ email });
    if (userEmailExist) {
      console.log("This Email Already Exist");
      return res.status(409).json("This Email Already Exist");
    } else {
      let user = await userMOdel(userData);
      user.password = getEncryptedPassword(password);
      const savedUser = await user.save();

      inviteMail(user.name, user.email);
      res.status(200).json({
        error: false,
        status: "successful",
        data: { id: savedUser.id, email: savedUser.email },
      });
      console.log(
        "🚀 ~ file: userController.mjs:11 ~ registerUser ~ userData:",
        {
          id: savedUser.id,
          email: savedUser.email,
        }
      );
    }
  } catch (error) {
    console.log("error", error.message);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userMOdel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "Access Denied" });
    } else {
      const isMatch =
        password === getDecryptPassword(user.password) ? true : false;
      if (!isMatch) {
        console.log("Incorrect Password");
        res.status(402).json({ data: "ok", message: "Invalid Email or Password" });
      } else {
        const token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.REACT_APP_PRIVATE_KEY,
          { expiresIn: "10s" }
        );
        res.status(200).json({ message: "SignIn Successful", token: token });
        console.log("SigIn Successful");
      }
    }
  } catch (err) {
    next(err);
  }
};

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
        console.log(
          "🚀 ~ file: userController.mjs:115 ~ verifyOtp ~ newPassword:",
          sameAsOld
        );
        if (sameAsOld) {
          console.log("New password cannot be the same as old password.");
          res
            .status(500)
            .json({
              message: "New password cannot be the same as old password.",
              data: "ok",
            });
        } else {
          const encrypted_password = getEncryptedPassword(new_password);
          const { hashedOTP, OTP } = await createOtp();
          await userMOdel.findOneAndUpdate(
            { email },
            { $set: { otp: hashedOTP, password: encrypted_password } }
          );
          console.log(
            "Validation Successful-------------- OTP & Password updated"
          );
          res
            .status(200)
            .json({
              message: "Validation Successful, OTP & Password updated",
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
    ] = `http://localhost:${process.env.REACT_APP_PORT}/v1/user/googleRedirectionURL`;
    // request["redirectionURL"] = `http://localhost:3000/dash`;

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
  console.log(
    "🚀 ~ file: userController.mjs:64 ~ googleRedirectionURL ~ request:",
    request
  );
  //   //! Define payload data for making a POST request to Google's token endpoint
  let payLoadData = {
    url: "https://www.googleapis.com/oauth2/v4/token",
    data:
      "code=" +
      request.code +
      "&redirect_uri=" +
      `http://localhost:${process.env.REACT_APP_PORT}/v1/user/googleRedirectionURL` +
      // `http://localhost:3000/dash` +
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

    UserData.data["token"] = tokenData.access_token;
    const user1 = await userGoogleSignInModel.findOne({
      email: UserData.data.email,
    });
    console.log(
      "🚀 ~ file: userController.mjs:105 ~ googleRedirectionURL ~ user1:",
      user1
    );

    if (!user1) {
      //! Create new user model instance by passing the retrieved user details
      await userGoogleSignInModel.create(UserData.data);
      console.log("used created in database");
    } else {
      //! Update existing user model instance by passing the retrieved user details
      await userGoogleSignInModel.updateOne(
        { email: UserData.data.email },
        { $set: { token: UserData.data.token } }
      );
      console.log("user updated in database");
    }
    console.log({ emailData: UserData.data });
    res.redirect("http://localhost:3000/dash");
    //     //! Send the user's profile data as a response to the client
  } catch (error) {
    console.log("Error In Getting Data In GoogleSignIn...", error.message);
    next(error);
  }
};
