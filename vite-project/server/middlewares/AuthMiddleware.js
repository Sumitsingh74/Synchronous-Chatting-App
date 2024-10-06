import jwt from "jsonwebtoken"

export const verifyToken=(request,response,next)=>{

    console.log(request.cookies);
    const token =request.cookies.jwt;
    
    if(!token){
        return response.status(401).send("You are not authorized");
    }

    jwt.verify(token,poocess.env.JWT_KEY,async(err,payload)=>{
        if(err)request.status(403).send("Token is not valid!");

        request.userId=payload.userId;
        next();
    });
}