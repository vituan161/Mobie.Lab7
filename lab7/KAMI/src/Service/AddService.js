import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddService({ navigation }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [token, setToken] = useState('');

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                setToken(value);
            }
        } catch (e) {
            // error reading value
        }
    };

    const axios = require('axios').default;
    async function addService() {
        getData();
        await axios.post('https://kami-backend-5rs0.onrender.com/services', {
            name: name,
            price: price
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                Alert.alert("Added successfully");
                navigation.goBack();
            })
            .catch(function (error) {
                Alert.alert("Server error");
                console.log(error);
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Service name*</Text>
                <TextInput
                    value={name}
                    onChangeText={text => setName(text)}
                    placeholder='Input a service name'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Price*</Text>
                <TextInput
                    value={price}
                    onChangeText={text => setPrice(text)}
                    keyboardType='numeric'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={{ margin: 10 }}>
                <Button
                    title='Add'
                    color={'#ef506b'}
                    onPress={() => addService()}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    textContainer: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
    },
});
export default AddService;