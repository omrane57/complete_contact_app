const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes")
require('dotenv').config()
function checkJwtHS256(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside checkJWTHS256`);
  
    const secretKey = process.env.AUTH_CLIENT_SECRET;
 
  let token=req?.headers[process.env.AUTH_CLIENT_NAME]
   console.log 
  if(!token){
     token=req.cookies[process.env.AUTH_CLIENT_NAME]
  }
   const payload= jwt.verify(token,secretKey);
   return payload
    
  } catch (error) {
    throw error
  }
 
}
function tokencreation(payload){
  const token=jwt.sign(JSON.stringify(payload),process.env.AUTH_CLIENT_SECRET)
  return token

}
function isAdmin(settingsConfig, req, res, next){
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsAdmin`);
    const payload=checkJwtHS256(settingsConfig, req, res, next)
    if(!payload.isAdmin){
      throw new Error("You are Not Admin")
    }
    next()
  } catch (error) {
    return res.status(500).json(error.message)
  }
 
}
function isUser(settingsConfig, req, res, next){
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsUser`);
    const payload=checkJwtHS256(settingsConfig, req, res, next)
    if(payload.isAdmin){
      throw new Error("You are Not User")
    }
    next()
  } catch (error) {
    return res.status(500).json(error)
  }
 
}
module.exports = {
  checkJwtHS256,
  isAdmin,
  isUser,
  tokencreation
};
// const jsonwebtoken = require("jsonwebtoken");
// const { StatusCodes } = require("http-status-codes");

// require('dotenv').config()
// function checkJwtHS256(settingsConfig, req, res, next) {
//  try {
//   const logger = settingsConfig.logger;
//   logger.info(`[AUTH_SERVICE] : Inside checkJWTHS256`);

//   const secretKey = process.env.AUTH_CLIENT_SECRET;
//   // const token = req?.headers["authorization"]?.replace("Bearer ", "");
//   // if(!token){
//    const token = req.cookies[process.env.AUTH_CLIENT_NAME]
//   // }
// return jwt.verify(token,secretKey)
//  } catch (error) {
//   return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Invalid token" });
//  }
// }
 
// function isAdmin(settingsConfig, req, res, next){
//   try {
//    console.log("Inside IsAdmin") 
//   const logger = settingsConfig.logger;
//   logger.info(`[AUTH_SERVICE] : Inside isAdmin`);
//     const payload=checkJwtHS256(settingsConfig, req, res, next)
  
//     if(!payload.isAdmin){
//       throw new Error("you are not admin")
//     }
//     next()
//   } catch (error) {
//     return res.status(StatusCodes.UNAUTHORIZED).json(error.message);
//   }
// }
// function isUser(settingsConfig, req, res, next){
//   try {
//     const logger = settingsConfig.logger;
//     logger.info(`[AUTH_SERVICE] : Inside isAdmin`);
//     const payload=checkJwtHS256(settingsConfig, req, res, next)
  
//     if(payload.isAdmin){
//       throw new Error("you are not user")
//     }
//     next()
//   } catch (error) {
//     return res.status(StatusCodes.UNAUTHORIZED).json(error.message);
//   }
// }
// function tokencreation(payload){
//     const token=jwt.sign(JSON.stringify(payload),process.env.AUTH_CLIENT_SECRET)
//     return token
  
//   }
// module.exports = {
//   checkJwtHS256,
//   isAdmin,
//   isUser,
//   tokencreation
// };