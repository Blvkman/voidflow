import React from 'react'
import SignIn from '../components/Signin'
import ScrollToTop from '../components/Signin/ScrollToTop'

const SigninPage = (props) => {
    return (
        <>
            <ScrollToTop />
            <SignIn {...props} />
        </>
    )
}

export default SigninPage
