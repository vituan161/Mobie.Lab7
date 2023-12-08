import { React, useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TransactionDetail({ navigation, route }) {
    const { item } = route.params;
    const [yourToken, setYourToken] = useState('');

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

    function formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        const date = new Date(dateString);
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
            date,
        );
        return formattedDate.replace(',', '');
    }

    function formatPrice(price) {
        let formattedPrice = price;
        if (price > 1000000000) {
            formattedPrice =
                (price / 1000000000).toFixed(2).toLocaleString('de-DE') + 'B';
        } else {
            formattedPrice = price.toLocaleString('de-DE');
        }
        return formattedPrice;
    }

    const AlertDelete = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to cancel this transaction? This operation cannot be undone.',
            [
                {
                    text: 'DELETE',
                    onPress: () => deleteTransaction(),
                },
                {
                    text: 'CANCEL',
                    onPress: () => console.log('Cancel Pressed'),
                },
            ],
        );
    };

    function deleteTransaction() {
        const axios = require('axios').default;
        axios
            .delete('https://kami-backend-5rs0.onrender.com/transactions/' + item._id, {
                headers: { Authorization: `Bearer ${yourToken}` },
            })
            .then(function (response) {
                navigation.goBack();
                Alert.alert('Cancel successfully');
            })
            .catch(function (error) {
                Alert.alert('Canceled failed');
                console.log(error);
            });
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity title="options">
                    <MenuComponent />
                </TouchableOpacity>
            ),
        });
        getToken();
    }, [navigation]);

    const BlackText = props => {
        return (
            <Text style={[{ color: 'black', fontWeight: '600' }, props.style]}>
                {props.children}
            </Text>
        );
    };

    const MenuComponent = () => {
        return (
            <Menu>
                <MenuTrigger>
                    <Icon source="dots-vertical" size={25} color="white" />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => Alert.alert('edit pressed')}>
                        <Text style={{paddingVertical:10}}>See more details</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => AlertDelete()}>
                        <Text style={{paddingVertical:10}}>Cancel transaction</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.Itemcontainer}>
                <Text style={styles.pinkText}>General information</Text>
                <View style={styles.GeneralContainer}>
                    <View style={{ flex: 2, justifyContent: 'space-around' }}>
                        <BlackText>Transaction code </BlackText>
                        <BlackText>Customer </BlackText>
                        <BlackText>Creation time </BlackText>
                    </View>
                    <View
                        style={{
                            flex: 2,
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                        }}>
                        <BlackText>{item.id}</BlackText>
                        <BlackText>
                            {item.customer.name} - {item.customer.phone}
                        </BlackText>
                        <BlackText>{formatDate(item.createdAt)}</BlackText>
                    </View>
                </View>
            </View>
            <View style={styles.Itemcontainer}>
                <Text style={styles.pinkText}>Service list</Text>
                <View style={styles.ServiceContainer}>
                    <View style={{ flex: 2, justifyContent: 'space-around' }}>
                        {item.services.map(service => {
                            return <BlackText key={service._id}>{service.name}</BlackText>;
                        })}
                    </View>
                    <View
                        style={{
                            flex: 0,
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                        }}>
                        {item.services.map(service => {
                            return <Text key={service._id}>x{service.quantity}</Text>;
                        })}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                        }}>
                        {item.services.map(service => {
                            return (
                                <BlackText key={service._id}>
                                    {formatPrice(service.price)}{' '}
                                    <BlackText style={{ textDecorationLine: 'underline' }}>
                                        đ
                                    </BlackText>
                                </BlackText>
                            );
                        })}
                    </View>
                </View>
                <View style={{ justifyContent: 'space-around' }}>
                    <View
                        style={{
                            borderBottomColor: 'lightgrey',
                            borderBottomWidth: 1,
                            marginVertical: 10,
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <BlackText style={{ flex: 1 }}>Total</BlackText>
                    <View>
                        <BlackText style={{ flex: 1 }}>
                            {item.price.toLocaleString('de-DE')}{' '}
                            <BlackText style={{ textDecorationLine: 'underline' }}>đ</BlackText>
                        </BlackText>
                    </View>
                </View>
            </View>
            <View style={styles.Itemcontainer}>
                <Text style={styles.pinkText}>Service list</Text>
                <View style={styles.CostContainer}>
                    <View style={{ flex: 2, justifyContent: 'space-around' }}>
                        <BlackText>Amount of money</BlackText>
                        <BlackText>Discout</BlackText>
                    </View>
                    <View
                        style={{
                            flex: 2,
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                        }}>
                        <BlackText>{item.priceBeforePromotion.toLocaleString('de-DE')} <BlackText style={{ textDecorationLine: 'underline' }}>đ</BlackText></BlackText>
                        <BlackText>-{formatPrice(item.priceBeforePromotion - item.price)} <BlackText style={{ textDecorationLine: 'underline' }}>đ</BlackText></BlackText>
                    </View>
                </View>
                <View style={{ justifyContent: 'space-around' }}>
                    <View
                        style={{
                            borderBottomColor: 'lightgrey',
                            borderBottomWidth: 1,
                            marginVertical: 10,
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <BlackText style={{ flex: 1 }}>Total</BlackText>
                    <View>
                        <BlackText style={[{ flex: 1 }, styles.pinkText]}>
                            {item.price.toLocaleString('de-DE')}{' '}
                            <BlackText style={[{ textDecorationLine: 'underline' },styles.pinkText]}>đ</BlackText>
                        </BlackText>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Itemcontainer: {
        margin: 10,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    GeneralContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 90,
    },
    ServiceContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 140,
    },
    CostContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
    },
    pinkText: {
        fontSize: 16,
        color: '#ef506b',
        fontWeight: 'bold',
    },
});
export default TransactionDetail;
