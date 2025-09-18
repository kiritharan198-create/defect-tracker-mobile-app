// app/_layout.js
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Hide the default header for a cleaner look
            }}
        >
            <Stack.Screen name="index" options={{ title: "Login" }} />
            <Stack.Screen name="details" options={{ title: "Assignment Details" }} />
        </Stack>
    );
}