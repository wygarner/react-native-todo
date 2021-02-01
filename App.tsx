import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, View, Modal, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import styles from './styles/styles';
import { MaterialIcons, AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import firebase from './firebase';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const titleRef = useRef(null)
  const descriptionRef = useRef<any>(null)
  const [itemList, setItemList] = useState()

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var date = mm + '-' + dd + '-' + yyyy;

  useEffect(() => {
    const itemRef = firebase.database().ref('todo')
    itemRef.on("value", (snapshot) => {
      const items = snapshot.val()
      const list : any = [];
      for (let id in items) {
        let newItem = items[id]
        newItem.id = id
        list.push(newItem)
      }
      setItemList(list)
    });
  }, []);


  const handleTitle = (text : any) => {
    setTitle(text)
    console.log(title)
  }

  const handleDescription = (text : any) => {
    setDescription(text)
    console.log(description)
  }

  const handleSubmit = () => {
    const todoRef = firebase.database().ref('todo')
    if (title !== '' || description !== '') {
      if (title === '') {
        setTitle('No title')
      }
      if (description === '') {
        setDescription('No description')
      }
      const todo = {
        title : title,
        description : description,
        complete : false
      }
      todoRef.push(todo)
      setTitle('')
      setDescription('')
    }
    setModalVisible(false)
  }

  const renderTask = ({item} : any) => {
    return (
      <View style={{marginBottom: 24, flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
        <View style={{flex : 1, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity hitSlop={{right: 50, top: 50, bottom: 50}} onPress={() => {
            const todoRef = firebase.database().ref('todo').child(item.id)
            todoRef.update({
              complete : !item.complete
            })
          }}>
            {item.complete
              ? <Ionicons name="ios-radio-button-on" size={24} color="#49D9E2" />
              : <Ionicons name="ios-radio-button-off" size={24} color="#49D9E2" />
            }
          </TouchableOpacity>
          <View style={{marginLeft: 12, marginRight: 96}}>
            <Text style={{color: '#b4bbbf', fontSize: 24, marginBottom: 2, fontWeight: 'bold'}}>{item.title}</Text>
            <Text style={{color: '#b4bbbf'}}>{item.description}</Text>
          </View>
        </View>
        <View style={{flex: 0, justifyContent: 'flex-end', marginRight: 16}}>
          <TouchableOpacity hitSlop={{left: 50, top: 50, bottom: 50}} onPress={() => {
            Alert.alert(
              "Remove task?",
              "",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Ok",
                  onPress: () => {
                    const todoRef = firebase.database().ref('todo').child(item.id)
                    todoRef.remove()
                  },
                  style: "destructive"
                }
              ]
            )
          }}>
            <Entypo name="dots-three-horizontal" size={18} color="#b4bbbf" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerText}>{date}</Text>
      </SafeAreaView>
      <Modal
        visible={modalVisible}
        animationType='slide'
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={{flexDirection: 'row', marginBottom: 24}}>
            <TouchableOpacity hitSlop={{right: 50, bottom: 50}} onPress={() => {
              setModalVisible(false)
              setTitle('')
              setDescription('')
              }}
            >
              <View style={{flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                  <MaterialIcons name="keyboard-arrow-left" size={32} color="#49D9E2" />
                  <Text style={styles.navigationText}>Tasks</Text>
              </View>
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'flex-end', marginRight: 12}}>
              <TouchableOpacity hitSlop={{left: 50, bottom: 50}} onPress={handleSubmit}>
                <Text style={styles.navigationText}>Done</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <Text style={styles.headerText}>New Task</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.titleInput}
              placeholder = "Title"
              placeholderTextColor = "#b4bbbf"
              autoCapitalize = "sentences"
              ref = {titleRef}
              onSubmitEditing={() => descriptionRef.current.focus()}
              onChangeText={handleTitle}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.descriptionInput}
              placeholder = "Description"
              placeholderTextColor = "#b4bbbf"
              autoCapitalize = "sentences"
              ref = {descriptionRef}
              onChangeText={handleDescription}
              multiline={true}
            />
          </View>
        </View>
      </Modal>
      <View style={{flex: 10, marginTop: 36}}>
        <FlatList 
          data={itemList}
          renderItem={renderTask}
        />
      </View>
      <SafeAreaView style={styles.footerContatiner}>
        <TouchableOpacity hitSlop={{right: 50, top: 50}} onPress={() => setModalVisible(true)}>
          <View style={{marginBottom: 12, marginLeft: 16, flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="pluscircle" size={24} color="#49D9E2" />
            <Text style={styles.footerText}>New task</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}