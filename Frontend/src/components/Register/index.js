import React, {Component} from 'react';
import axios from 'axios';
import crypto from 'crypto';
import {apiUrl} from '../../variables';

import { Container,
    Text,
    Icon,
    Form, 
    FormContent, 
    FormH1,
    FormWrap, 
    FormButton, 
    FormInput, 
    FormLabel } from './RegisterElements';


export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {flag : 0, error : ''};
      }

    render(){

        /*

        Checking if user is already logged in

        if (this.props.user !== "") {
            alert("You can't login if you are logged in!");
            return  <Redirect  to="/" />
        }
        */

        //const [mail, setMail] = useState(null);
        //const [password, setPassword] = useState(null);

        const passRe = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

        let json={}, name="", surname="", phone="", confirmPassword="", mail="", password="";

        const endSubmit = async () => {
            try{
                if(!passRe.test(password)){
                    this.setState({flag:1, error:"Password has to have: One upper case letter, One lower case letter, at least One number, at least One special character, minimum 8 in Length."})
                } else {
                    if( password === confirmPassword ){

                        if(password !== "" && confirmPassword !== "" && mail !== "" && name !== "" && surname !== ""){
                            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
                            if(phone === ""){
                                json = {
                                    mail: mail,
                                    password: hashedPassword,
                                    name: name,
                                    surname: surname
                                }
                            } else {
                                json = {
                                    mail: mail,
                                    password: hashedPassword,
                                    phone: phone,
                                    name: name,
                                    surname: surname
                                }
                            }
                            axios.post(`${apiUrl}/register`, json)
                            .then((response) => {
                                if(response.status === 200){
                                    this.setState({error : 'Registration done. Confirm your mail and Log in.'});
                                }
                            }, (error) => {
                                if(error.response !== undefined){
                                    if (error.response.status === 400 && error.response.data.message.includes("duplicate key error")){
                                        //La mail non è registrata, Registrati prima "Alert"
                                        this.setState({flag:1, error:"This email is registered. Login to your account."})
                                    } else {
                                        this.setState({flag:1, error:error.response.data.message})
                                    }
                                }
                            });
                        }else{
                            //Compila i campi "Alert"
                            this.setState({flag:1, error:"Inserisci i dati richiesti (*)"})
                        }
                    } else {
                        this.setState({flag:1, error:"Passwords are not the same."})
                    }
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
                            <FormH1 id='start-login'>Register a new Account</FormH1>
                                <table>
                                <th>
                                <FormLabel htmlFor='for'>Name *</FormLabel>
                                <FormInput type='name' placeholder='Mario' onChange={e=>name = (e.target.value)} required/>
                                <FormLabel htmlFor='for'>Surname *</FormLabel>
                                <FormInput type='surname' placeholder='Rossi' onChange={e=>surname = (e.target.value)} required/>
                                <FormLabel htmlFor='for'>Phone</FormLabel>
                                <FormInput type='phone' placeholder='**********' onChange={e=>phone = (e.target.value)} required/>
                                </th>
                                <th>
                                <FormLabel htmlFor='for'>Email *</FormLabel>
                                <FormInput type='email' placeholder='example@void.it' onChange={e=>mail = (e.target.value)} required/>
                                <FormLabel htmlFor='for'>Password *</FormLabel>
                                <FormInput type='password' placeholder='********' onChange={e=>password = (e.target.value)} required/>
                                <FormLabel htmlFor='for'>Confirm Password *</FormLabel>
                                <FormInput type='password' placeholder='********' onChange={e=>confirmPassword = (e.target.value)} required/>
                                </th>
                                </table>
                                <FormButton type='button' onClick={endSubmit}>Continue</FormButton>
                                <Text>{this.state.error}</Text>
                            </Form>
                        </FormContent>
                    </FormWrap>
                </Container>
            </>
        )
    }
}
