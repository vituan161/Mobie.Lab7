import { React, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Icon, FAB } from 'react-native-paper';
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';

keyExtractor = ({ _id }) => _id;

function Customer({ navigation }) {
    const [customer, setCustomer] = useState([]);

    const isFocused = useIsFocused();

    function getCustomer() {
        axios.get('https://kami-backend-5rs0.onrender.com/customers')
            .then(function (response) {
                setCustomer(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        if (isFocused)
            getCustomer();
    }, [isFocused]);

    const renderCustomer = ({ item }) => {
        const { name, phone, loyalty, totalSpent } = item;
        return <TouchableHighlight style={{margin:5}} underlayColor={'lightgrey'} onPress={() => navigation.navigate('CustomerDetail', {item})}>
            <View style={styles.Itemcontainer}>
                <View style={styles.InfoContainer}>
                    <Text>Customer: <Text style={styles.text}>{name}</Text></Text>
                    <Text>Phone: <Text style={styles.text}>{phone}</Text></Text>
                    <Text>
                        Total money:
                        <Text style={styles.pinkText}> {totalSpent} <Text style={{ textDecorationLine: 'underline' }}>đ</Text></Text>
                    </Text>
                </View>
                <View style={styles.IconContainer}>
                    <Icon
                        source="chess-queen"
                        color="#ef506b"
                        size={25}
                    />
                    <Text style={styles.pinkText}>{loyalty == "member" ? "Member" : "Guest"}</Text>
                </View>
            </View>
        </TouchableHighlight>
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={customer}
                renderItem={renderCustomer}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
            <FAB
                icon="plus"
                color="white"
                style={styles.fab}
                mode="flat"
                size="small"
                onPress={() => navigation.navigate('AddCustomer')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Itemcontainer: {
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5,
    },
    InfoContainer: {
        flex: 5,
    },
    IconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
    },
    text: {
        fontWeight: 'bold',
        color: 'black',
    },
    pinkText: {
        color: '#ef506b',
        fontWeight: 'bold',
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
export default Customer;