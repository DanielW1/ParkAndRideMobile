import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import CustomTextInput from "./../CustomTextInput";
import Button from "./../Button";
import axios from "axios";
import LabelInfo from "../LabelInfo/LabelInfo";


export default class RegisterPanel extends Component{
    constructor(){
        super();
        this.state={
            password:'',
            login:'',
            name:'',
            surname:'',
            confirmPassword:'',
            registerCompleteText:false,
            registerFailText:false,
            errorMessage:'Niepoprawne dane'
        }
    }
    validationFormular = () => {
        const {password, login, name, surname, confirmPassword} = this.state;
        if(password && login && name && surname && confirmPassword)
        {
            if(confirmPassword === password){
                this.registerUser();
            }else{
                this.setState({ registerFailText: true, errorMessage: 'Nieudane potwierdzenie hasła'})
            }
        }else{
            this.setState({registerFailText:true, errorMessage:'Uzupełnij wszystkie pola'})
        }
    }

   async  registerUser(){
        const {login, password, name, surname} = this.state;
        
        await axios({
            method:'post',
            url:'https://parkandrideapp.azurewebsites.net/account/post',
            headers: { 'Content-Type': 'application/json' },
            data:{
                login:login,
                password:password,
                name:name,
                surname:surname,
            }

        }).then((resp)=>{
            this.setState({registerCompleteText:true, registerFailText:false})
            console.log(resp);
        }).catch(err=>{
            this.setState({ registerFailText: true })
            console.log(err);
        });
    }

    onChangeTextLoginHandler = (text) =>{
        this.setState({login:text});
    }

    onChangeTextPasswordHandler = (text) => {
        this.setState({ password: text });
    }
    onChangeTextNameHandler = (text) => {
        this.setState({name:text});
    }

    onChangeTextSurnameHandler = (text) => {
        this.setState({ surname: text });
    }

    onChangeTextConfirmPasswordHandler = (text) => {
        this.setState({ confirmPassword: text });
    }

    render(){
        const {password, login, registerCompleteText, registerFailText, 
            errorMessage, name, surname, confirmPassword} = this.state;
        return <View style={styles.RegisterPanel}>
            {registerCompleteText && <LabelInfo type="complete" label="Zarejestrowany" />}
            {registerFailText && <LabelInfo type="error" label={errorMessage}/>}
            <CustomTextInput onChangeText={this.onChangeTextNameHandler} label="Imię" value={name}
                onFocus={() => this.setState({ registerCompleteText: false, registerFailText: false })} />
            <CustomTextInput onChangeText={this.onChangeTextSurnameHandler} label="Surname" value={surname}
                onFocus={() => this.setState({ registerCompleteText: false, registerFailText: false })} />
            <CustomTextInput onChangeText={this.onChangeTextLoginHandler} label="Login" value={login}
                onFocus={() => this.setState({ registerCompleteText: false, registerFailText: false })} />
            <CustomTextInput onChangeText={this.onChangeTextPasswordHandler} 
            label="Hasło" secureTextEntry value={password}
            onFocus={()=>this.setState({registerCompleteText:false, registerFailText:false})}/>
            <CustomTextInput secureTextEntry onChangeText={this.onChangeTextConfirmPasswordHandler} label="Powtórz hasło"
                value={confirmPassword}
                onFocus={() => this.setState({ registerCompleteText: false, registerFailText: false })} />
            <Button size="medium" text="Zarejestruj" onPress={()=>this.validationFormular()}></Button>
        </View>
    }
}

const styles = StyleSheet.create({
    RegisterPanel: {
        display: "flex",
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',

    }
})