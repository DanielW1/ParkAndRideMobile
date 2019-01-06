import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
//import { Button } from 'react-native-elements';
import Button from "./../Button"

export default class MyButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { metadata } = this.props;
        const { content, screen, navigate, param, myLocation, drawPanel, user} = metadata;
        return (
            <Button text={content} size="medium"
            onPress={() => navigate(screen, {param:param, user:user, myLocation:myLocation, drawPanel:drawPanel, navigate:navigate})}
/>
            );
    }
}

const styles = StyleSheet.create({
    Button: {
        width: '60%',
        height: 40,
        backgroundColor: 'rgb(17, 175, 238)',
        borderWidth: 1,
        borderColor: 'rgb(17, 175, 238)',
        borderRadius: 10,
    },
})