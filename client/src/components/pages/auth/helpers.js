import cookie from "js-cookie"
import axios from "axios"

// set cookie 
export const setCookie = (key, value) => {
    if (window !== 'undefined') {
        cookie.set(key, value, {
            expires: 1
        })

    }
}

// remove from cookie 
export const removeCookie = (key) => {
    if (window !== 'undefined') {
        cookie.remove(key, {
            expires: 1
        })

    }
}

// get from cookie such as stored cookie 

// use token to send requests to server 
export const getCookie = (key) => {
    if (window !== 'undefined') {
        return cookie.get(key)
    }
}

// set local storage 

export const setLocalStorage = (key, value) => {
    if (window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))

    }
}

// remove from local storage 
export const removeLocalStorage = (key) => {
    if (window !== 'undefined') {
        localStorage.removeItem(key)

    }
}

// authenticate user by passing data to cookie and local storage 

export const authenticate = (response, next) => {
    console.log('AUTHENTICATE HELPER ON SINGIN RESPONSE', response)
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    axios.defaults.headers.common["x-auth-token"] = response.data.token
    next()

}


// access user from local storage 
export const isAuth = () => {
    if (window !== 'undefined') {
        const cookieChecked = getCookie('token')
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                console.log("No user in local storage")
                return false
            }
        }

    }
}

// logout 

export const signout = (next) => {
    removeCookie('token')
    removeLocalStorage("user")
    delete axios.defaults.headers.common["x-auth-token"]
    next()
}
