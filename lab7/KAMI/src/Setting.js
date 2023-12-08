import {React,useEffect} from 'react';
import { BottomNavigation, Text, Icon, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Setting({ navigation, setTrigger }) {
    clearAll = async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            // clear error
        }
    };

    const storeData = async value => {
        try {
            await AsyncStorage.setItem('logined', value);
        } catch (e) {
            // saving error
        }
    };

    useEffect(() => {
        clearAll();
    }, [setTrigger]);

    return (
        <Button
            style={{ margin: 10, borderRadius: 7 }}
            buttonColor="#ef506b"
            mode="elevated"
            onPress={async () => {
                await storeData('false');
                await setTrigger(prev => !prev);
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </Button>
    );
}

export default Setting;
