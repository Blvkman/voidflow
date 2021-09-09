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
    LinkText } from './SigninElements';


export default class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flag : 0, 
            error : '',
            mail: '',
            password: '',
        };
      }

    async endSubmit () {
        try{
            if(this.state.password !== "" && this.state.mail !== ""){
                const hashedPassword = await crypto.createHash('sha512').update(this.state.password).digest('hex');
                
                axios.post(`${apiUrl}/login`, {
                    mail: this.state.mail,
                    password: hashedPassword
                })
                .then((response) => {

                    if(response.status === 200){
                        this.setState({error : ''});
                        this.props.successfulLogin(response.data);
                        this.props.history.push("/Dashboard")
                    }
                }, (error) => {
                    if(error.response !== undefined){
                        if(error.response.status === 403){
                            //Credenziali non valide "Alert"
                            this.setState({flag : 1, error : "Credenziali non valide."})
                            console.log("Credenziali non valide.")
                        } else if (error.response.status === 404){
                            //La mail non è registrata, Registrati prima "Alert"
                            this.setState({flag:1, error:"La mail non è registrata, registrati prima."})
                            console.log("La mail non è registrata, registrati prima.")
                        } else if (error.response.status === 301){
                            //La mail non è registrata, Registrati prima "Alert"
                            this.setState({flag:1, error:"Conferma l'email prima di accedere."})
                            console.log("Conferma l'email prima di accedere.")
                        }
                    }
                });
            }else{
                //Compila i campi "Alert"
                this.setState({flag:1, error:"Inserisci i dati richiesti."})
                console.log("Inserisci i dati richiesti.")
            }
        } catch (err) {
            console.log(err)
        }
    }

    render(){

        return (
            <>
                <Container>
                    <FormWrap>
                        <Icon to="/">VoidFlow</Icon>
                        <FormContent>
                            <Form action="#">
                                <FormH1 id='start-login'>Sign in to your account</FormH1>
                                <FormLabel htmlFor='for'>Email</FormLabel>
                                <FormInput type='email' placeholder='example@void.it' onChange={e=>this.setState({ mail: e.target.value })} required/>
                                <FormLabel htmlFor='for'>Password</FormLabel>
                                <FormInput type='password' placeholder='********' onChange={e=>this.setState({ password: e.target.value })} required/>
                                <FormButton type='button' onClick={() => this.endSubmit()}>Continue</FormButton>
                                <LinkText to='/reset'>Forgot Password</LinkText>
                                <Text>{this.state.error}</Text>
                            </Form>
                        </FormContent>
                    </FormWrap>
                </Container>
            </>
        )
    }
}
