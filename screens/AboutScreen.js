import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Octicons';

export default function AboutScreen({ tasks, editIndex, setTasks, setModalVisible }) {
  const [task, setTask] = useState("");

  const handleAddTask = () => {
    if (task) {
      const updatedTasks = [...tasks];
      if (editIndex !== -1) {
        updatedTasks[editIndex] = task;
        setEditIndex(-1);
      } else {
        updatedTasks.push(task);
      }
      setTasks(updatedTasks);
      setTask("");
    }
  };

  const AppButton = ({ onPress, icon, buttonStyle, textStyle, text, iconStyle }) => (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>
        <Icon name={icon} size={20} style={iconStyle} />
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.centeredView}>
        <TextInput
          style={styles.input}
          placeholder="Ajouter une tâche"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <DateTimePicker
          style={styles.dateTimePicker}
          display="time"
          value={new Date()}
        />
        <AppButton
          onPress={() => {
            handleAddTask();
            setModalVisible(false);
          }}
          buttonStyle={[styles.button, styles.buttonClose]}
          textStyle={styles.textStyle}
          text={"Hide Modal"}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    width: "80%",
    height: "50%",
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
