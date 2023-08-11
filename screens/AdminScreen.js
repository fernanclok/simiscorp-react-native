import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome'; 

const Drawer = createDrawerNavigator();

const AdminScreen = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
        <Drawer.Screen name="Administrators" component={AdminHomeScreen} />
        {/* Agrega más pantallas aquí */}
    </Drawer.Navigator>
  );
};

const AdminHomeScreen = () => {
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const responseAdmin = await fetch(
          "http://192.168.1.72:9000/api/administradores"
        );
        const jsonDataAdmin = await responseAdmin.json();
        setAdminData(jsonDataAdmin);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAdminData();
  }, []);

  const keyExtractorAdmin = (item) => item.id;

  const renderRowAdmin = ({ item }) => {
    return (
      <View style={styles.row} key={item.id}>
        <Text style={styles.column}>{item.nombre}</Text>
        <Text style={styles.column}>{item.apellPaterno}</Text>
        <Text style={styles.column}>{item.correo}</Text>
      </View>
    );
  };

  const renderCard = (title, description, age, collage) => (
    <View style={styles.containerCard}>
      <View style={styles.card}>
        <Text style={styles.titleCard}>{title}</Text>
        <Text style={styles.description}>Position: {description}</Text>
        <Text style={styles.description}>Age: {age}</Text>
        <Text style={styles.description}>Collague: {collage}</Text>
        <Text style={styles.description}>Social Media</Text>
        <View style={styles.socialMediaIcons}>
          <Icon name="facebook" size={30} color="#fff" style={styles.socialMediaIcon} />
          <Icon name="twitter" size={30} color="#fff" style={styles.socialMediaIcon} />
          <Icon name="instagram" size={30} color="#fff" style={styles.socialMediaIcon} />
        </View>
      </View>
    </View>
  );
    

  return (
    <FlatList
      data={adminData}
      renderItem={renderRowAdmin}
      keyExtractor={keyExtractorAdmin}
      ListHeaderComponent={() => (
        <View style={styles.container}>
          <Text style={styles.title}>Table of administrators</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerColumn}>nombre</Text>
            <Text style={styles.headerColumn}>apellPaterno</Text>
            <Text style={styles.headerColumn}>correo</Text>
          </View>
        </View>
      )}
      ListFooterComponent={() => (
        <>
          {renderCard('Fernando Medina', 'Programador', 19, 'Universidad Tecnologica de Tijuana')}
          {renderCard('Giovanni Pliego', 'Programador', 20, 'Universidad Tecnologica de Tijuana')}
          {renderCard('Jesus Cardenas', 'Programador', 19, 'Universidad Tecnologica de Tijuana')}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f0f0f0", // Color de fondo para la fila de encabezados
  },
  headerColumn: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold", // Fuente en negrita para los encabezados
  },
  tableContainer: {
    marginBottom: 16,
  },
  tableSpacing: {
    height: 39,
  },
  containerCard: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#023E8A',
    width: 350,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffff',
    borderRadius: 16,
  },
  titleCard: {
    color: '#ffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    color: '#ffff',
  },
  socialMediaIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialMediaIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});
export default AdminScreen;
