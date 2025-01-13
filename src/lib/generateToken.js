import jwt from 'jsonwebtoken'

//function for generate token
export const generateToken = (userId , response) => {

    const token = jwt.sign({id : userId} , process.env.SECRET_KEY , {expiresIn : "1d"})

    response.cookie("token" , token , {
        maxAge : 1 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "strict",
        secure : true
    })

}