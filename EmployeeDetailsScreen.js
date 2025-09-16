// EmployeeDetailsScreen.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { db } from "./src/firebase"; // Adjust the path to your firebase config

export default function EmployeeDetailsScreen({ route }) {
  const { employeeId, assignedCode } = route.params;
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const assignmentsRef = collection(db, "assignments");
        const q = query(
          assignmentsRef,
          where("employeeId", "==", employeeId),
          where("code", "==", assignedCode)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setAssignment(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentDetails();
  }, [employeeId, assignedCode]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={styles.centered}>
        <Text>No assignment details found.</Text>
      </View>
    );
  }

  return (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
});