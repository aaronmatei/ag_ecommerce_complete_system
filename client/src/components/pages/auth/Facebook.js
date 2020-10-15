import React from 'react'
import axios from 'axios'
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"

function Facebook({ informParent = f => f }) {
    const responseFacebook = (response) => {
        console.log(response)
        const { userID, accessToken } = response
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/users/facebook_login`,
            data: { userID, accessToken }
        })
            .then(res => {
                console.log("FACEBOOK SIGNIN SUCCESS", res)
                //inform parent component
                informParent(res)
            })
            .catch(err => {
                console.log("FACEBOOK SIGN IN ERROR", err.response)
            })
    }
    return (
        <div className="">
            <FacebookLogin
                appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
                autoLoad={false}
                callback={responseFacebook}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="btn btn-primary btn-sm">
                        <i className="fab fa-facebook pr-2"></i>
                        Continue with facebook
                    </button>
                )}


            />

        </div>
    )
}

export default Facebook
