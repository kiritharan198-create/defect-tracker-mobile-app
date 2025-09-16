// index.tsx
import { useNavigation } from '@react-navigation/native'; // Import the hook
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../src/firebase";

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [code, setCode] = useState("");
  const navigation = useNavigation(); // Get the navigation object

  const handleLogin = async () => {
    if (!employeeId || !code) {
      Alert.alert("Error", "Please enter Employee ID and Assigned Code");
      return;
    }

    try {
      const employeesRef = collection(db, "employees");
      const q = query(
        employeesRef,
        where("id", "==", employeeId),
        where("assignedCode", "==", code)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Navigate to the 'Details' screen and pass the necessary data
        navigation.navigate('Details', { employeeId, assignedCode: code });
      } else {
        Alert.alert("❌ Error", "Invalid Employee ID or Assigned Code");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong while logging in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Assigned Code"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});