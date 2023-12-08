
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon, IconButton, Appbar } from 'react-native-paper';
import { Image } from 'react-native';
import ServiceDetail from './ServiceDetail';
import { useIsFocused } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

keyExtractor = ({ _id }) => _id;

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('data');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
};

function Home({ navigation }) {
    const [detail, setDetail] = useState({ name: '' });
    const [services, setServices] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getServices();
            getData().then((value) => {
                if (value != null)
                    setDetail(value);
            });
        }
    }, [isFocused]);

    function getServices() {
        const axios = require('axios').default;
        axios.get('https://kami-backend-5rs0.onrender.com/services')
            .then(function (response) {
                setServices(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const renderServices = ({ item }) => {
        const { name, price } = item;
        return <TouchableHighlight style={styles.serviceContainer} underlayColor={'lightgrey'}
            onPress={() => navigation.navigate('ServiceDetail', { item })}
        >
            <View style={styles.service}>
                <Text style={styles.text}>{name}</Text>
                <Text>{price} <Text style={{ textDecorationLine: 'underline' }}>đ</Text></Text>
            </View>
        </TouchableHighlight>
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Appbar.Content titleStyle={styles.textTitle} title={detail.name} />
                <View style={{ flexDirection: 'row' }}>
                    <IconButton style={styles.AccountButton} icon="account-circle" iconColor='white' />
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Image source={{ uri: "https://i.pinimg.com/originals/97/9a/c1/979ac1ed9534d1c0b595b2e378cc2a0f.jpg" }} style={{ alignSelf: 'center', width: 100, height: 100 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text}>Danh sách dịch vụ</Text>
                    <IconButton style={styles.AddButton} icon="plus-thick" iconColor='white' size={15} onPress={() => navigation.navigate('AddService')} />
                </View>
                <FlatList
                    data={services}
                    renderItem={renderServices}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{ paddingBottom: 190 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    topBar: {
        backgroundColor: '#ef506b',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    textTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#ef506b',
        margin: 14,
    },
    AccountButton: {
        alignSelf: 'center',
    },
    contentContainer: {
        margin: 15,
    },
    AddButton: {
        backgroundColor: '#ef506b',
    },
    serviceContainer: {
        marginVertical: 5,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
    },
    service: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    text: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Home;