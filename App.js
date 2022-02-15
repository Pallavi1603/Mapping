import React  from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './Home';
import login from './login';
import Maps from './Redux/Maps';
import {Provider} from "react-redux";
import {Store} from "./Redux/store";
import {LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);

// const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const App=()=>{
  return(
    <Provider store={Store}>
    <NavigationContainer>
    <Stack.Navigator
    initialRouteName="login"
    screenOptions={{
      headerTitleAlign:"center",
      headerStyle:{
        backgroundColor:"green"
      },
      headerTintColor:"white",
      headerTitleStyle:{
        fontSize:25,
        fontWeight:"bold"
      }
    }}>
     <Stack.Screen 
     name="login"
      component={login}
      options={{
        headerShown:false
      }}
      />
        <Stack.Screen
      name="Home"
      component={
        Home}
        />
        <Stack.Screen
        name="Maps"
        component={
          Maps}

     />
    </Stack.Navigator>
  </NavigationContainer>
  </Provider>
  )
}




export default App;

