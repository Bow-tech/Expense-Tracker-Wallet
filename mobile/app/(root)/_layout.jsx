import { useUser } from "@clerk/clerk-expo"
import { Redirect, Stack } from "expo-router";


export default function Layout() { 
  const { isSignedIn, isLoaded } = useUser();
  
  
    if (!isLoaded) return null; // Wait for user data to load
    if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
   <Stack screenOptions={{ headerShown: false }} />
  )
}

