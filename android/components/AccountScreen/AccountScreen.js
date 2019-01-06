import React, { Component } from "react"
import { ScrollView, StyleSheet, View, Text } from "react-native";
import Button from "../Button";
import CustomTextInput from "../CustomTextInput";
import axios from "axios";
import LabelInfo from "../LabelInfo";
import {formatDataNow} from "../ComponentFunctions/time";

export default class AccountScreen extends Component {
    constructor() {
        super();
        this.state = {
            securityPanel: false,
            accountPanel: true,
            currentCard: false,
            historicalCardPanel: false,
            password: '',
            confirmPassword: '',
            passwordChangeComplete: false,
            passwordChangeFail: false,
            label: '',
            user: {},
            openCard: {},
            historicalCard: [],
        }

    }

    componentDidMount() {
        const user = this.props.navigation.getParam('param', {});
        this.setState({ user: user }, () => {
            this.GetOpenCard();
            this.GetFullFielledCard();
        });
    }

    async GetOpenCard() {
        const { user } = this.state;

        await axios('https://parkandrideapp.azurewebsites.net/Card/getOpenCard', {
            params: {
                id: user.UserId,
            }
        }).then(resp => {
            if (resp.data.length > 0)
                this.setState({ openCard: resp.data[0] });
        }).catch(() => {
            alert("Błąd","Nie udało się pobrać karty")
        })
    }

    async GetFullFielledCard() {
        const { user } = this.state;
        await axios('https://parkandrideapp.azurewebsites.net/Card/GetFullfilledCard', {
            params: {
                id: user.UserId,
            }
        }).then(resp => {
            if (resp.data.length > 0)
                this.setState({ historicalCard: resp.data });
        }).catch(() => {
            alert("Błąd","Nie udało się pobrać karty")
        })
    }

    accountUserHandler = () => {
        this.setState({
            accountPanel: true, securityPanel: false,
            historicalCardPanel: false, currentCard: false
        });
    }
    securityUserHandler = () => {
        this.setState({
            accountPanel: false, securityPanel: true,
            historicalCardPanel: false, currentCard: false
        });
    }

    historicalCardHandler = () => {
        this.setState({
            accountPanel: false, securityPanel: false,
            historicalCardPanel: true, currentCard: false
        });
    }
    currentCardHandler = () => {
        this.setState({
            accountPanel: false, securityPanel: false,
            historicalCardPanel: false, currentCard: true,
        });
    }

    onChangeTextPassword = (text) => {
        this.setState({ password: text })
    }
    onChangeTextConfirmPassword = (text) => {
        this.setState({ confirmPassword: text })
    }

    async changePasswordPut() {
        const { user, password } = this.state;
        user.password = password;

        await axios({
            method: 'put',
            url: 'https://parkandrideapp.azurewebsites.net/account/mobileput',
            headers: { 'Content-Type': 'application/json' },
            data: {
                ...user
            }

        }).then((resp) => {
            this.setState({ passwordChangeComplete: true, password: '', confirmPassword: '' })
        }).catch(err => {
            this.setState({ passwordChangeFail: true, password: '', confirmPassword: '', label: 'Niepowodzenie' })

        });
    }

    changePassword = () => {
        const { password, confirmPassword } = this.state;
        if (password === confirmPassword) {
            this.changePasswordPut();
        }
        else {
            this.setState({ label: 'Złe potwierdzenie hasła', password: '', confirmPassword: '' })
        }
    }

   async endPark(){
        const {openCard} = this.state;

        openCard.dataTo=formatDataNow();
        await axios({
            method: 'put',
            url: 'https://parkandrideapp.azurewebsites.net/card/put',
            headers: { 'Content-Type': 'application/json' },
            data: {
                ...openCard
            }

        }).then((resp) => {
            console.log(resp);
            this.setState((state)=>{
                state.historicalCard.unshift(openCard);
              return {openCard:{}, historicalCard:state.historicalCard}
            })
        }).catch(err => {
            console.log(resp);
            this.setState((state)=>{
               alert("Błąd","Niepowodzenie");
            });

        });
    }

    render() {
        const { securityPanel, accountPanel, currentCard, historicalCardPanel, confirmPassword,
            password, label, user, openCard, historicalCard } = this.state;

        return <ScrollView>
            <>
                <View style={styles.tabsPanel}>
                    <View style={styles.tabsPanelRow}>
                        <Button button2 color="white" size="small" text="Dane użytkownika" onPress={() => this.accountUserHandler()}></Button>
                        <Button button2 color="white" size="small" text="Dane logowania" onPress={() => this.securityUserHandler()}></Button>
                    </View>
                    <View style={styles.tabsPanelRow}>
                        <Button button2 color="white" size="small" text="Historia parkowań" onPress={() => this.historicalCardHandler()}></Button>
                        <Button button2 color="white" size="small" text="Obecny postój" onPress={() => this.currentCardHandler()}></Button>
                    </View>

                </View>
                {accountPanel && user.user && <><Text>Imię: {user.user.name}</Text>
                    <Text>Nazwisko: {user.user.surname}</Text>
                </>}
                {securityPanel && <View>
                    <Text>Login: {user.login}</Text>
                    <CustomTextInput secureTextEntry placeholder="Hasło" value={password}
                        onChangeText={this.onChangeTextPassword}></CustomTextInput>
                    <CustomTextInput secureTextEntry placeholder="Potwierdź hasło" value={confirmPassword}
                        onChangeText={this.onChangeTextConfirmPassword}></CustomTextInput>
                    <Button text="Zmień hasło" size="medium" onPress={() => this.changePassword()}></Button>
                    {label !== '' && <LabelInfo type="error" label={label}></LabelInfo>}
                </View>}
                {currentCard && openCard.parking && <View style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"70%"}}>
                    <View style={styles.currentCardContainer}>
                        <Text style={styles.header}>{openCard.parking.name}</Text>
                        <Text>{`${openCard.parking.place} ${openCard.parking.street}`}</Text>
                        <Text style={styles.header2}>{`Początek: ${openCard.dataFrom}`}</Text>
                    </View>
                    <Button size="medium" text="Zakończ parkowanie" onPress={() => this.endPark()}></Button>
                </View>}
                {historicalCardPanel === true && <ScrollView style={{ display: "flex",flex:1, flexDirection: "column", height: "70%" }}>
                   <>{historicalCard.map((elem, index) => <View key={index+"historicalCard"} style={styles.currentCardContainer}>
                        <Text style={styles.header}>{elem.parking.name}</Text>
                        <Text>{`${elem.parking.place} ${elem.parking.street}`}</Text>
                        <Text style={styles.header2}>{`Początek: ${elem.dataFrom}`}</Text>
                        <Text style={styles.header2}>{`Koniec: ${elem.dataTo}`}</Text>
                    </View>) }</>
                    </ScrollView>}
            </>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    tabsPanel: {
        display: "flex",
        flexDirection: "column",
    },
    tabsPanelRow: {
        display: "flex",
        flexDirection: "row",
    },
    currentCardContainer: {
        margin: 5,
        borderWidth: 3,
        borderColor: "gray",

    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
    },
    header2: {
        fontSize: 16,
        fontWeight: "bold",
    }
})