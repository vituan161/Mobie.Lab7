import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEvent } from 'react-native-reanimated';

function EditCustomer({ navigation, route }) {
    const { item } = route.params;
    const [name, setName] = useState(item.name);
    const [phone, setPhone] = useState(item.phone);
    const [yourToken, setYourToken] = useState('');
    const axios = require('axios').default;

    function UpdateCustomer() {
        axios.put('https://kami-backend-5rs0.onrender.com/Customers/' + item._id, {
            name: name,
            phone: phone,
        },{
            headers: {
                Authorization: `Bearer ${yourToken}`
            }
        })
            .then(function (response) {
                console.log(response);
                Alert.alert("Updated successfully");
                navigation.goBack();
            })
            .catch(function (error) {
                Alert.alert("Update failed\n" + error);
                console.log(error);
            })
    }

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                setYourToken(value);
            }
        } catch (e) {
            // error reading value
        }
    };

    useEffect(() => {
        getToken();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Customer name*</Text>
                <TextInput
                    value={name}
                    onChangeText={name => setName(name)}
                    placeholder='Input a Customer name'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Phone*</Text>
                <TextInput
                    value={phone.toString()}
                    onChangeText={phone => setPhone(phone)}
                    keyboardType='numeric'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={{ margin: 10 }}>
                <Button
                    title='Update'
                    color={'#ef506b'}
                    onPress={() => UpdateCustomer()}
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

export default EditCustomer;