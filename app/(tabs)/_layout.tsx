import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerTitle: "Home"}} />
      <Tabs.Screen name="message" options={{ headerTitle: "Chat"}} />
      <Tabs.Screen name="profile" options={{ headerTitle: "Profile"}} />
    </Tabs>
  );
}
