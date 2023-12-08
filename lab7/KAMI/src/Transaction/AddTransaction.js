import { React, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Alert,
    FlatList,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Button, FAB } from 'react-native-paper';
import { formatPrice } from './Transaction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const keyExtractor = ({ _id }) => _id;

function AddTransaction({ navigation }) {
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [checkedStates, setCheckedStates] = useState(
        new Array(services.length).fill(false),
    );
    const [CustomerId, setCustomerId] = useState('');
    const [ServicesPost, setServicesPost] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [tempNumber, setTempNumber] = useState([]);

    const isFocused = useIsFocused();

    function getCustomers() {
        axios
            .get('https://kami-backend-5rs0.onrender.com/customers')
            .then(function (response) {
                setCustomers(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('data');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    };

    function getServicesPost() {
        setServicesPost([]);
        for (let i = 0; i < services.length; i++) {
            if (checkedStates[i] && tempNumber[i] > 0) {
                let _id = services[i]._id;
                let temp = tempNumber[i];
                let user = data._j._id;
                let service = { _id, temp, user };
                setServicesPost(prev => [...prev, service]);
            }
        }
        
    }
    function getServices() {
        const axios = require('axios').default;
        axios
            .get('https://kami-backend-5rs0.onrender.com/services')
            .then(function (response) {
                setServices(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const calculatetotalprice = () => {
        let totalprice = 0;
        for (let i = 0; i < services.length; i++) {
            if (checkedStates[i]) totalprice += services[i].price * tempNumber[i];
        }
        setTotalPrice(totalprice);
        return totalprice;
    };

    useEffect(() => {
        if (isFocused) {
            getCustomers();
            getServices();
            setData(getData());
            calculatetotalprice();
        }
    }, [isFocused]);

    useEffect(() => {
        if (services) setTempNumber(new Array(services.length).fill(0));
    }, [services]);

    useEffect(() => {
        getServicesPost();
        calculatetotalprice();
    }, [tempNumber, checkedStates]);

    renderServices = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <BouncyCheckbox
                    style={styles.checkbox}
                    textStyle={{ textDecorationLine: 'none' }}
                    size={30}
                    fillColor="#ffc484"
                    text={item.name}
                    iconStyle={{}}
                    innerIconStyle={{ borderWidth: 2 }}
                    onPress={newIsChecked => {
                        const newCheckedStates = [...checkedStates];
                        newCheckedStates[index] = newIsChecked;
                        setCheckedStates(newCheckedStates);
                    }}
                />
                {checkedStates[index] && (
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: 15,
                                marginLeft: 45,
                            }}>
                            <Button
                                style={styles.button}
                                onPress={() => {
                                    if (tempNumber[index] > 0) {
                                        const newTempNumber = [...tempNumber];
                                        newTempNumber[index] = tempNumber[index] - 1;
                                        setTempNumber(newTempNumber);
                                    }
                                }}>
                                -
                            </Button>
                            <Button style={styles.button}>{tempNumber[index]}</Button>
                            <Button
                                style={styles.button}
                                onPress={() => {
                                    const newTempNumber = [...tempNumber];
                                    newTempNumber[index] = tempNumber[index] + 1;
                                    setTempNumber(newTempNumber);
                                }}>
                                +
                            </Button>
                            <Dropdown
                                style={[styles.dropdown, { marginLeft: 50, width: 150 }]}
                                data={[data._j]}
                                labelField="name"
                                valueField="_id"
                                placeholder="Select a user"
                                value={userId}
                                onChange={value => setUserId(value._id)}
                            />
                        </View>
                        <Text style={styles.pinkText}>
                            {' '}
                            {formatPrice(item.price * tempNumber[index])}{' '}
                            <Text style={{ textDecorationLine: 'underline' }}>đ</Text>
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    function postTransaction() {
        axios
            .post(
                'https://kami-backend-5rs0.onrender.com/transactions',
                {
                    customerId: CustomerId,
                    services: ServicesPost,
                },
                {
                    headers: {
                        Authorization: `Bearer ${data._j.token}`,
                    },
                },
            )
            .then(function (response) {
                Alert.alert('Updated successfully');
                navigation.goBack();
            })
            .catch(function (error) {
                Alert.alert('Update failed\n' + error);
                console.log(data._j.token);
                console.log(CustomerId);
                console.log(ServicesPost);
                console.log(error);
            });
    }


    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text
                    style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginVertical: 10,
                    }}>
                    Customer*
                </Text>
                <Dropdown
                    style={styles.dropdown}
                    data={customers}
                    labelField="name"
                    valueField="_id"
                    placeholder="Select a customer"
                    onChange={value => setCustomerId(value._id)}
                />
                <FlatList
                    data={services}
                    renderItem={renderServices}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <TouchableHighlight
                underlayColor="lightgrey"
                style={styles.fab}
                onPress={() => postTransaction()}>
                <Text style={{ fontSize: 18, color: 'white' }}>
                    See summary: {formatPrice(totalPrice)}{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>đ</Text>
                </Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        margin: 10,
        flex: 1,
        height: '100%',
        justifyContent: 'space-around',
        paddingBottom: 65,
    },
    itemContainer: {
        marginVertical: 10,
    },
    checkbox: {
        textDecorationLine: 'none',
    },
    button: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 0,
        height: 50,
        minWidth: 40,
        justifyContent: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    pinkText: {
        marginBottom: 15,
        color: '#ef506b',
        fontSize: 18,
        fontWeight: 'bold',
    },
    fab: {
        width: '90%',
        height: 60,
        position: 'absolute',
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        bottom: 10,
        backgroundColor: '#ef506b',
    },
});

export default AddTransaction;
