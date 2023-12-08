
import React from 'react';
import { BottomNavigation, Text, Icon } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Service/Home';
import ServiceDetail from './Service/ServiceDetail';
import AddService from './Service/AddService';
import Customer from './Customer/Customer';
import { TouchableOpacity } from 'react-native';
import EditService from './Service/EditService';
import AddCustomer from './Customer/AddCustomer';
import Setting from './Setting';
import Transaction from './Transaction/Transaction';
import TransactionDetail from './Transaction/TransactionDetail';
import CustomerDetail from './Customer/CustomerDetail';
import EditCustomer from './Customer/EditCustomer';
import AddTransaction from './Transaction/AddTransaction';

function MainNavigation({ setTrigger }) {
    const HomeRoute = () => {
        const HomeStack = createNativeStackNavigator();
        return (
            <NavigationContainer>
                <HomeStack.Navigator
                    initialRouteName='Home'
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#ef506b',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <HomeStack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <HomeStack.Screen
                        name="ServiceDetail"
                        component={ServiceDetail}
                        options={{
                            title: 'Service detail',
                            headerRight: () => (
                                <TouchableOpacity title="options" />
                            ),
                        }}
                    />
                    <HomeStack.Screen
                        name="AddService"
                        component={AddService}
                        options={{ title: 'Add Service' }}
                    />
                    <HomeStack.Screen
                        name="EditService"
                        component={EditService}
                        options={{ title: 'Edit Service' }}
                    />
                </HomeStack.Navigator>
            </NavigationContainer>
        );
    }

    const TransactionRoute = () => {
        const TransactionStack = createNativeStackNavigator();
        return (
            <NavigationContainer>
                <TransactionStack.Navigator
                    initialRouteName='Transaction'
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#ef506b',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <TransactionStack.Screen
                        name="Transaction"
                        component={Transaction}
                        options={{ title: 'Transaction' }}
                    />
                    <TransactionStack.Screen
                        name="TransactionDetail"
                        component={TransactionDetail}
                        options={{ title: 'Transaction Detail' }}
                    />
                    <TransactionStack.Screen
                        name="AddTransaction"
                        component={AddTransaction}
                        options={{ title: 'Add Transaction' }}
                    />
                </TransactionStack.Navigator>
            </NavigationContainer>
        );
    }

    const CustomerRoute = () => {
        const CustomerStack = createNativeStackNavigator();
        return (
            <NavigationContainer>
                <CustomerStack.Navigator
                    initialRouteName='Customer'
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#ef506b',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <CustomerStack.Screen
                        name="Customer"
                        component={Customer}
                        options={{ title: 'Customer' }}
                    />
                    <CustomerStack.Screen
                        name="AddCustomer"
                        component={AddCustomer}
                        options={{ title: 'Add Customer' }}
                    />
                    <CustomerStack.Screen
                        name="EditCustomer"
                        component={EditCustomer}
                        options={{ title: 'Edit Customer' }}
                    />
                    <CustomerStack.Screen
                        name="CustomerDetail"
                        component={CustomerDetail}
                        options={{ title: 'Customer Detail' }}
                    />
                </CustomerStack.Navigator>
            </NavigationContainer>
        );
    };

    const SettingRoute = () => {
        const SettingStack = createNativeStackNavigator();
        return (
            <NavigationContainer>
                <SettingStack.Navigator
                    initialRouteName='Setting'
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#ef506b',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <SettingStack.Screen
                        name="Setting"
                        options={{ title: 'Setting' }}
                    >
                        {(props) => <Setting {...props} setTrigger={setTrigger} />}
                    </SettingStack.Screen>

                </SettingStack.Navigator>
            </NavigationContainer>
        );

    };

    const MyComponent = () => {
        const [index, setIndex] = React.useState(0);
        const [routes] = React.useState([
            { key: 'home', title: 'Home', focusedIcon: 'home' },
            { key: 'transaction', title: 'Transaction', focusedIcon: 'cash' },
            { key: 'customer', title: 'Customer', focusedIcon: 'account' },
            { key: 'setting', title: 'Setting', focusedIcon: 'cog' },
        ]);

        const renderScene = BottomNavigation.SceneMap({
            home: HomeRoute,
            transaction: TransactionRoute,
            customer: CustomerRoute,
            setting: SettingRoute,
        });

        return (
            <BottomNavigation
                theme={{ colors: { secondaryContainer: 'white' } }}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                compact={true}
                activeColor='#ef506b'
                renderIcon={({ route, focused }) => (
                    <Icon
                        source={route.focusedIcon}
                        color={focused ? '#ef506b' : 'gray'}
                        size={30}
                    />
                )}
                barStyle={{ backgroundColor: 'white', borderTopColor: 'lightgrey', borderTopWidth: 1 }}
            />
        );
    }

    return (
        <MyComponent />
    );
}
export default MainNavigation;