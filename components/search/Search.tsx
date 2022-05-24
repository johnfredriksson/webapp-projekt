import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import delaysModel from '../../models/delays';

import SearchList from './SearchList';
import SearchSingle from './SearchSingle';

const Stack = createNativeStackNavigator();

export default function Search(props) {
    const [allDelays, setAllDelays] = useState([]);

    useEffect(() => {
        (async () => {
            setAllDelays(await delaysModel.getDelays());
        })();
    }, []);
    return (
        <Stack.Navigator initialRouteName='List'>
            <Stack.Screen name='list' options={{headerShown: false}} >
                {(screenProps) => <SearchList {...screenProps} stations={props.stations} favStations={props.favStations} setFavStations={props.setFavStations} />}
            </ Stack.Screen>
            <Stack.Screen name='Station'>
                {(screenProps) => <SearchSingle {...screenProps} stations={props.stations} allDelays={allDelays} favStations={props.favStations} setFavStations={props.setFavStations} isLoggedIn={props.isLoggedIn}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}