// web 891787087901-fvqh5s9igmbb919tppcp5mhjks08irl6.apps.googleusercontent.com
//ios 891787087901-6i6hno0ct164hdbqlbf5eos0h988t7ob.apps.googleusercontent.com

//android 891787087901-47l66loufur19580vbfavc9i7qc2rd5b.apps.googleusercontent.com
import * as React from 'react'
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native-web";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


WebBrowser.maybeCompleteAuthSession();

export function Home() {
  const [ userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '891787087901-47l66loufur19580vbfavc9i7qc2rd5b.apps.googleusercontent.com',
    webClientId: '891787087901-fvqh5s9igmbb919tppcp5mhjks08irl6.apps.googleusercontent.com',
    iosClientId: '891787087901-6i6hno0ct164hdbqlbf5eos0h988t7ob.apps.googleusercontent.com'
  });

  React.useEffect(()=>{
    handleSingInWithGoogle();
  }, [response]);

  async function handleSingInWithGoogle() {
    console.log("handleSingInWithGoogle called");
    const user = await AsyncStorage.getItem('@user');
    console.log("Stored user:", user);
  
    if (!user) {
      console.log("No user stored");
      if (response?.type === 'success') {
        console.log("Response success:", response);
        await getUserInfo(response.authentication.accessToken);
      } else {
        console.log("No success response");
        await getUserInfo();
      }
    } else {
      console.log("User found in AsyncStorage");
      setUserInfo(JSON.parse(user));
    }
  }
  
  const getUserInfo = async (token) => {
    console.log("getUserInfo called with token:", token);
    if (!token) {
      console.log("No token provided");
      return;
    }
  
    try {
      const response = await fetch (
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
  
      const user = await response.json();
      console.log("User info from Google:", user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  }
  

 return (
  
   <View style={styles.container}>
    <Text>Codes</Text>
    <Button title='Login com Google' onPress={promptAsync}/>
    <StatusBar style="auto"/>    
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center'
  },
})