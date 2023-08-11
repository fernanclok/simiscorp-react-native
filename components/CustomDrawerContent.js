import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomDrawerContent = ({ navigation }) => {
  const handleLogout = () => {
    // Aquí puedo implementar la lógica para cerrar sesión
    // Por ejemplo, restablecer el estado global del usuario, eliminar tokens de autenticación, etc.
    // Luego, navega a la pantalla de inicio de sesión
    navigation.navigate('LoginScreen');
  };

  const handdleGoToAdmins = () => {
    navigation.navigate('AdminScreen');
  }

  const handdleGoToValues = () => {
  navigation.navigate('ValuesScreen');
  }

  const handdleGoToHome = () => {
    navigation.navigate('HomeScreen');
    }

  return (
    <View style={styles.drawerContent}>
      <TouchableOpacity style={styles.menuItem} onPress={handdleGoToHome}>
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handdleGoToValues}>
        <Text style={styles.drawerItemText}>
          <Icon size={24} color="#ffff" style={styles.icon}/>
          Dasboards
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handdleGoToAdmins}>
        <Text style={styles.drawerItemText}>
          <Icon size={24} color="#ffff" style={styles.icon} />
          Admins
        </Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
        <Text style={styles.drawerItemText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#023e8a', // Fondo del menú lateral
  },
  menuItem: {
    marginTop: 16, // Espacio entre los elementos del menú
  },
  drawerItemText: {
    fontSize: 24,
    color: '#ffff',
    marginTop: 16,
  },
  spacer: {
    flex: 1, // El spacer ocupa el espacio restante, empujando el botón hacia abajo
  },
  });

export default CustomDrawerContent;
