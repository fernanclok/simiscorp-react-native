import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';
import ValuesScreen from './screens/ValuesScreen';

const Stack = createNativeStackNavigator();

// if (!__DEV__) {
//   console.log = () => {}; // Deshabilitar logs en producción
//   console.error = () => {}; // Deshabilitar errores en producción
// }


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="ValuesScreen" component={ValuesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
