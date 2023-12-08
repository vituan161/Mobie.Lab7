/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/Login';
import MainNavigation from './src/MainNavigation';
import {MenuProvider} from 'react-native-popup-menu';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [logined, setLogined] = useState("");
  const [trigger, setTrigger] = useState(false);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('logined');
      if (value !== null) {
        setLogined(value);
      }else{
        console.log("no value");
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  },[trigger]);

  if (logined == 'true') {
    return (
      <SafeAreaProvider>
        <MenuProvider>
          <MainNavigation setTrigger={setTrigger} />
        </MenuProvider>
      </SafeAreaProvider>
    );
  } else return <Login setTrigger={setTrigger}/>;
};

export default App;
