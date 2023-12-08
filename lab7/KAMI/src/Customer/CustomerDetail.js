import { React, useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    renderTransaction,
    formatDate,
    formatPrice,
} from '../Transaction/Transaction';
import axios from 'axios';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

function CustomerDetail({ route, navigation }) {
    const { item } = route.params;
    const [customer, setCustomer] = useState([]);
    const [yourToken, setYourToken] = useState('');

    const isFocused = useIsFocused();

    const renderItem = ({ item }) =>
        renderTransaction({ item, disableOnpress: true });

    function getCustomer() {
        axios
            .get('https://kami-backend-5rs0.onrender.com/Customers/' + item._id)
            .then(function (response) {
                setCustomer(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
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

    const MenuComponent = () => {
        return (
            <Menu>
                <MenuTrigger>
                    <Icon source="dots-vertical" size={25} color="white" />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => navigation.navigate("EditCustomer", { item })}>
                        <Text style={{paddingVertical:10}}>
                            <Icon source="pencil" size={18} color="grey" /> Edit
                        </Text>
                    </MenuOption>
                    <MenuOption onSelect={() => AlertDelete()}>
                        <Text style={{paddingVertical:10}}>
                            <Icon source="delete" size={18} color="grey" /> Delete
                        </Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        );
    };

    const AlertDelete = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to remove this client? This operation cannot be undone.',
            [
                {
                    text: 'DELETE',
                    onPress: () => deleteCustomer(),
                },
                {
                    text: 'CANCEL',
                    onPress: () => console.log('Cancel Pressed'),
                },
            ],
        );
    };

    function deleteCustomer() {
        const axios = require('axios').default;
        axios
            .delete('https://kami-backend-5rs0.onrender.com/Customers/' + item._id, {
                headers: { Authorization: `Bearer ${yourToken}` },
            })
            .then(function (response) {
                navigation.goBack();
                Alert.alert('Deleted successfully');
            })
            .catch(function (error) {
                Alert.alert('Deleted failed');
                console.log(yourToken);
            });
    }

    const BlackText = props => {
        return (
            <Text style={[{ color: 'black', fontWeight: '400' }, props.style]}>
                {props.children}
            </Text>
        );
    };

    useEffect(() => {
        if (isFocused) {
            getCustomer();
            getToken();
        }
    }, [isFocused]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity title="options">
                    <MenuComponent />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.InfoContainer}>
                <Text style={styles.pinkText}>General information</Text>
                <BlackText>
                    <Text style={styles.text}>Name: </Text>
                    {customer.name}
                </BlackText>
                <BlackText>
                    <Text style={styles.text}>Phone: </Text>
                    {customer.phone}
                </BlackText>
                <BlackText>
                    <Text style={styles.text}>Total spent: </Text>
                    <Text style={styles.pinkText}>
                        {formatPrice(parseInt(customer.totalSpent))}{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>đ</Text>
                    </Text>
                </BlackText>
                <BlackText>
                    <Text style={styles.text}>Time: </Text>
                </BlackText>
                <BlackText>
                    <Text style={styles.text}>Last update: </Text>
                    {Date.parse(customer.updatedAt) ? formatDate(customer.updatedAt) : ''}
                </BlackText>
            </View>
            <View style={styles.TransactionContainer}>
                <Text style={styles.pinkText}>Transaction history</Text>
                <FlatList
                    data={customer.transactions}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    InfoContainer: {
        margin: 6,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    TransactionContainer: {
        margin: 6,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBottom: 210,
    },
    pinkText: {
        color: '#ef506b',
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 10,
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
    },
    fab: {
        backgroundColor: '#ef506b',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default CustomerDetail;
