import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      // Hacemos una solicitud POST a la API para verificar las credenciales del usuario
      const response = await fetch('http://192.168.1.72:9000/api/administradores/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          password: password,
        }),
      });
  
      const data = await response.json();

      if (data.success) {
        // Si las credenciales son válidas, el usuario se ha autenticado correctamente
        navigation.replace('HomeScreen'); // Navega a la siguiente pantalla (HomeScreen)
      } else {
        // Si las credenciales no son válidas, muestra un mensaje de error
        console.log('Error en la autenticación:', data.message);
        Alert.alert('Error', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      // Muestra un mensaje de error si algo sale mal en la solicitud
      Alert.alert('Error', 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      {/* <Text h4 style={styles.title}>Log in</Text> */}
      <Input
        placeholder="Email"
        placeholderTextColor="#ffff"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputTextContainer}
      />
      <Input
        placeholder="Password"
        placeholderTextColor="#ffff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputTextContainer}
      />
      <Button title="Log in" onPress={handleLogin} containerStyle={styles.buttonContainer} buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#001d3d',
  },
  logo: {
    width: "60%",
    height: 50,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffff',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#0077B6',
    borderRadius: 15,
    height: 50,
    width: "89%",
    paddingHorizontal: 10,
    paddingLeft: 10,
    paddingTop: 5,
  },
  inputTextContainer: {
    borderBottomWidth: 0,
    justifyContent: 'center', // Centramos verticalmente el texto del input
  },
  inputText: {
    color: '#ffff',
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 24,
    width: '60%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#014f86',
    borderRadius: 15,
  },
});

export default LoginScreen;
