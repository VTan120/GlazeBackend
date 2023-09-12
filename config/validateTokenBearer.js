const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");

const validateTokenBearer = asyncHandler(async (req, res, next) => {
    console.log("Started Validation");
    var token;
    let  authHead = req.headers.Authorization || req.headers.authorization;
    
    if(authHead && authHead.startsWith("Bearer")){
        token = authHead.split(" ")[1];
        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                console.log(err);
                res.status(500);
                throw new Error("Authentication Failed");
            }
            
            req.user = decoded.user;
            console.log(req.user);
            next();
        });
    }
    if(!token){
        res.status(401);
        throw new Error("User Not Authorized or Token Missing");
    }

});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        res.status(401);
        throw new Error("User Not Authorised To Access Data");
      }
  
      next();
    };
  };

const adminAuthorize = (req, res, next) => {

      if (!["admin","super_admin"].includes(req.user.role)) {
        res.status(401);
        throw new Error("User Not Authorised To Access Data");
      }
  
      next();
  }

const authorization = asyncHandler( async (req, res, next) => {
  console.log(req.headers.cookie);
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if(err){
          console.log(err);
          res.status(500);
          throw new Error("Authentication Failed");
        }

      
      req.user = decoded.user;
      console.log(req.user);
      next();
    });
  } catch {
    return res.sendStatus(401);
  }
}
);



module.exports = {validateTokenBearer, authorizeRoles, adminAuthorize, authorization};