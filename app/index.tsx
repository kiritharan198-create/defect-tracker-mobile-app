// app/index.js
import { router, useNavigation } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../src/firebase";

export default function LoginScreen() {
    const [employeeId, setEmployeeId] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmployeeId("");
            setCode("");
            setShowCode(false);
        });
        return unsubscribe;
    }, [navigation]);

    const handleLogin = async () => {
        if (!employeeId || !code) {
            Alert.alert("Error", "Please enter Employee ID and Assigned Code");
            return;
        }

        setLoading(true);
        try {
            const employeesRef = collection(db, "employees");
            const q = query(
                employeesRef,
                where("id", "==", employeeId.trim()),
                where("assignedCode", "==", code.trim())
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                // Pass both assignedCode and employeeId to the details page
                router.replace({ pathname: "/details", params: { assignedCode: code, employeeId: employeeId } });
            } else {
                Alert.alert("Error", "Invalid Employee ID or Assigned Code");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong");
        } finally {
            setLoading(false);
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Assigned Code"
                    value={code}
                    onChangeText={setCode}
                    secureTextEntry={!showCode}
                />
                <TouchableOpacity onPress={() => setShowCode(!showCode)} style={{ marginLeft: 8 }}>
                    <Text style={{ fontWeight: "bold" }}>{showCode ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>
            {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : <Button title="Login" onPress={handleLogin} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f0f8ff" },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: "#fff" },
});