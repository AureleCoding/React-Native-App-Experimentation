import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" >
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Tasks" }} />
                <Stack.Screen name="About" component={AboutScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}