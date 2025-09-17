import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "./src/firebase";

export default function EmployeeDetailsScreen({ route, navigation }) {
  const { employeeId, assignedCode } = route.params;
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const assignmentsRef = collection(db, "assignments");
        const q = query(assignmentsRef, where("employeeId", "==", employeeId), where("code", "==", assignedCode));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) setAssignment(snapshot.docs[0].data());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAssignment();
  }, []);

  const handleLogout = () => navigation.replace("Login");
  const handleLiveLocation = () => navigation.navigate("LiveLocationScreen");

  if (loading) return <View style={styles.centered}><ActivityIndicator /></View>;
  if (!assignment) return <View style={styles.centered}><Text>No assignment found.</Text><Button title="Logout" onPress={handleLogout} /></View>;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:12 }}>
        <Text style={styles.header}>Your Assignment</Text>
        <TouchableOpacity onPress={handleLiveLocation}><Ionicons name="location-outline" size={28} color="#007bff" /></TouchableOpacity>
      </View>

      <Text>Project ID: {assignment.projectId || "-"}</Text>
      <Text>Role: {assignment.role || "-"}</Text>
      <Text>Code: {assignment.code || assignedCode}</Text>
      <Text>Duration: {assignment.duration || "-"} hours</Text>

      <View style={{ marginTop: 20 }}><Button title="Logout" onPress={handleLogout} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:"#f5f5f5" },
  centered: { flex:1, justifyContent:"center", alignItems:"center" },
  header: { fontSize:24, fontWeight:"bold" },
});
