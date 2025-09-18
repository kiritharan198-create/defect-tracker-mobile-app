// app/details.js
import { router, useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import { db } from "../src/firebase";

export default function EmployeeDetailsScreen() {
    const { assignedCode, employeeId } = useLocalSearchParams();
    const [assignment, setAssignment] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (!assignedCode || !employeeId) {
                    Alert.alert("Error", "Missing required information.");
                    setLoading(false);
                    return;
                }

                // Fetch the assignment details
                const assignmentsRef = collection(db, "assignments");
                const assignmentQuery = query(assignmentsRef, where("code", "==", assignedCode));
                const assignmentSnapshot = await getDocs(assignmentQuery);

                if (!assignmentSnapshot.empty) {
                    const foundAssignment = assignmentSnapshot.docs[0].data();
                    setAssignment(foundAssignment);

                    // Fetch the project details
                    const projectsRef = collection(db, "projects");
                    const projectQuery = query(projectsRef, where("id", "==", foundAssignment.projectId));
                    const projectSnapshot = await getDocs(projectQuery);

                    if (!projectSnapshot.empty) {
                        setProjectDetails(projectSnapshot.docs[0].data());
                    }

                    // Fetch the employee's name
                    const employeesRef = collection(db, "employees");
                    const employeeQuery = query(employeesRef, where("id", "==", employeeId));
                    const employeeSnapshot = await getDocs(employeeQuery);

                    if (!employeeSnapshot.empty) {
                        setEmployeeName(employeeSnapshot.docs[0].data().name);
                    }

                } else {
                    Alert.alert("Error", "Assignment not found.");
                }
            } catch (err) {
                console.error("Error fetching details:", err);
                Alert.alert("Error", "Could not fetch details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [assignedCode, employeeId]);

    const handleLogout = () => router.replace("/");

    if (loading) return <View style={styles.centered}><ActivityIndicator /></View>;
    if (!assignment) return <View style={styles.centered}><Text>No assignment found.</Text><Button title="Logout" onPress={handleLogout} /></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Assignment</Text>
            {/* Display the employee's name */}
            <View style={styles.infoBox}>
                <Text style={styles.label}>Employee Name:</Text>
                <Text style={styles.value}>{employeeName || "N/A"}</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.label}>Project Title:</Text>
                <Text style={styles.value}>{projectDetails?.title || "N/A"}</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.label}>Project Duration:</Text>
                <Text style={styles.value}>{projectDetails?.duration || "N/A"}</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.label}>Your Role:</Text>
                <Text style={styles.value}>{assignment.role || "N/A"}</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.label}>Assigned Code:</Text>
                <Text style={styles.value}>{assignment.code || "N/A"}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: 'center' },
    infoBox: {
        flexDirection: "row",
        marginBottom: 15,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontWeight: "bold",
        marginRight: 10,
        color: '#555',
        fontSize: 16,
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: '#333'
    },
});