import {React, useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddCustomer({navigation}) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                setToken(value);
            }
        } catch (e) {
            // error reading value
        }
    };

    async function addCustomer() {
        console.log(name +" "+ phone);
        
        getToken();
        console.log(token);
        await axios.post('https://kami-backend-5rs0.onrender.com/customers', {
            phone: phone,
            name: name,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                Alert.alert("Added successfully");
                console.log(name +" "+ phone);
                navigation.goBack();
            })
            .catch(function (error) {
                Alert.alert("Either Server error or phone number already exists");
                console.log(error);
            })
    }


    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Customer name*</Text>
                <TextInput
                    onChangeText={text => setName(text)}
                    placeholder="Input your customer's name"
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Phone*</Text>
                <TextInput
                    onChangeText={text => setPhone(text)}
                    placeholder="Input phone number"
                    keyboardType='numeric'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={{ margin: 10 }}>
                <Button
                    title="Add"
                    color={'#ef506b'}
                    onPress={() => addCustomer()}
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

export default AddCustomer;