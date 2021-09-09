import React, {Component} from 'react';
import axios from 'axios';
import crypto from 'crypto';
import {apiUrl} from '../../variables';

import { Container,
    Text,
    Icon,
    Form, 
    FormContent, 
    FormH1, FormWrap, 
    FormButton, 
    FormInput, 
    FormLabel,
    LinkText } from './ResetElements';


export default class Reset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flag : 0, 
            error : '',
            mail: '',
            password: '',
            confirmPassword: '',
            control: false,
            loaded: false
        };
      }

    //Recupero Password
    async endSubmit () {
        try{
            if(this.state.mail !== ""){
                
                axios.post(`${apiUrl}/reset`, {
                    mail: this.state.mail
                })
                .then((response) => {

                    if(response.status === 201){
                        this.setState({error : 'Ti abbiamo inviato una mail per il reset.'});
                    }
                }, (error) => {
                    console.log(error.response)
                    if(error.response !== undefined){
                        if(error.response.status === 500){
                            //Qualcosa è andato storto "Alert"
                            this.setState({flag : 1, error : "Qualcosa è andato storto."})
                        } else if (error.response.status === 404){
                            //La mail non è registrata, Registrati prima "Alert"
                            this.setState({flag:1, error:"Questa mail non è registrata."})
                        } else if (error.response.status === 400){
                            //La mail non è verificata, Registrati prima "Alert"
                            this.setState({flag:1, error:"Verifica la tua mail prima."})
                        } else if (error.response.status === 403){
                            //La mail non è verificata, Registrati prima "Alert"
                            this.setState({flag:1, error:"Ti abbiamo già inviato una mail di reset."})
                        }
                    }
                });
            }else{
                //Inserisci la mail "Alert"
                this.setState({flag:1, error:"Inserisci la tua mail."})
            }
        } catch (err) {
            console.log(err)
        }
    }

    //Reset Password
    async resetPassword (resetToken) {
        const passRe = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
        
        try{
            if(!passRe.test(this.state.password)){
                this.setState({flag:1, error:"Password has to have: One upper case letter, One lower case letter, at least One number, at least One special character, minimum 8 in Length."})
            } else {
                if(this.state.password === this.state.confirmPassword){
                    const hashedPassword = await crypto.createHash('sha512').update(this.state.password).digest('hex');
                    console.log(hashedPassword)
                    axios.post(`${apiUrl}/resetFinal?resetToken=${resetToken}`, {
                        newPassword: hashedPassword
                    })
                    .then((response) => {

                        if(response.status === 200){
                            this.setState({error : 'Reset effettuato con Successo.'});
                        }
                    }, (error) => {
                        if(error.response !== undefined){
                            if(error.response.status === 500){
                                this.setState({flag : 1, error : "Qualcosa è andato storto."})
                                console.log("Qualcosa è andato storto.")
                            } else if (error.response.status === 400){
                                this.setState({flag:1, error:"Questa mail non è registrata."})
                                console.log("Questa mail non è registrata.")
                            }
                        }
                    });
                }else{
                    //Le password non coincidono "Alert"
                    this.setState({flag:1, error:"Le password non coincidono."})
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    //Verifica del Token nell'url
    componentDidMount(){
        let resetToken = (new URLSearchParams(window.location.search)).get("resetToken")
        axios.post(`${apiUrl}/verifyResetToken?resetToken=${resetToken}`)
        .then((response) => {

            if(response.status === 200){
                this.setState({control: true});
                this.setState({loaded: true});
            }
        }, (error) => {
            this.setState({control: false});
            this.setState({loaded: true});
            
        });
    }

    render(){
        if(this.state.loaded){
            let resetToken = (new URLSearchParams(window.location.search)).get("resetToken")

            if(this.state.control){
                return (
                    <>
                        <Container>
                            <FormWrap>
                                <Icon to="/">VoidFlow</Icon>
                                <FormContent>
                                    <Form action="#">
                                        <FormH1 id='start-login'>New Password</FormH1>
                                        <FormLabel htmlFor='for'>Password</FormLabel>
                                        <FormInput type='password' placeholder='********' onChange={e=>this.setState({ password: e.target.value })} required/>
                                        <FormLabel htmlFor='for'>Confirm Password</FormLabel>
                                        <FormInput type='password' placeholder='********' onChange={e=>this.setState({ confirmPassword: e.target.value })} required/>
                                        <FormButton type='button' onClick={() => this.resetPassword(resetToken)}>Reset</FormButton>
                                        <LinkText to="/signin">Log In</LinkText>
                                        <Text>{this.state.error}</Text>
                                    </Form>
                                </FormContent>
                            </FormWrap>
                        </Container>
                    </>
                )
            } else {
                return (
                    <>
                        <Container>
                            <FormWrap>
                                <Icon to="/">VoidFlow</Icon>
                                <FormContent>
                                    <Form action="#">
                                        <FormH1 id='start-login'>Reset Password</FormH1>
                                        <FormLabel htmlFor='for'>Email</FormLabel>
                                        <FormInput type='email' placeholder='example@void.it' onChange={e=>this.setState({ mail: e.target.value })} required/>
                                        <FormButton type='button' onClick={() => this.endSubmit()}>Reset</FormButton>
                                        <LinkText to="/signin">Log In</LinkText>
                                        <Text>{this.state.error}</Text>
                                    </Form>
                                </FormContent>
                            </FormWrap>
                        </Container>
                    </>
                )
            }
        } else {
            return (
                <></>
            )
        }
    }
}
