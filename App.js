// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './index'; // or wherever your LoginScreen is located
import EmployeeDetailsScreen from './EmployeeDetailsScreen'; // Make sure this path is correct

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={EmployeeDetailsScreen} options={{ title: 'Employee Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}