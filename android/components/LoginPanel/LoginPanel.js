import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import Button from "../Button/Button";


export default class LoginPanel extends Component{
    constructor(){
        super();
        this.state={
            password:'',
            login:'',
        }
    }
    onPressRegisterButton = ()=> {
        const { navigate } = this.props.navigation;
        navigate('RegisterSreen');
    }

    onLoggedIn = ()=>{
        const { navigate } = this.props.navigation;
        navigate('LoggedIn', {navigate:navigate})
    }

    onChangeTextLoginHandler = (text) => {
        this.setState({ login: text });
    }

    onChangeTextPasswordHandler = (text) => {
        this.setState({ password: text });
    }


    render(){

       const{login,password} = this.state;

        return <View style={styles.LoginPanel}>
            <CustomTextInput label="Login" onChangeText={this.onChangeTextLoginHandler} value={login}/>
            <CustomTextInput label="Hasło" value={password}
                onChangeText={this.onChangeTextPasswordHandler} secureTextEntry/>
            <Button size="medium" text="Zaloguj" onPress={this.onLoggedIn}></Button>
            <Button size="medium" text="Rejestracja" onPress={this.onPressRegisterButton}></Button>
        </View>
    }
}

const styles=  StyleSheet.create({
    LoginPanel:{
        display:"flex",
        flex:1,
        flexDirection:'column',
        justifyContent:'center',

    }
})