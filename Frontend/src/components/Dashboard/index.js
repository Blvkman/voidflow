import React from 'react'
import { Redirect } from 'react-router-dom'

const Dashboard = (props) => {

    if(props.loggedInStatus === "NOT_LOGGED_IN"){
        console.log( props.loggedInStatus + props.loggedInStatus === "NOT_LOGGED_IN")
        return  <Redirect  to="/signin" />
    }
    return (
        <>
            <h1>Status: {props.loggedInStatus}</h1>
            <h2>accessToken: {window.localStorage.accessToken}</h2>
            
            <h2>refreshToken: {window.localStorage.refreshToken}</h2>
        </>
    )
}

export default Dashboard
