import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import delaysModel from "../../models/delays";
import { DelayCard } from "../../styles";
import { Ionicons } from '@expo/vector-icons';
import * as Location from "expo-location";
import { Circle, Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { TouchableOpacity } from 'react-native';
import coordsModel from "../../models/coords";
import { showMessage } from "react-native-flash-message";
import favDelaysModel from "../../models/favDelays";

export default function DelaysList({navigation, stations, favDelays, setFavDelays}) {
    const [allDelays, setAllDelays] = useState([]);
    const [locationMarker, setLocationMarker] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
    
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }
    
            const currentLocation = await Location.getCurrentPositionAsync({});
    
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



    useEffect(() => {
        (async () => {
            setAllDelays(await delaysModel.getDelays());
        })();
    }, []);

    const delays = allDelays.map((delay, index) => {
        const delayObj = delaysModel.getDelayObject(delay, stations);
        return (
            <TouchableOpacity
                style={DelayCard.base}
                key={index}
                onPress={() => {
                    {delayObj.locations[1] ?
                        navigation.navigate("Försening", {delayObj: delayObj})
                    :
                        showMessage({
                            message: "Ingen mer info",
                            description: "Mer info saknas för tillfället om denna förseningen",
                            type: "warning"
                        });
                    }
                    
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
    })

    const markers = allDelays.map((delay, index) => {
        if (delay.FromLocation) {
            const target = stations.find(station => station.LocationSignature == delay.FromLocation[0].LocationName);
            const coords = coordsModel.getCoords(target.Geometry.WGS84);
            return (
                <Marker
                    key={index}
                    title={target.AdvertisedLocationName}
                    description="Det kan finnas flera förseningar för denna station"
                    coordinate={{
                        longitude: parseFloat(coords[0]),
                        latitude:  parseFloat(coords[1])
                    }}
    
                />
            );
        }
    });

    return (
        <View>
            <View style={DelayCard.head}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 61.334591,
                        longitude: 18.063240,
                        latitudeDelta: 12,
                        longitudeDelta: 12,
                    }}
                    >
                    {locationMarker}
                    {markers}
                </MapView>
            </View>
            <ScrollView style={DelayCard.canvas}>
                {delays}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});