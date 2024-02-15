import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Notification } from 'expo-notifications';
import { storeData, getStoredData } from './components/storage';

type BankDiscount = {
  name: string,
  business: string,
  type: string,
  discount: number,
}
const LOCATION_TASK_NAME = 'background-location-task';

export default function App() {
  const [offerList, setOfferList] = useState<BankDiscount[]>([]);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [discountTypeList, setDiscountTypeList] = useState<any>([] as any[]);
  const [bankList, setBankList] = useState<any>([] as any[]);
  const [currentOffer, setCurrentOffer] = useState<any>({} as any);
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const dealsHere = useRef({ name: ""});
  const [notificationPermissions, setNotificationPermissions] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );

  const scheduleNotification = (seconds: number, bank: any, discount: any, business: any) => {
    const schedulingOptions = {
      content: {
        title: 'Deals Here!',
        body: 'Use '+bank+' card to get '+discount+'% discount at '+business,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: 'blue',
      },
      trigger: {
        seconds: seconds,
      },
    };
    Notifications.scheduleNotificationAsync(schedulingOptions);
  };

  const handleNotification = (notification: Notification) => {
    const { title } = notification.request.content;
    console.warn(title);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    return status;
  };

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) return;
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, [notificationPermissions]);

  //Red Pepper Taqueria - Coordinates 33.81693, -84.33439
  //Apartment - Coordinates 33.8021, -84.33828
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Wilkhu90/deals-here-app-config/main/app.json")
    .then((response) => response.json())
    .then((data) => {
      setDiscountTypeList(data["type"]);
      setBankList(data["banks"]);
    });
    (async() => {
      let offerListNew = await getStoredData();
      // if(!offerListNew) {
      //   offerListNew = [{
      //     name: "Chase",
      //     business: "Red Pepper Taqueria",
      //     type: "restaurant",
      //     discount: 10,
      //   }]
      // }
      if(offerListNew) {
        setOfferList([ ...offerListNew ]);
      }
    })();
    getLocation();
  }, []);

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      setLocation(locations[0]);
      let lat = location.coords.latitude;
      let long = location.coords.longitude;
      console.log("Here");
      (async() => {
        const response = await fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + long + "&zoom=18&addressdetails=1");
        const address = await response.json();
        setAddress(address);
        // Decision Generator
        let applicableOffers = offerList.filter((offer: any) => {
          if(offer.type.toLowerCase() === "any" && offer.business.toLowerCase() === address.name.toLowerCase()) {
            return offer;
          } else if(offer.type === address.type && offer.business === address.name) {
            return offer;
          }
        }).sort((a, b) => {
          if(a.discount > b.discount) {
            return -1;
          }
          if(a.discount < b.discount) {
            return 1;
          }
          return 0;
        });
        console.log(address.name);
        console.log(applicableOffers);
        console.log(dealsHere.current.name)
        if(applicableOffers && applicableOffers.length > 0 && dealsHere.current.name !== address.name) {
          scheduleNotification(1, applicableOffers[0].name, applicableOffers[0].discount, applicableOffers[0].business);
        }
        dealsHere.current = address;
      })();
    }
  });

  const getLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    } else if(status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let lat = location.coords.latitude;
      let long = location.coords.longitude;
      const response = await fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + long + "&zoom=18&addressdetails=1");
      const data = await response.json();
      setAddress(data);
      try {
        let backPerm = await Location.requestBackgroundPermissionsAsync();
        console.log(backPerm);
        if(backPerm.status === 'granted' ) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
          });
        }
      } catch(error) {
        console.log(error);
      }
    }
  }

  const handleChange = (type: any, text: any) => {
    currentOffer[type] = text;
    setCurrentOffer({ ...currentOffer });
  }

  const addNewDiscountOffer = () => {
    if(currentOffer && currentOffer.name !== "" && currentOffer.type !== "" && currentOffer.discount > 0) {
      setOfferList([...offerList, currentOffer]);
      storeData([...offerList, currentOffer]);
      setCurrentOffer({});
      setModalVisible(!modalVisible);
    }
  }
  const deleteOfferFromList = (index: any) => {
    setOfferList((prevOfferList) => {
      let newOfferList = prevOfferList.filter((offer, idx) => idx !== index);
      storeData(newOfferList);
      return newOfferList;
    });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <FlatList 
          data={offerList}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => deleteOfferFromList(index)}>
              <View style={styles.item}>
                <MaterialIcons name='delete' size={18} color='#333'></MaterialIcons>
                <Text>{item.name} Bank has a discount of {item.discount}% for {item.type} type {item.business && item.business.length > 0 ? "at "+(item.business === 'any' ? 'any business' :  item.business) : null}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <SelectDropdown
                    defaultButtonText='Select the Deal Type'
                    data={discountTypeList}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    onSelect={(selectedItem, index) => {
                      handleChange("type", selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                      return item
                    }}
                  />

                  <SelectDropdown
                    defaultButtonText='Select the Deal Provider'
                    data={bankList}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    onSelect={(selectedItem, index) => {
                      handleChange("name", selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                      return item
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => handleChange("business", text)}
                    placeholder="Enter the Discount Business Name...(Optional)"
                    keyboardType="default"
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => handleChange("discount", text)}
                    placeholder="Enter the Discount Percentage"
                    keyboardType="numeric"
                  />
                  <View style={styles.submit}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={addNewDiscountOffer}>
                      <Text style={styles.textStyle}>Add New Deal</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(false)}>
                      <Text style={styles.textStyle}>Close Popup</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={styles.buttonContainer}>
          <Button title='Add Deals Here' color={"#000"} onPress={() => setModalVisible(true)}/>
        </View>
        <View style={styles.developed}>
          <Text>Developed By: Sumeet W.</Text>
        </View>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#967bb6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
  buttonContainer: {
    backgroundColor: "#fdefb2",
    borderRadius: 10,
    width: 250,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: 260,
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    margin: 10,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    width: 300,
    flexDirection: 'row',
  },
  submit: {
    flexDirection: 'row',
  },
  developed: {
    marginTop: 5,
  }
});
