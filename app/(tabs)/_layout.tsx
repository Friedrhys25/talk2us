import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerShown: false}} />
      <Tabs.Screen name="message" options={{ headerShown: false}} />
      <Tabs.Screen name="profile" options={{ headerShown: false}} />
    </Tabs>
  );
}
