import { React, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableHighlight, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Icon, FAB } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import axios from "axios";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

keyExtractor = ({ _id }) => _id;

function Transaction({ navigation }) {
    const [transaction, settransaction] = useState([]);

    const renderItem = ({ item }) => renderTransaction({ item }, navigation);

    const isFocused = useIsFocused();

    function getTransaction() {
        axios.get('https://kami-backend-5rs0.onrender.com/transactions')
            .then(function (response) {
                settransaction(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        if (isFocused)
            getTransaction();

    }, [isFocused]);



    return (
        <View style={styles.container}>
            <FlatList
                data={transaction}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
            <FAB
                icon="plus"
                color="white"
                style={styles.fab}
                mode="flat"
                size="small"
                onPress={() => navigation.navigate('AddTransaction')}
            />
        </View>
    );
}

export function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formattedDate.replace(',', '');
}
export function formatPrice(price) {
    let formattedPrice = price;
    if (price > 1000000000) {
        formattedPrice = (price / 1000000000).toFixed(2).toLocaleString('de-DE') + 'B';
    } else {
        formattedPrice = price.toLocaleString('de-DE');
    }
    return formattedPrice;
}

export const renderTransaction = ({ item, disableOnpress }, navigation) => {
    const { customer, id, price, services, status, updatedAt } = item;
    return (
        <TouchableOpacity style={styles.Itemcontainer} onPress={disableOnpress ? null : () => { navigation.navigate('TransactionDetail', { item }) }}>
            <View style={styles.InfoContainer}>
                <Text style={styles.text}>
                    {id} - {formatDate(updatedAt)}
                    {status == "cancelled" ? <Text style={styles.pinkText}> - Cancelled</Text> : null}
                </Text>
                <View>
                    {services.map((service) => {
                        return (
                            <Text key={service._id} numberOfLines={1} style={{ color: 'black' }}>
                                - {service.name}
                            </Text>
                        )
                    })}
                </View>
                <Text>Customer: {customer.name}</Text>
            </View>
            <View style={styles.PriceContainer}>
                <Text style={styles.pinkText}>{formatPrice(price)} <Text style={{ textDecorationLine: 'underline' }}>đ</Text></Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    Itemcontainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
        underlayColor: 'grey'
    },
    InfoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    PriceContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 11
    },
    pinkText: {
        color: '#ef506b',
        fontWeight: 'bold'
    },
    fab: {
        position: 'absolute',
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: '#ef506b',
        borderRadius: 50,
    },
});
export default Transaction;