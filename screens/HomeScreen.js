import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const Drawer = createDrawerNavigator();

const HomeScreen = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="HOME" component={HomeScreenContent} />
    </Drawer.Navigator>
  );
};

const MedicamentosTable = () => {
  const [medicamentosData, setMedicamentosData] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    categoria: "",
    nombre: "",
    nombre_cientifico: "",
    formula: "",
    cantidad: "",
    fecha_caducidad: "",
  });
  const [isModalMedicamento, setIsModalMedicamento] = useState(false);
  const [isModalInsert, setIsModalInsert] = useState(false);

  const fetchMedicamentosData = async () => {
    try {
      const responseMedicamento = await fetch(
        "http://192.168.1.72:9000/api/medicamentos"
      );
      const jsonDataMedicamento = await responseMedicamento.json();
      setMedicamentosData(jsonDataMedicamento);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  const insertMedicamento = async () => {
    try {
      const { _id, ...formData } = form;

      const response = await fetch("http://192.168.1.72:9000/api/medicamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();
      console.log("Medicamento insertado:", jsonData);
      Alert.alert('Insert', 'Medicine inserted successfully');
      fetchMedicamentosData();
      setIsModalInsert(false); // Cerrar el modal después de insertar
    } catch (error) {
      console.log("Error al insertar el medicamento:", error);
      Alert.alert('Error', 'Failed to insert medicine');
    }
  };

  const deleteMedicamento = async (item) => {
    try {
      const response = await fetch(
        `http://192.168.1.72:9000/api/medicamentos/${item._id}`,
        {
          method: "DELETE",
        }
      );
      const jsonData = await response.json();
      console.log("Medicamento eliminado:", jsonData);
      Alert.alert('Delete', 'Medicine deleted successfully');
      fetchMedicamentosData(); // Refresh the medicamentos list after deletion
    } catch (error) {
      console.log("Error al eliminar el medicamento:", error);
      Alert.alert('Delete', 'Failed to delete medicine');
    }
  };

  const updateMedicamento = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.72:9000/api/medicamentos/${form._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const jsonData = await response.json();
      console.log("Medicamento actualizado:", jsonData);
      Alert.alert('Update', 'Medicine updated successfully');
      fetchMedicamentosData();
      setIsModalMedicamento(false); // Cerrar el modal después de actualizar
    } catch (error) {
      console.log("Error al actualizar el medicamento:", error);
      Alert.alert('Update', 'Failed to update medicine');
    }
  };

  const handleEditMedicamento = (item) => {
    setForm(item);
    setIsModalMedicamento(true);
  };

  const handleChange = (name, values) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: values,
    }));
  };

  const toggleModalInsert = () => {
    setIsModalInsert(!isModalInsert);
    setForm({
      _id: "",
      categoria: "",
      nombre: "",
      nombre_cientifico: "",
      formula: "",
      cantidad: "",
      fecha_caducidad: "",
    });
  };

  useEffect(() => {
    fetchMedicamentosData();
  }, []);

  const renderRowMedicamentos = ({ item }) => {
    const categoriasTexto = item.categoria.join(", ");
    return (
      <View style={styles.row} key={item._id}>
        <Text style={styles.column}>{categoriasTexto}</Text>
        <Text style={styles.column}>{item.nombre}</Text>
        <Text style={styles.column}>{item.formula}</Text>
        <Text style={styles.column}>{item.cantidad}</Text>
        <Text style={styles.column}>{item.fecha_caducidad}</Text>
        <View style={styles.actionsColumn}>
          <View style={styles.buttonContainer}>
            {/* Botón de editar */}
            <TouchableOpacity onPress={() => handleEditMedicamento(item)}>
              <Icon name="edit" size={30} color="#007BFF" />
            </TouchableOpacity>

            {/* Botón de eliminar */}
            <TouchableOpacity onPress={() => deleteMedicamento(item)}>
              <Icon name="trash-o" size={30} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Renderizado de la tabla de medicamentos */}
        <Text style={styles.title}>Table of medicine</Text>
        <Button
          style={styles.insertButton}
          title="Insert"
          onPress={toggleModalInsert}
        />
        <View style={styles.headerRow}>
          <Text style={styles.headerColumn}>Categoría</Text>
          <Text style={styles.headerColumn}>Nombre</Text>
          <Text style={styles.headerColumn}>Fórmula</Text>
          <Text style={styles.headerColumn}>Cantidad</Text>
          <Text style={styles.headerColumn}>Fecha de Caducidad</Text>
          <Text style={styles.headerColumn}>Acciones</Text>
        </View>
        <FlatList
          data={medicamentosData}
          renderItem={renderRowMedicamentos}
          keyExtractor={(item) => item._id}
        />
      </View>
      {/* Renderizado del modal de edición */}
      <Modal visible={isModalMedicamento} animationType="fade">
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContentMedicineUpdate}>
            <Text style={styles.modalTitle}>Edit Medicine</Text>
            {/* Campos del formulario de actualización */}
            <Text style={styles.modalnames}>ID</Text>
            <TextInput
              style={styles.modalinput}
              value={form._id}
              onChangeText={(value) => handleChange("_id", value)}
              editable={false}
            />
            <Text style={styles.modalnames}>Category</Text>
            <TextInput
              style={styles.modalinput}
              value={form.categoria}
              onChangeText={(value) => handleChange("categoria", value)}
            />
            <Text style={styles.modalnames}>Name</Text>
            <TextInput
              style={styles.modalinput}
              value={form.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />
            <Text style={styles.modalnames}>Cientific name</Text>
            <TextInput
              style={styles.modalinput}
              value={form.nombre_cientifico}
              onChangeText={(value) => handleChange("nombre_cientifico", value)}
            />
            <Text style={styles.modalnames}>Formula</Text>
            <TextInput
              style={styles.modalinput}
              value={form.formula}
              onChangeText={(value) => handleChange("formula", value)}
            />
            <Text style={styles.modalnames}>Stock</Text>
            <TextInput
              style={styles.modalinput}
              value={form.cantidad}
              keyboardType="numeric"
              onChangeText={(value) => handleChange("cantidad", value)}
            />
            <Text style={styles.modalnames}>Date of expire</Text>
            <TextInput
              style={styles.modalinput}
              value={form.fecha_caducidad}
              onChangeText={(value) => handleChange("fecha_caducidad", value)}
            />
            {/* Botón para guardar los cambios */}
            <TouchableOpacity
              style={styles.modalButtonInsert}
              title="Guardar"
              onPress={updateMedicamento}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* Botón para cerrar el modal */}
            <TouchableOpacity
              style={styles.modalButtonDelete}
              title="Cerrar"
              onPress={() => setIsModalMedicamento(false)}
            >
              <Text style={styles.buttonText}>close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Renderizado del modal de inserción */}
      <Modal visible={isModalInsert} animationType="fade">
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContentMedicine}>
            <Text style={styles.modalTitle}>Insert new medicine</Text>
            {/* Campos del formulario de inserción */}
            <Text style={styles.modalnames}>Category</Text>
            <TextInput
              style={styles.modalinput}
              value={form.categoria}
              onChangeText={(value) => handleChange("categoria", value)}
            />
            <Text style={styles.modalnames}>Name</Text>
            <TextInput
              style={styles.modalinput}
              value={form.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />
            <Text style={styles.modalnames}>Cientific name</Text>
            <TextInput
              style={styles.modalinput}
              value={form.nombre_cientifico}
              onChangeText={(value) => handleChange("nombre_cientifico", value)}
            />
            <Text style={styles.modalnames}>Formula</Text>
            <TextInput
              style={styles.modalinput}
              value={form.formula}
              onChangeText={(value) => handleChange("formula", value)}
            />
            <Text style={styles.modalnames}>Stock</Text>
            <TextInput
              style={styles.modalinput}
              value={form.cantidad}
              keyboardType="numeric"
              onChangeText={(value) => handleChange("cantidad", value)}
            />
            <Text style={styles.modalnames}>date of expire</Text>
            <TextInput
              style={styles.modalinput}
              value={form.fecha_caducidad}
              onChangeText={(value) => handleChange("fecha_caducidad", value)}
            />
            {/* Botón para guardar el nuevo medicamento */}
            <TouchableOpacity
              style={styles.modalButtonInsert}
              title="Guardar"
              onPress={insertMedicamento}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* Botón para cerrar el modal de inserción */}
            <TouchableOpacity
              style={styles.modalButtonDelete}
              title="Cerrar"
              onPress={() => setIsModalInsert(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const ClientesTable = () => {
  const [clientesData, setclientesData] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    empresa: "",
    zona_asignada: "",
  });
  const [isModalClientes, setIsModalClientes] = useState(false);
  const [isModalInsert, setIsModalInsert] = useState(false);

  const fetchClientesData = async () => {
    try {
      const responseClientes = await fetch(
        "http://192.168.1.72:9000/api/clientes"
      );
      const jsonDataClientes = await responseClientes.json();
      setclientesData(jsonDataClientes);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  const insertClientes = async () => {
    try {
      const { _id, ...formData } = form;

      const response = await fetch("http://192.168.1.72:9000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();
      console.log("cliente insertado:", jsonData);
      Alert.alert('Insert', 'Client inserted successfully');
      fetchClientesData();
      setIsModalInsert(false);
    } catch (error) {
      console.log("Error al insertar el cliente:", error);
      Alert.alert('Insert', 'Failed to insert client');
    }
  };

  const deleteCliente = async (item) => {
    try {
      const response = await fetch(
        `http://192.168.1.72:9000/api/clientes/${item._id}`,
        {
          method: "DELETE",
        }
      );
      const jsonData = await response.json();
      console.log("cliente eliminado:", jsonData);
      Alert.alert('Delete', 'Client deleted successfully');
      fetchClientesData();
    } catch (error) {
      console.log("Error al eliminar el cliente:", error);
      Alert.alert('Delete', 'Failed to delete client');
    }
  };

  const handleChange = (name, values) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: values,
    }));
  };

  const toggleModalInsert = () => {
    setIsModalInsert(!isModalInsert);
  };

  useEffect(() => {
    fetchClientesData();
  }, []);

  const renderRowClientes = ({ item }) => {
    return (
      <View style={styles.row} key={item._id}>
        <Text style={styles.column}>{item.empresa}</Text>
        <Text style={styles.column}>{item.zona_asignada}</Text>
        <View style={styles.actionsColumn}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => deleteCliente(item)}>
              <Icon name="trash-o" size={30} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Renderizado de la tabla de clientes */}
        <Text style={styles.title}>Table of customers</Text>
        <Button
          style={styles.insertButton}
          title="Insert"
          onPress={toggleModalInsert}
        />
        <View style={styles.headerRow}>
          <Text style={styles.headerColumn}>empresa</Text>
          <Text style={styles.headerColumn}>zona_asignada</Text>
          <Text style={styles.headerColumn}>Acciones</Text>
        </View>
        <FlatList
          data={clientesData}
          renderItem={renderRowClientes}
          keyExtractor={(item) => item._id}
        />
      </View>

      {/* Renderizado del modal de inserción */}
      <Modal visible={isModalInsert} animationType="fade">
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Insert new client</Text>
            {/* Campos del formulario de inserción */}
            <Text style={styles.modalnames}>Company</Text>
            <TextInput
              style={styles.modalinput}
              value={form.empresa}
              onChangeText={(value) => handleChange("empresa", value)}
              placeholder="empresa"
            />
            <Text style={styles.modalnames}>zone asigned</Text>
            <TextInput
              style={styles.modalinput}
              value={form.zona_asignada}
              onChangeText={(value) => handleChange("zona_asignada", value)}
              placeholder="zona asignada"
            />
            {/* Botón para guardar el nuevo medicamento */}
            <TouchableOpacity
              style={styles.modalButtonInsert}
              title="Guardar"
              onPress={insertClientes}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* Botón para cerrar el modal de inserción */}
            <TouchableOpacity
              style={styles.modalButtonDelete}
              title="Cerrar"
              onPress={() => setIsModalInsert(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const CategoriasTable = () => {
  const [categoriasData, setcategoriasData] = useState([]);
  const fetchCategoriasData = async () => {
    try {
      const responseCategorias = await fetch(
        "http://192.168.1.72:9000/api/categorias"
      );
      const jsonDataCategorias = await responseCategorias.json();
      setcategoriasData(jsonDataCategorias);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCategoriasData();
  }, []);

  const renderRowCategorias = ({ item }) => {
    return (
      <View style={styles.row} key={item._id}>
        <Text style={styles.column}>{item.nombre}</Text>
        <Text style={styles.column}>{item.descripcion}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Renderizado de la tabla de categorias */}
        <Text style={styles.title}>Table of categories</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerColumn}>Nombre</Text>
          <Text style={styles.headerColumn}>Descripcion</Text>
        </View>
        <FlatList
          data={categoriasData}
          renderItem={renderRowCategorias}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const CuartosTable = () => {
  const [cuartosData, setcuartosData] = useState([]);
  const fetchCuartosData = async () => {
    try {
      const responseCuartos = await fetch(
        "http://192.168.1.72:9000/api/cuartos"
      );
      const jsonDataCuartos = await responseCuartos.json();
      setcuartosData(jsonDataCuartos);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCuartosData();
  }, []);

  const renderRowCuartos = ({ item }) => {
    return (
      <View style={styles.row} key={item._id}>
        <Text style={styles.column}>{item.ID_cuarto}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Renderizado de la tabla de cuartos */}
        <Text style={styles.title}>Table of rooms</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerColumn}>ID_cuarto</Text>
        </View>
        <FlatList
          data={cuartosData}
          renderItem={renderRowCuartos}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const ZonasTable = () => {
  const [zonasData, setzonasData] = useState([]);
  const fetchZonasData = async () => {
    try {
      const responseZonas = await fetch("http://192.168.1.72:9000/api/zonas");
      const jsonDataZonas = await responseZonas.json();
      setzonasData(jsonDataZonas);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchZonasData();
  }, []);

  const renderRowZonas = ({ item }) => {
    const sensores = item.sensores.join(", ");
    return (
      <View style={styles.row} key={item._id}>
        <Text style={styles.column}>{item.cuarto}</Text>
        <Text style={styles.column}>{sensores}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Renderizado de la tabla de zonas */}
        <Text style={styles.title}>Table de zones</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerColumn}>Cuarto</Text>
          <Text style={styles.headerColumn}>Sensores</Text>
        </View>
        <FlatList
          data={zonasData}
          renderItem={renderRowZonas}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const SensoresTable = () => {
  const [sensoresData, setsensoresData] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    N_encargado: "",
    nombre: "",
    codigo: "",
  });
  const [isModalSensores, setIsModalSensores] = useState(false);
  const [isModalInsert, setIsModalInsert] = useState(false);

  const fetchSensoresData = async () => {
    try {
      const responseSensores = await fetch(
        "http://192.168.1.72:9000/api/sensores"
      );
      const jsonDataSensores = await responseSensores.json();
      setsensoresData(jsonDataSensores);
    } catch (error) {
      console.log("error fetching data:", error);
    }
  };

  const insertSensor = async () => {
    try {
      const { _id, ...formData } = form;

      const response = await fetch("http://192.168.1.72:9000/api/sensores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();
      console.log("sensor insertado:", jsonData);
      Alert.alert('Insert', 'Sensor inserted successfully');
      fetchSensoresData();
      setIsModalInsert(false);
    } catch (error) {
      console.log("Error al insertar el sensor:", error);
      Alert.alert('Insert', 'Failed to insert sensor');
    }
  };

  const deleteSensor = async (item) => {
    try {
      const response = await fetch(
        `http://192.168.1.72:9000/api/sensores/${item._id}`,
        {
          method: "DELETE",
        }
      );
      const jsonData = await response.json();
      console.log("sensor eliminado:", jsonData);
      Alert.alert('Delete', 'Sensor deleted successfully');
      fetchSensoresData();
    } catch (error) {
      console.log("Error al eliminar el sensor:", error);
      Alert.alert('Delete', 'Failed to delete sensor');
    }
  };

  const updateSensor = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.72:9000/api/sensores/${form._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const jsonData = await response.json();
      console.log("sensor actualizado:", jsonData);
      Alert.alert('Update', 'Sensor updated successfully');
      fetchSensoresData();
      setIsModalSensores(false);
    } catch (error) {
      console.log("Error al actualizar el sensor:", error);
      Alert.alert('Update', 'Failed to update sensor');
    }
  };

  const handleEditSensores = (item) => {
    setForm(item);
    setIsModalSensores(true);
  };

  const handleChange = (name, value) => {
    setForm((prevState) => ({
      ...prevState,
      [name]:
        name === "_id" || name === "N_encargado" ? value.toString() : value,
    }));
  };

  const toggleModalInsert = () => {
    setIsModalInsert(!isModalInsert);
    setForm({
      _id: "",
      N_encargado: "",
      nombre: "",
      codigo: "",
    });
  };

  useEffect(() => {
    fetchSensoresData();
  }, []);

  const renderRowSensores = ({ item }) => {
    return (
      <View style={styles.row} key={item._id}>
        <Text style={styles.column}>{item.N_encargado}</Text>
        <Text style={styles.column}>{item.nombre}</Text>
        <Text style={styles.column}>{item.codigo}</Text>
        <View style={styles.actionsColumn}>
          <View style={styles.buttonContainer}>
            {/* Botón de editar */}
            <TouchableOpacity onPress={() => handleEditSensores(item)}>
              <Icon name="edit" size={30} color="#007BFF" />
            </TouchableOpacity>

            {/* Botón de eliminar */}
            <TouchableOpacity onPress={() => deleteSensor(item)}>
              <Icon name="trash-o" size={30} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Renderizado de la tabla de medicamentos */}
        <Text style={styles.title}>Table de sensors</Text>
        <Button
          style={styles.insertButton}
          title="Insert"
          onPress={toggleModalInsert}
        />
        <View style={styles.headerRow}>
          <Text style={styles.headerColumn}>N_encargado</Text>
          <Text style={styles.headerColumn}>Nombre</Text>
          <Text style={styles.headerColumn}>codigo</Text>
          <Text style={styles.headerColumn}>Acciones</Text>
        </View>
        <FlatList
          data={sensoresData}
          renderItem={renderRowSensores}
          keyExtractor={(item) => item._id}
        />
      </View>
      {/* Renderizado del modal de edición */}
      <Modal visible={isModalSensores} animationType="fade">
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContentSensors}>
            <Text style={styles.modalTitle}>Edit sensors</Text>
            {/* Campos del formulario de actualización */}
            <Text style={styles.modalnames}>ID</Text>
            <TextInput
              style={styles.modalinput}
              value={form._id}
              onChangeText={(value) => handleChange("_id", value)}
              editable={false}
            />
            <Text style={styles.modalnames}>N_incharge</Text>
            <TextInput
              style={styles.modalinput}
              value={form.N_encargado}
              onChangeText={(value) => handleChange("N_encargado", value)}
            />
            <Text style={styles.modalnames}>Name</Text>
            <TextInput
              style={styles.modalinput}
              value={form.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />
            <Text style={styles.modalnames}>Code</Text>
            <TextInput
              style={styles.modalinput}
              value={form.codigo}
              onChangeText={(value) => handleChange("codigo", value)}
            />
            {/* Botón para guardar los cambios */}
            <TouchableOpacity
              style={styles.modalButtonInsert}
              title="Guardar"
              onPress={updateSensor}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* Botón para cerrar el modal */}
            <TouchableOpacity
              style={styles.modalButtonDelete}
              title="Cerrar"
              onPress={() => setIsModalSensores(false)}
            >
              <Text style={styles.buttonText}>close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Renderizado del modal de inserción */}
      <Modal visible={isModalInsert} animationType="fade">
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContentSensorsInsert}>
            <Text style={styles.modalTitle}>Insert new sensor</Text>
            {/* Campos del formulario de inserción */}
            <Text style={styles.modalnames}>N_incharge</Text>
            <TextInput
              style={styles.modalinput}
              value={form.N_encargado}
              onChangeText={(value) => handleChange("N_encargado", value)}
            />
            <Text style={styles.modalnames}>Name</Text>
            <TextInput
              style={styles.modalinput}
              value={form.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />
            <Text style={styles.modalnames}>Code</Text>
            <TextInput
              style={styles.modalinput}
              value={form.codigo}
              onChangeText={(value) => handleChange("codigo", value)}
            />
            {/* Botón para guardar el nuevo medicamento */}
            <TouchableOpacity
              style={styles.modalButtonInsert}
              title="Guardar"
              onPress={insertSensor}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* Botón para cerrar el modal de inserción */}
            <TouchableOpacity
              style={styles.modalButtonDelete}
              title="Cerrar"
              onPress={() => setIsModalInsert(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const HomeScreenContent = () => {
  return (
    <ScrollView>
      <MedicamentosTable />
      <ClientesTable />
      <CategoriasTable />
      <CuartosTable />
      <ZonasTable />
      <SensoresTable />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
    // marginTop: 460,
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
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    textAlign: "center",
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
  actionsColumn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    textAlign: "center",
    marginBottom: 5,
  },
  closeModalText: {
    paddingTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001d3d",
  },
  modalContentMedicine: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    height: 620,
    width: 300,
    margin: 20,
  },
  modalContentMedicineUpdate: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    height: 690,
    width: 300,
    margin: 20,
  },
  modalContentSensors: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    height: 460,
    width: 300,
    margin: 20,
  },
  modalContentSensorsInsert: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    height: 390,
    width: 300,
    margin: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    height: 330,
    width: 300,
    margin: 20,
  },
  modalTitle: {
    paddingTop: 16,
    paddingBottom: 10,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalnames: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
  modalinput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  modalButtonInsert: {
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: "#0077B6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtonDelete: {
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    backgroundColor: "#FF0000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#ffff",
  },
});

export default HomeScreen;
