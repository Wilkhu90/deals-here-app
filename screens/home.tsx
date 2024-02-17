import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import * as TaskManager from 'expo-task-manager';
import { storeData, getStoredData } from '../components/storage';
import { PermissionStatus } from 'expo-modules-core';
import SelectDropdown from 'react-native-select-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const LOCATION_TASK_NAME = 'background-location-task';

function Home({ dealList, setDealList, location, setLocation, address, setAddress }: any) {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [discountTypeList, setDiscountTypeList] = useState<any>([] as any[]);
  const [bankList, setBankList] = useState<any>([] as any[]);
  const [currentDeal, setCurrentDeal] = useState<any>({} as any);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const dealsHere = useRef({ name: ""});
  const [notificationPermissions, setNotificationPermissions] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );

  const handleChange = (type: any, text: any) => {
    currentDeal[type] = text;
    setCurrentDeal({ ...currentDeal });
  }

  const addNewDiscountDeal = () => {
    if(currentDeal && currentDeal.name !== "" && currentDeal.type !== "" && currentDeal.discount > 0) {
      setDealList([...dealList, currentDeal]);
      storeData('customer-data', [...dealList, currentDeal]);
      setCurrentDeal({});
      setModalVisible(!modalVisible);
    }
  }
  const deleteDealFromList = (index: any) => {
    setDealList((prevDealList: any) => {
      let newDealList = prevDealList.filter((deal: any, idx: any) => idx !== index);
      storeData('customer-data', newDealList);
      return newDealList;
    });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <FlatList 
          data={dealList}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => deleteDealFromList(index)}>
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
                      onPress={addNewDiscountDeal}>
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

        <Text>Current Address: {address ? address.name : null}</Text>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Task -> ", locations[0])
    storeData('location', locations[0]);
  }
});

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
  }
});


export default Home;