import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useState, useEffect } from "react";

const Tab = createMaterialTopTabNavigator();

import FavStationList from './FavStationList';
import FavDelayList from './FavDelayList';
import Account from './Account';
import delaysModel from "../../models/delays";

export default function Favorites(props) {
    const [allDelays, setAllDelays] = useState([]);


    useEffect(() => {
        (async () => {
            setAllDelays(await delaysModel.getDelays());
        })();
    }, []);
    return (
        <Tab.Navigator initialRouteName='Konto'>
            <Tab.Screen name="Konto">
            {(screenProps) => <Account {... screenProps} setIsLoggedIn={props.setIsLoggedIn} /> }
            </Tab.Screen>
            <Tab.Screen name='Stationer'>
                {(screenProps) => <FavStationList {... screenProps} favStations={props.favStations} setFavStations={props.setFavStations} stations={props.stations} /> }
            </Tab.Screen>
            <Tab.Screen name='Förseningar'>
                {(screenProps) => <FavDelayList {... screenProps} favDelays={props.favDelays} setFavDelays={props.setFavDelays} stations={props.stations} allDelays={allDelays}/>}
            </Tab.Screen>
        </Tab.Navigator>
    )
}