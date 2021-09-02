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
        let mail="", password="";

        const endSubmit = async (event) => {
            
            try{
                if(password !== "" && mail !== ""){
                    const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
                    
                    axios.post(`${apiUrl}/login`, {
                        mail: mail,
                        password: hashedPassword
                    })
                    .then((response) => {
                        console.log(response)
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

        return (
            <>
                <Container>
                    <h1>{this.props.loggedInStatus}</h1>
                    <FormWrap>
                        <Icon to="/">VoidFlow</Icon>
                        <FormContent>
                            <Form action="#">
                                <FormH1 id='start-login'>Sign in to your account</FormH1>
                                <FormLabel htmlFor='for'>Email</FormLabel>
                                <FormInput type='email' placeholder='example@void.it' onChange={e=>mail = (e.target.value)} required/>
                                <FormLabel htmlFor='for'>Password</FormLabel>
                                <FormInput type='password' placeholder='********' onChange={e=>password = (e.target.value)} required/>
                                <FormButton type='button' onClick={endSubmit}>Continue</FormButton>
                                <Text>Forgot Password</Text>
                                <Text>{this.state.error}</Text>
                            </Form>
                        </FormContent>
                    </FormWrap>
                </Container>
            </>
        )
    }
}
