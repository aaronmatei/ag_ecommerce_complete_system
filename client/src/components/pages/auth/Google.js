import React from 'react'
import axios from 'axios'
import GoogleLogin from "react-google-login"


function Google({ informParent = f => f }) {
    const responseGoogle = (response) => {
        console.log(response.tokenId)
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/users/google_login`,
            data: { idToken: response.tokenId }
        })
            .then(res => {
                console.log("GOOGLE SIGNIN SUCCESS", res)
                //inform parent component
                informParent(res)
            })
            .catch(err => {
                console.log("GOOGLE SIGN IN ERROR", err.response)
            })
    }
    return (
        <div className="">
            <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="btn btn-danger btn-sm">
                        <i className="fab fa-google pr-2"></i>
                        Login with Google
                    </button>
                )}
                cookiePolicy={'single_host_origin'}

            />

        </div>
    )
}

export default Google
