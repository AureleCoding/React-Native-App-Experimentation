import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Octicons';
const ICAL = require('ical.js');

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.task}>
        <Text style={[styles.itemList, styles.matiere]}>{index}</Text>
        <Text style={[styles.itemList, styles.matiere]}>{item.matiere}</Text>
        <Text style={styles.itemList}>{item.prof}</Text>
        <Text style={styles.itemList}>{item.salle}</Text>
        <Text style={styles.itemList}>{item.taskDate}</Text>
      </View>
    )
  };

  const AppButton = ({ onPress, icon, buttonStyle, textStyle, text, iconStyle }) => (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>
        <Icon name={icon} size={20} style={iconStyle} />
        {text}
      </Text>
    </TouchableOpacity>
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const day = today.getDate();
  const formattedDay = day < 10 ? "0" + day : day;
  const datenow = `${formattedDay} ${months[today.getMonth()]}, ${today.getFullYear()}`;

  useEffect(() => {
    getIcal();
  }, []);


  async function getIcal() {
    const icalLink = "https://sand.esiea.fr/Telechargements/ical/Edt_JOBLET.ics?version=2023.0.6.0&icalsecurise=5FFC2F02F845AE556C90A4B8D61303F74D868A49266E199DC5F5793C5E905EE7CF1727A2EC8A2D4D514CD77F63FF6325&param=643d5b312e2e36325d2666683d3126663d31";

    try {
      const response = await fetch(icalLink);
      const data = await response.text();
      const jcalData = ICAL.parse(data);

      if (!jcalData[2] || !jcalData[2].length) {
        console.error("No vevent found in iCalendar data.");
        return;
      }

      let vcalendar = new ICAL.Component(jcalData);

      const vevents = vcalendar.getAllSubcomponents('vevent');

      const extractedTasks = vevents.map((vevent, index) => {

        const summary = vevent.getFirstPropertyValue('summary');
        const dtstart = vevent.getFirstPropertyValue('dtstart');
        const description = vevent.getFirstPropertyValue('description');

        const matieres = description && description.match(/Matières? : (.+?)(\n|\r|$)/);
        const matiere = matieres ? matieres[1] : false;

        const profs = description && description.match(/Enseignants? : (.+?)(\n|\r|$)/);
        const prof = profs ? profs[1] : false;

        const salles = description && description.match(/Salles? : (.+?)(\n|\r|$)/);
        const salle = salles ? salles[1] : false;

        const taskDate = dtstart && new Date(dtstart);

        setTasks(extractedTasks);

        return {
          index,
          summary,
          taskDate,
          matiere,
          prof,
          salle,
          description,
        };
      });

      /* extractedTasks.sort((a, b) => (a.date && b.date ? a.date - b.date : 0));

      const formattedTasks = extractedTasks.map((task) => ({
        ...task,
        date: task.date && task.date.toLocaleDateString(),
        time: task.date && task.date.toLocaleTimeString(),
      })); */

      /* formattedTasks.forEach((task, index) => {
        if (task.date && isSameDay(task.date, today)) {
          handleItemPress(index);
          console.log(`Task at index ${index} has the same date as the current day.`);
        }
      }); */


    } catch (error) {
      console.error("An error occurred while fetching or parsing iCalendar data:", error);
    }
  }

  function isSameDay(d1, d2) {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if (date1 === date2) {
      console.log(date1, date2);
    }

    return date1 === date2;
  }

  const flatListRef = useRef(0);
  const handleItemPress = (index) => {
    if (tasks.length > 0) {
      flatListRef.current.scrollToIndex({ animated: false, index });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inLine}>
        <Text style={styles.title}>Aujourd'hui</Text>
        <Text style={styles.date}>{datenow}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(data, index) => (
          { length: 50, offset: 50 * index, index }
        )}
      />

      <AppButton
        onPress={() => getIcal()}
        icon="plus"
        buttonStyle={styles.appButton}
        textStyle={styles.appButtonText}
        iconStyle={styles.appIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 24,
    fontWeight: "500",
    color: "#878787",
  },
  task: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "left",
    marginBottom: 15,
    fontSize: 18,
    backgroundColor: "#e0e1e5",
    borderRadius: 10,
    padding: 10
  },
  itemList: {
    fontSize: 14,
  },
  matiere: {
    fontWeight: "bold",
  },
  flatList: {
    flex: 1,
    marginTop: 20,
  },
  appButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#4D95EE",
    width: 50,
    height: 50,
    borderRadius: 50,
    position: "absolute",
    bottom: 50,
    left: 50,
  },
  appButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "400",
  },
  inLine: {
    flexDirection: "column",
    alignItems: "left",
    justifyContent: "space-between",
  },
  appIcon: {
    color: "white",
    fontSize: 20,
    fontWeight: 100,
  },
});

export default HomeScreen;