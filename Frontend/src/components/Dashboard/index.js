import React, {Component} from 'react'
import {apiUrl} from '../../variables';
import axios from 'axios';

export default class Dashboard extends Component{
    
    render(){
        let token = window.localStorage.getItem('voidFlowAccessToken');

        axios.get(`${apiUrl}/check`, {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((response) => {

            if(response.status === 200 && response.data.status){
                console.log(response)
            }
        }, (error) => {
            return window.location.href = 'http://localhost:5000/signin';
        });

        return (
            <>
                <h1>Status: {this.props.loggedInStatus}</h1>
                <h2>accessToken: {window.localStorage.getItem('voidFlowAccessToken')}</h2>
                
                <h2>refreshToken: {window.localStorage.getItem('voidFlowRefreshToken')}</h2>
            </>
        )
    }
}
