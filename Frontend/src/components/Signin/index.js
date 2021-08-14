import React, {useState} from 'react'
import axios from 'axios';

import { Container,
    Text,
    Icon,
    Form, 
    FormContent, 
    FormH1, FormWrap, 
    FormButton, 
    FormInput, 
    FormLabel } from './SigninElements'

const SignIn = () => {
    const [mail, setMail] = useState(null);
    const [password, setPassword] = useState(null);

    const endSubmit = () => {
        axios.post('http://localhost:3000/login', {
            mail: mail,
            password: password
          })
          .then((response) => {
            console.log(response);
          }, (error) => {
          });
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
                            <FormInput type='email' onChange={e=>setMail(e.target.value)} required/>
                            <FormLabel htmlFor='for'>Password</FormLabel>
                            <FormInput type='password' onChange={e=>setPassword(e.target.value)} required/>
                            <FormButton type='submit' onSubmit={endSubmit()}>Continue</FormButton>
                            <Text>Forgot Password</Text>
                        </Form>
                    </FormContent>
                </FormWrap>
            </Container>
        </>
    )
}

export default SignIn
