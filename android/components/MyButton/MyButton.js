import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';

export default class MyButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { metadata } = this.props;
        const { content, screen, navigate, param, myLocation} = metadata;
        return (
            <Button title={content} buttonStyle={styles.Button}
            onPress={() => navigate(screen, {param:param, myLocation:myLocation})}
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