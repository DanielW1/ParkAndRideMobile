import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import Button from "../Button/Button";
import LabelInfo from "../LabelInfo";
import axios from "axios";

export default class LoginPanel extends Component {
    constructor() {
        super();
        this.state = {
            password: '',
            login: '',
            registerFailText: false,
        }
    }

    async  LoginUser() {
        const { login, password } = this.state;
        let result = null;
        console.log("loginuser")
        await axios({
            method: 'post',
            url: 'https://parkandrideapp.azurewebsites.net/account/mobilelogin',
            headers: { 'Content-Type': 'application/json' },
            data: {
                login: login,
                password: password,
            }

        }).then((resp) => {
            if (resp.status === 200) {
                console.log(resp);

                result = resp.data;
            } else {
                console.log("thenelse");
                console.log(resp);
                this.setState({ registerFailText: true })
            }
        }).catch(err => {
            this.setState({ registerFailText: true })

        });
        return result;
    }

    onPressRegisterButton = () => {
        const { navigate } = this.props.navigation;
        navigate('RegisterSreen');
    }

    async onLoggedIn() {
        const result = await this.LoginUser();
        this.setState({password:'', login:''});
        if (result) {
            const { navigate } = this.props.navigation;
            navigate('LoggedIn', { navigate: navigate, user:result })
        }
    }

    onChangeTextLoginHandler = (text) => {
        this.setState({ login: text });
    }

    onChangeTextPasswordHandler = (text) => {
        this.setState({ password: text });
    }


    render() {

        const { login, password, registerFailText } = this.state;

        return <View style={styles.LoginPanel}>
            {registerFailText && <LabelInfo type="error" label="Niepoprawne logowanie" />}
            <CustomTextInput label="Login" onChangeText={this.onChangeTextLoginHandler} value={login}
                onFocus={() => this.setState({ registerFailText: false })}
            />
            <CustomTextInput label="Hasło" value={password} onFocus={() => this.setState({ registerFailText: false })}
                onChangeText={this.onChangeTextPasswordHandler} secureTextEntry />
            <Button size="medium" text="Zaloguj" onPress={() => this.onLoggedIn()}></Button>
            <Button size="medium" text="Rejestracja" onPress={this.onPressRegisterButton}></Button>
        </View>
    }
}

const styles = StyleSheet.create({
    LoginPanel: {
        display: "flex",
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

    }
})