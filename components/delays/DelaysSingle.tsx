import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Circle, Marker, Polyline } from "react-native-maps";
import MapView from "react-native-maps";
import { DelaySingle } from "../../styles";
import coordsModel from "../../models/coords";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from '@expo/vector-icons';
import favDelaysModel from "../../models/favDelays";

export default function DelaysSingle({route, isLoggedIn, favDelays, setFavDelays}) {
    const {delayObj} = route.params;
    const [locationMarker, setLocationMarker] = useState(null);
    const fromCoords = coordsModel.getCoords(delayObj.locations[0].fromLocation.Geometry.WGS84);
    const toCoords = coordsModel.getCoords(delayObj.locations[0].toLocation.Geometry.WGS84);
    const favCheck = favDelaysModel.isItemInArtefactTest(delayObj.delay.ActivityId, favDelays);
    
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
                identifier="mk1"
            />);
        })();
    }, []);


    async function favIt(item: string) {
        const newArtefact = await favDelaysModel.addToArtefact(item);
        setFavDelays(newArtefact);
    }

    async function deFavIt(item: string) {
        const newArtefact = await favDelaysModel.removeFromArtefact(item);
        setFavDelays(newArtefact);
    }


    return (
        <View style={DelaySingle.canvas}>
            {delayObj.locations[1] ?
                <View style={DelaySingle.header}>
                    <Text style={DelaySingle.headerText}>Fr??n:   {delayObj.locations[0].fromLocation.AdvertisedLocationName}</Text>
                    <Text style={DelaySingle.headerText}>Till:      {delayObj.locations[0].toLocation.AdvertisedLocationName}</Text>
                </View>
            :
                <View style={DelaySingle.header}>
                    <Text>Stationer saknas</Text>
                </View>
            }

            {delayObj.time.hours >= 1 ?
                <View style={DelaySingle.header}>
                    <Text style={DelaySingle.timeText}>T??get ??r f??rsenat med: {delayObj.time.hours} h {delayObj.time.minutes} min</Text>
                </View>
            :
                <View style={DelaySingle.header}>
                    <Text style={DelaySingle.timeText}>T??get ??r f??rsenat med: {delayObj.time.minutes} min</Text>
                </View>
            }

            <View style={DelaySingle.mapView}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: parseFloat(fromCoords[1]),
                        longitude: parseFloat(fromCoords[0]),
                        latitudeDelta: 1,
                        longitudeDelta: 1,
                    }}
                >
                    {locationMarker}
                    <Marker
                        title={delayObj.locations[0].fromLocation.AdvertisedLocationName}
                        description="Avg??ng"
                        coordinate={{
                            latitude: parseFloat(fromCoords[1]),
                            longitude: parseFloat(fromCoords[0])
                        }}
                        identifier="mk2"
                    />
                    <Marker
                        title={delayObj.locations[0].toLocation.AdvertisedLocationName}
                        coordinate={{
                            latitude: parseFloat(toCoords[1]),
                            longitude: parseFloat(toCoords[0])
                        }}
                        identifier={"mk3"}
                    />
                    <Polyline
                        coordinates={
                            [
                                {
                                    latitude: parseFloat(fromCoords[1]),
                                    longitude: parseFloat(fromCoords[0])
                                },
                                {
                                    latitude: parseFloat(toCoords[1]),
                                    longitude: parseFloat(toCoords[0])
                                }
                            ]}
                        geodesic={true}
                        strokeColor="red"
                    />
                    <Circle
                        center={{
                            latitude: parseFloat(fromCoords[1]),
                            longitude: parseFloat(fromCoords[0]),
                        }}
                        radius={(((delayObj.time.hours * 60 + delayObj.time.minutes) * 100) / 2) * 0.7}
                        fillColor="rgba(67, 174, 52, 0.13)"
                        strokeWidth={1}
                        strokeColor="green"
                    />
                </MapView>
            </View>
            <View style={DelaySingle.info}>
                <Text style={DelaySingle.time}>{delayObj.time.time}</Text>
                <Text style={DelaySingle.estTime}>{delayObj.time.estTime}</Text>
                <Ionicons style={DelaySingle.trainIcon} name="train"/>
                <Ionicons style={DelaySingle.gitIcon} name="git-commit"/>
                <Text style={DelaySingle.infoText}>
                    T??g med nummer {delayObj.delay.AdvertisedTrainIdent} mot {delayObj.locations[0].toLocation.AdvertisedLocationName} med 
                    ordinarie avg??ngstid {delayObj.time.time} fr??n station {delayObj.locations[0].fromLocation.AdvertisedLocationName} har 
                    blivit f??rsenat. Ny avg??ngstid ??r {delayObj.time.estTime}
                </Text>
                <Text style={DelaySingle.infoTextRange}>
                    Om du befinner dig p?? {delayObj.locations[0].fromLocation.AdvertisedLocationName} s?? kan du nyttja f??rseningen genom 
                    att ta en promenad i ditt n??romr??de, p?? kartan ser du en mark??r som visar dig hur l??ngt du kommer utan att missa ditt t??g.
                </Text>
            </View>
            {isLoggedIn ?
            <TouchableOpacity
                style={DelaySingle.bigBtn}
                onPress={() => {
                        {favCheck ?
                            deFavIt(delayObj.delay.ActivityId)
                        :   favIt(delayObj.delay.ActivityId)
                        }
                }}
            >
                {favCheck ?
                <Text style={DelaySingle.bigBtnTxt}>Avf??lj f??rsening</Text>
                : <Text style={DelaySingle.bigBtnTxt}>F??lj f??rsening</Text>
                }
            </TouchableOpacity>
            :
            <TouchableOpacity
                style={DelaySingle.bigBtn}
                onPress={() => {
                    showMessage({
                        message: "Ej inloggad",
                        description: "Logga in om du vill f??lja f??rseningar",
                        type: "warning"
                    });
                }}
            
            >
                <Text style={DelaySingle.bigBtnTxt}>F??lj f??rsening</Text>
            </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});