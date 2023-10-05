import userMOdel from "../model/userModel.mjs";

export const registerUser = async (req, res, next) => {
  const { name, email, age, state,country, password} = req.body;
  const userData = {
    name: name,
    email: email,
    age: age,
    state: state,
    country: country,
    password: password,
  };
  try{
      const user = await userMOdel(userData);
      const savedUser = await user.save();
      res.status(200).json({error:false, status:"successful", data:{id:savedUser.id,email:savedUser.email}})
      console.log("🚀 ~ file: userController.mjs:11 ~ registerUser ~ userData:", {id:savedUser.id,email:savedUser.email})
    }
    catch(error){
        console.log("error", error.message)
        next(error)
    }
  }