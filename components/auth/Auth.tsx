import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import Register from './Register';

const Stack = createNativeStackNavigator();

export default function Deliveries(props: any) {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" options={{headerShown: false}}>
                {(screenProps) => <Login {...screenProps} setIsLoggedIn={props.setIsLoggedIn} setFavDelays={props.setFavDelays} setFavStations={props.setFavStations} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
        </Stack.Navigator>
    );
};