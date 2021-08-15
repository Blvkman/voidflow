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
    FormLabel } from './SigninElements';


export default class SignIn extends Component {
    
    render(){

        //const [mail, setMail] = useState(null);
        //const [password, setPassword] = useState(null);
        let mail="", password="";

        const endSubmit = async () => {
            try{
                if(password !== "" && mail!==""){
                    const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');;
                    axios.post(`${apiUrl}/login`, {
                        mail: mail,
                        password: hashedPassword
                    })
                    .then((response) => {
                        if(response.status === 200){
                            window.localStorage.setItem("accessToken", response.data.accessToken);
                            window.localStorage.setItem("refreshToken", response.data.refreshToken);
                        }
                    }, (error) => {
                        if(error.response.status === 403){
                            //Credenziali non valide "Alert"
                            console.log("Credenziali non valide")
                        } else if (error.response.status === 404){
                            //La mail non è registrata, Registrati prima "Alert"
                            console.log("La mail non è registrata, Registrati prima")
                        }
                    });
                }else{
                    //Compila i campi "Alert"
                }
            } catch (err) {
                console.log(err)
            }
        }

        return (
            <>
                <Container>
                    <FormWrap>
                        <Icon to="/">VoidFlow</Icon>
                        <FormContent>
                            <Form action="#">
                                <FormH1>Sign in to your account</FormH1>
                                <FormLabel htmlFor='for'>Email</FormLabel>
                                <FormInput type='email' onChange={e=>mail = (e.target.value)} required/>
                                <FormLabel htmlFor='for'>Password</FormLabel>
                                <FormInput type='password' onChange={e=>password = (e.target.value)} required/>
                                <FormButton type='button' onClick={endSubmit}>Continue</FormButton>
                                <Text>Forgot Password</Text>
                            </Form>
                        </FormContent>
                    </FormWrap>
                </Container>
            </>
        )
    }
}
