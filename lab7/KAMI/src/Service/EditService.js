import React from 'react';
import { View,Text,StyleSheet,Button,Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import {useState} from 'react';
import axios from 'axios';

function EditService({navigation,route}) {
    const {item} = route.params;
    const [name, setName] = useState(item.name);
    const [price, setPrice] = useState(item.price);
    const axios = require('axios').default;
    function UpdateService() {
        axios.put('https://kami-backend-5rs0.onrender.com/services/'+item._id, {
            _id : item._id,
            name: name,
            price: price
        })
            .then(function (response) {
                console.log(response);
                Alert.alert("Updated successfully");
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Service name*</Text>
                <TextInput
                    value={name}
                    onChangeText={name => setName(name)}
                    placeholder='Input a service name'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Price*</Text>
                <TextInput
                    value={price.toString()}
                    onChangeText={price => setPrice(price)}
                    keyboardType='numeric'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    cursorColor='black'
                />
            </View>
            <View style={{ margin:10 }}>
                <Button
                    title='Update'
                    color={'#ef506b'}
                    onPress={() => UpdateService()}
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

export default EditService;