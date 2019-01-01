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
            registerCompleteText:false,
            registerFailText:false,
        }
    }

   async  registerUser(){
        const {login, password} = this.state;
        
        await axios({
            method:'post',
            url:'https://parkandrideapp.azurewebsites.net/account/post',
            headers: { 'Content-Type': 'application/json' },
            data:{
                login:login,
                password:password,
            }

        }).then((resp)=>{
            this.setState({registerCompleteText:true})
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

    render(){
        const {password, login, registerCompleteText, registerFailText} = this.state;
        return <View style={styles.RegisterPanel}>
            {registerCompleteText && <LabelInfo type="complete" label="Zarejestrowany" />}
            {registerFailText && <LabelInfo type="error" label="Niepoprawne dane"/>}
            <CustomTextInput onChangeText={this.onChangeTextLoginHandler} label="Login" value={login}
                onFocus={() => this.setState({ registerCompleteText: false, registerFailText: false })} />
            <CustomTextInput onChangeText={this.onChangeTextPasswordHandler} 
            label="Hasło" secureTextEntry value={password}
            onFocus={()=>this.setState({registerCompleteText:false, registerFailText:false})}/>
            <Button size="medium" text="Zarejestruj" onPress={()=>this.registerUser()}></Button>
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