import React, { useEffect,useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Icon } from 'react-native-paper'
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function ServiceDetail({ navigation, route }) {
    const { item } = route.params;
    const [detail, setDetail] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getService();
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

    function getService() {
        const axios = require('axios').default;
        axios.get('https://kami-backend-5rs0.onrender.com/services/'+item._id)
            .then(function (response) {
                setDetail(response.data);
                //console.log(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function deleteService() {
        const axios = require('axios').default;
        axios.delete('https://kami-backend-5rs0.onrender.com/services/' + item._id)
            .then(function (response) {
                navigation.goBack();
                Alert.alert("Deleted successfully");
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const AlertDelete = () => {
        Alert.alert(
            "Warning",
            "Are you sure you want to remove this service? This operation cannot be undone.",
            [
                {
                    text: "DELETE",
                    onPress: () => deleteService(),
                },
                {
                    text: "CANCEL",
                    onPress: () => console.log("Cancel Pressed"),
                }
            ]
        )
    }

    const MenuComponent = () => {
        return (
            <Menu>
                <MenuTrigger>
                    <Icon
                        source="dots-vertical"
                        size={25}
                        color="white"
                    />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => navigation.navigate('EditService', { item })}>
                        <Text>Edit</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => AlertDelete()}>
                        <Text>Delete</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        );
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
        return formattedDate.replace(',', '');
    }

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title} >Service name: </Text>
                <Text>{detail.name}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Price: </Text>
                <Text>{detail.price} đ</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Creator: </Text>
                <Text>{detail.user.name}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Time: </Text>
                <Text>{formatDate(detail.createdAt)}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Final update: </Text>
                <Text>{formatDate(detail.updatedAt)}</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 5,
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
    },
});

export default ServiceDetail;