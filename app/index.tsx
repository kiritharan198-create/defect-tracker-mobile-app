import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { db } from "../src/firebase";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [code, setCode] = useState("");
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!employeeId || !code) {
      Alert.alert("Error", "Please enter Employee ID and Assigned Code");
      return;
    }

    setLoading(true);
    try {
      const employeesRef = collection(db, "employees");
      const employeeQuery = query(
        employeesRef,
        where("id", "==", employeeId),
        where("assignedCode", "==", code)
      );

      const employeeSnapshot = await getDocs(employeeQuery);

      if (!employeeSnapshot.empty) {
        const assignmentsRef = collection(db, "assignments");
        const assignmentQuery = query(
          assignmentsRef,
          where("code", "==", code)
        );
        const assignmentSnapshot = await getDocs(assignmentQuery);

        if (!assignmentSnapshot.empty) {
          setAssignment(assignmentSnapshot.docs[0].data());
          setIsLoggedIn(true);
        } else {
          Alert.alert("Error", "Assignment details not found.");
        }
      } else {
        Alert.alert("❌ Error", "Invalid Employee ID or Assigned Code");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong while logging in");
    } finally {
      setLoading(false);
    }
  };

  const renderLoginScreen = () => (
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
        secureTextEntry={true}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );

  const renderDetailsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Your Assignment</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Project ID:</Text>
        <Text style={styles.value}>{assignment.projectId}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{assignment.role}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Assigned Code:</Text>
        <Text style={styles.value}>{assignment.code}</Text>
      </View>
      <Button title="Logout" onPress={() => setIsLoggedIn(false)} />
    </View>
  );

  return isLoggedIn ? renderDetailsScreen() : renderLoginScreen();
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  infoBox: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
});