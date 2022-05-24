import { Text, View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Base, DelaySingle } from "../../styles";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { DelayCard } from "../../styles";
import delaysModel from "../../models/delays";
import { StationSingle } from "../../styles";
import favStationsModel from "../../models/favStations";
import { showMessage } from "react-native-flash-message";


export default function SearchSingle({ route, navigation, allDelays, stations, favStations, setFavStations, isLoggedIn}) {
    const {station} = route.params;
    const {coords} = route.params;
    let delayCheck = false
    const favCheck = favStationsModel.isItemInArtefact(station.LocationSignature, favStations);

    const delays = allDelays.filter((item) => item.FromLocation != undefined && item.FromLocation[0].LocationName == station.LocationSignature)
    .map((delay, index) => {
            const delayObj = delaysModel.getDelayObject(delay, stations);
            delayCheck = true
            return (
                <TouchableOpacity
                    style={DelayCard.base}
                    key={index}
                    onPress={() => {
                        navigation.navigate("Försening", {delayObj: delayObj});
                        
                    }}>
                    <Text style={DelayCard.time}>{delayObj.time.time}</Text>
                    <Text style={DelayCard.estTime}>{delayObj.time.estTime}</Text>
                    <Text style={DelayCard.day}>{delayObj.time.day}</Text>
                    {delayObj.locations[1] ?
                        <Text style={DelayCard.stations}>{delayObj.locations[0].fromLocation.AdvertisedLocationName} → {delayObj.locations[0].toLocation.AdvertisedLocationName}</Text>
                        : <Text style={DelayCard.stations}>Stationer saknas</Text>
                    }
                    <View style={DelayCard.train}>
                        <Ionicons style={DelayCard.trainIcon} name="train-outline"/>
                        <Text style={DelayCard.trainId}>Tågnummer: {delayObj.delay.AdvertisedTrainIdent}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    )

    const [locationMarker, setLocationMarker] = useState(null);
    const [curLoc, setCurLoc] = useState({"latitude":56.1612, "longitude":15.5869});
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
    
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }
    
            const currentLocation = await Location.getCurrentPositionAsync({});
            setCurLoc({"latitude":currentLocation.coords.latitude, "longitude":currentLocation.coords.longitude});
            setLocationMarker(<Marker
                coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                }}
                title="Min plats"
                pinColor="blue"
            />);
        })();
    }, []);

    const stationMarker = 
        <Marker
            title={station.AdvertisedLocationName}
            coordinate={{
                longitude: parseFloat(coords[0]),
                latitude:  parseFloat(coords[1])
            }}

        />
    ;

    async function favIt(item: string) {
        const newArtefact = await favStationsModel.addToArtefact(item);
        setFavStations(newArtefact);
    }

    async function deFavIt(item: string) {
        const newArtefact = await favStationsModel.removeFromArtefact(item);
        setFavStations(newArtefact);
    }
    

    return (
        <View style={Base.container}>
            <View style={StationSingle.header}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    region={{
                        longitude: parseFloat(coords[0]),
                        latitude: parseFloat(coords[1]),
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    >
                    {locationMarker}
                    {stationMarker}
                </MapView>
            </View>
            <View style={StationSingle.info}>
                <Text style={StationSingle.title}>{station.AdvertisedLocationName} Station</Text>
                {isLoggedIn ?
                <TouchableOpacity
                    style={DelaySingle.bigBtn}
                    onPress={() => {
                            {favCheck ?
                                deFavIt(station.LocationSignature)
                            :   favIt(station.LocationSignature)
                            }
                    }}
                >
                    {favCheck ?
                    <Text style={DelaySingle.bigBtnTxt}>Avfölj station</Text>
                    : <Text style={DelaySingle.bigBtnTxt}>Följ station</Text>
                    }
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={DelaySingle.bigBtn}
                    onPress={() => {
                        showMessage({
                            message: "Ej inloggad",
                            description: "Logga in om du vill följa stationer",
                            type: "warning"
                        });
                    }}
                
                >
                    <Text style={DelaySingle.bigBtnTxt}>Följ station</Text>
                </TouchableOpacity>
                }
            </View>
                {delayCheck ?
                    <ScrollView>
                        {delays}
                    </ScrollView>
                :
                    <View>
                        <Text style={StationSingle.smallText}>Det finns inga aktuella förseningar för {station.AdvertisedLocationName}</Text>
                    </View>
                }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    form: {
        height:500,
        borderWidth:1,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        borderColor:"#fcfcfc",
        backgroundColor:"#f5f4f0",
        overflow:"hidden"
    }
});