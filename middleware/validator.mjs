import jwt from "jsonwebtoken";
import userMOdel from "../model/userModel.mjs";

export const validate = async (req, res, next) => {
  const token = req.header("Authorization");
  const request = req.body;

  const payload = jwt.verify(token, process.env.REACT_APP_PRIVATE_KEY);
  if(!payload){
    console.log("Token is not valid:      expired!!!")
    return res.status(401).send({msg:"Token is not valid"})
  }
  else{
    const email = payload.email;

    const user = await userMOdel.findOne({ email });
    if (!user) {
      console.log("User not found");
      res.status(401).send("User not found");
    } else {
      if (!token === user.token) {
        console.log("Token is not valid");
        return res.status(403).send("Token is not valid");
      } else {
          console.log('validated');
          console.log("email!!!", payload.email)
          request["email"] = payload.email
          next()
      }
    }
  }
};
