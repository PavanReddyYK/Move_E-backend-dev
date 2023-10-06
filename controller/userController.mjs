import { OAuth2Client } from "google-auth-library";
import userMOdel from "../model/userModel.mjs";
import axios from "axios";

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
    const user = await userMOdel(userData);
    const savedUser = await user.save();
    res.status(200).json({
      error: false,
      status: "successful",
      data: { id: savedUser.id, email: savedUser.email },
    });
    console.log("🚀 ~ file: userController.mjs:11 ~ registerUser ~ userData:", {
      id: savedUser.id,
      email: savedUser.email,
    });
  } catch (error) {
    console.log("error", error.message);
    next(error);
  }
};

export const googleSignUp = async (req, res, next) => {
  try {
    const request = req.body;
    // ! Set the redirection endpoint for Google to redirect back to after authentication
    request["redirectionURL"] = `http://localhost:${process.env.REACT_APP_PORT}/v1/user/googleRedirectionURL`;
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
  console.log("🚀 ~ file: userController.mjs:64 ~ googleRedirectionURL ~ request:", request)
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
    console.log({ emailData: UserData.data });

    res.redirect('http://localhost:3000/dash')
    //     //! Send the user's profile data as a response to the client
    // res.send(UserData.data);
  } catch (error) {
    console.log("Error In Getting Data In GoogleSignIn...", error.message);
    next(error)
  }
};
