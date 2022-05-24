import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DelaysList from './DelaysList';
import DelaysSingle from './DelaysSingle';

const Stack = createNativeStackNavigator();

export default function Delays(props) {
    return (
        <Stack.Navigator initialRouteName='list'>
            <Stack.Screen name='list' options={{headerShown: false}} >
                {(screenProps) => <DelaysList {...screenProps} stations={props.stations} favDelays={props.favDelays} setFavDelays={props.setFavDelays} />}
            </ Stack.Screen>
            <Stack.Screen name='Försening'>
                {(screenProps) => <DelaysSingle {...screenProps} isLoggedIn={props.isLoggedIn} favDelays={props.favDelays} setFavDelays={props.setFavDelays} />}
            </Stack.Screen>
        </Stack.Navigator>
    )
}