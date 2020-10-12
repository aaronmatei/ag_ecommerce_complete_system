import jwt from "jsonwebtoken"
import config from "config"
import cookie from "js-cookie"

const jwtSecret = config.get("jwtSecret")

const auth = (req, res, next) => {
    // const token = req.header("x-auth-token")
    const token = req.token
    // check token 
    if (!token) {
        return res
            .status(403)
            .json({
                message: "Authorization denied, please login"
            })
    }
    try {
        // verify the token 
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded

        if (req.user.isRestricted) {
            return res
                .status(401)
                .json({
                    message: "Sorry. This page is Restricted"
                })

        } else {
            next()
        }

    } catch (error) {
        res.status(400).json({
            message: "Session expired. Please login"
        })

    }

}


const isAdmin = (req, res, next) => {
    const { isAdmin } = req.user
    if (!isAdmin) {
        res
            .status(401)
            .json({
                message: "Authorization denied. This page is for admin"
            })
    } else {
        next()
    }
}

module.exports = { auth, isAdmin }