import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerTitle: "Home", headerTitleAlign: "center"}} />
      <Tabs.Screen name="message" options={{ headerTitle: "Chat", headerTitleAlign: "center"}} />
      <Tabs.Screen name="profile" options={{ headerTitle: "Profile", headerTitleAlign: "center"}} />
    </Tabs>
  );
}
