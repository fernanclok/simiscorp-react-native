import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

const Drawer = createDrawerNavigator();

const ValuesScreen = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="DASHBOARDS" component={ValuesHomeScreen} />
    </Drawer.Navigator>
  );
};

const ValuesHomeScreen = () => {
  const [realtimeData, setRealtimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chartResponse = await axios.get(
          "http://192.168.1.72:9000/api/valores/5"
        );
        setRealtimeData(chartResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  const filteredRealtimeData = realtimeData.filter(item => !isNaN(item.T) && !isNaN(item.RH) && !isNaN(item.HG));
  const reversedRealtimeData = filteredRealtimeData.reverse();

  if (reversedRealtimeData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.mensaje}>No chart data to display!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Text style={styles.mensaje}>Note: the data in these graphs are the last 5 records</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Temperature</Text>
        <View style={{ alignItems: "center" }}>
          <LineChart
            data={{
              labels: reversedRealtimeData.map((item) => formatTime(item.timestamp)),
              datasets: [
                {
                  data: reversedRealtimeData.map((item) => item.T),
                },
              ],
            }}
            width={Dimensions.get("window").width - 50}
            height={200}
            chartConfig={{
              backgroundColor: "#f0f0f0",
              backgroundGradientFrom: "#f0f0f0",
              backgroundGradientTo: "#f0f0f0",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
          />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Humidity</Text>
        <View style={{ alignItems: "center" }}>
          <LineChart
            data={{
              labels: reversedRealtimeData.map((item) => formatTime(item.timestamp)),
              datasets: [
                {
                  data: reversedRealtimeData.map((item) => item.RH),
                },
              ],
            }}
            width={Dimensions.get("window").width - 50}
            height={200}
            chartConfig={{
              backgroundColor: "#f0f0f0",
              backgroundGradientFrom: "#f0f0f0",
              backgroundGradientTo: "#f0f0f0",
              decimalPlaces: 0,
              color: (opacity = 0.8) => `rgba(8, 57, 194, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
          />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Air quality</Text>
        <View style={{ alignItems: "center" }}>
          <LineChart
            data={{
              labels: reversedRealtimeData.map((item) => formatTime(item.timestamp)),
              datasets: [
                {
                  data: reversedRealtimeData.map((item) => item.HG),
                },
              ],
            }}
            width={Dimensions.get("window").width - 50}
            height={200}
            chartConfig={{
              backgroundColor: "#f0f0f0",
              backgroundGradientFrom: "#f0f0f0",
              backgroundGradientTo: "#f0f0f0",
              decimalPlaces: 0,
              color: (opacity = 0.8) => `rgba(8, 57, 194, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
          />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
    marginTop: 8,
  },
  mensaje: {
    textAlign: "center",
  }
});

export default ValuesScreen;
