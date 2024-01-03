import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import Icon from 'react-native-vector-icons/Octicons';
const ICAL = require('ical.js');

export default function HomeScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getIcal();
    }, []); 

    const renderItem = ({ item }) => (
        <View style={styles.task}>
            <Text style={styles.itemList}>{item.description}</Text>
            <Text style={styles.itemList}>{item.date}</Text>
        </View>
    );

    async function getIcal() {
        const icalLink =
            "https://sand.esiea.fr/Telechargements/ical/Edt_JOBLET.ics?version=2023.0.6.0&icalsecurise=5FFC2F02F845AE556C90A4B8D61303F74D868A49266E199DC5F5793C5E905EE7CF1727A2EC8A2D4D514CD77F63FF6325&param=643d5b312e2e36325d2666683d3126663d31";

        try {
            const response = await fetch(icalLink);
            const data = await response.text();
            const jcalData = ICAL.parse(data);

            if (!jcalData[2] || !jcalData[2].length) {
                console.error("No vevent found in iCalendar data.");
                return;
            }

            const vevents = jcalData[2].filter(([name]) => name === "vevent");

            const extractedTasks = vevents.map((vevent) => {
                const summary = vevent[1].find(([name]) => name === "summary");
                const dtstart = vevent[1].find(([name]) => name === "dtstart");
                const description = vevent[1].find(([name]) => name === "description");

                const date = dtstart && dtstart[3];

                return { summary: summary[3], date: date && new Date(date).toLocaleDateString(), description: description && description[3] };
            });

            setTasks(extractedTasks);
        } catch (error) {
            console.error("An error occurred while fetching or parsing iCalendar data:", error);
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatList}
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: "#F5F5F5",
    },
    task: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        fontSize: 18,
    },
    itemList: {
        fontSize: 14,
    },
});
