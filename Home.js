import React ,{ useState,useEffect} from 'react'; 
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
import SQLite from "react-native-sqlite-storage";
import GlobalStyle from './GlobalStyle';
import CustomButton from './CustomButton';
import {useSelector,useDispatch} from "react-redux";
import { setName,setAge,increaseAge,getCities } from "./Redux/action";
import PushNotification from "react-native-push-notification";




const db = SQLite.openDatabase(
  {
      name: 'MainDB',
      location: 'default',
  },
  () => { },
  error => { console.log(error) }
);

export default function Home({ navigation, route }) {

  const { name, age,cities } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  // const [name, setName] = useState('');
  // const [age, setAge] = useState('');

  useEffect(() => {
      getData();
      dispatch(getCities());
  }, []);

  const getData = () => {
      try {
          // AsyncStorage.getItem('UserData')
          //     .then(value => {
          //         if (value != null) {
          //             let user = JSON.parse(value);
          //             setName(user.Name);
          //             setAge(user.Age);
          //         }
          //     })
          db.transaction((tx) => {
              tx.executeSql(
                  "SELECT Name, Age FROM Users",
                  [],
                  (tx, results) => {
                      var len = results.rows.length;
                      if (len > 0) {
                          var userName = results.rows.item(0).Name;
                          var userAge = results.rows.item(0).Age;
                          dispatch(setName(userName));
                          dispatch(setAge(userAge));
                      }
                  }
              )
          })
      } catch (error) {
          console.log(error);
      }
  }

  const updateData = async () => {
      if (name.length == 0) {
          Alert.alert('Warning!', 'Please write your data.')
      } else {
          try {
              // var user = {
              //     Name: name
              // }
              // await AsyncStorage.mergeItem('UserData', JSON.stringify(user));
              db.transaction((tx) => {
                  tx.executeSql(
                      "UPDATE Users SET Name=?",
                      [name],
                      () => { Alert.alert('Success!', 'Your data has been updated.') },
                      error => { console.log(error) }
                  )
              })
          } catch (error) {
              console.log(error);
          }
      }
  }

  const removeData = async () => {
      try {
          // await AsyncStorage.clear();
          db.transaction((tx) => {
              tx.executeSql(
                  "DELETE FROM Users",
                  [],
                  () => { navigation.navigate('login') },
                  error => { console.log(error) }
              )
          })
      } catch (error) {
          console.log(error);
      }
  }

  const handleNotification=(item,index)=>{

    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotification(
        {
        channelId:"test-channel",
        title:" You Clicked on "+ item.country,
        message:item.city,
        bigText:item.city + " is one of the most Beautiful city in " + item.country,
        color:"red",
        id:index
        }

    );
    PushNotification.localNotificationSchedule(
        {
        channelId:"test-channel",
        title:"Alarm",
        message:" You Clicked on "+ item.country + "20 seconds",
        date:new Date(Date.now() + 20 * 1000),
        allowWhileIdle:true,
        }

    );
  }

  return (
      <View style={styles.body}>
          <Text style={[
              GlobalStyle.CustomFont,
              styles.text
          ]}>
              Welcome {name} !
          </Text>
          <FlatList 
          data={cities}
          renderItem={({item,index})=>(
              <TouchableOpacity
              onPress={()=>{
                  handleNotification(item,index);
                  navigation.navigate("Maps",{
                      city:item.city,
                      lat:item.lat,
                      lng:item.lng
                  });
              }}>
            <View style={styles.item}>
                <Text style={styles.title}>{item.country}</Text>
                <Text style={styles.subtitle}>{item.city}</Text>

                </View>
                </TouchableOpacity>
          )

          }/>
          
      </View>
  )
}

const styles = StyleSheet.create({
  body: {
      flex: 1,
      alignItems: 'center',
  },
  text: {
      fontSize: 40,
      margin: 10,
  },
  input: {
      width: 300,
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 10,
      backgroundColor: '#ffffff',
      textAlign: 'center',
      fontSize: 20,
      marginTop: 130,
      marginBottom: 10,
  },
  item: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cccccc',
    borderRadius: 5,
    margin: 7,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
},
title: {
    fontSize: 30,
    margin: 10,
},
subtitle: {
    fontSize: 20,
    margin: 10,
    color: '#999999',
}
})