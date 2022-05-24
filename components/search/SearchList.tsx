import { Text, View, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Base, Typography, Forms } from "../../styles";
import coordsModel from "../../models/coords";
import { Ionicons } from '@expo/vector-icons';


export default function SearchList({ navigation, stations }) {
    const [searchQuery, setSearchQuery] = useState({});


    const markers = stations.map((station, index) => {
        const coords = coordsModel.getCoords(station.Geometry.WGS84);
        return (
            <Marker
                key={index}
                title={station.AdvertisedLocationName}
                coordinate={{
                    longitude: parseFloat(coords[0]),
                    latitude:  parseFloat(coords[1])
                }}
                onPress={() => {
                    navigation.navigate("Station", {
                        station: station,
                        coords: coordsModel.getCoords(station.Geometry.WGS84)
                    });
                }}
            />
        );
    });

    const [locationMarker, setLocationMarker] = useState(null);
    const [curLoc, setCurLoc] = useState({"latitude":56.1612, "longitude":15.5869});
    const [nearestStations, setNearestStations] = useState([]);
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
    

    const allStations = stations.map((station, index) => {
        return (
            <View key={index}>
                <TouchableOpacity
                    style={Base.stationCard}
                    key={index}
                    onPress={() => {
                        navigation.navigate("Station", {
                            station: station,
                            coords: coordsModel.getCoords(station.Geometry.WGS84)
                        });
                    }}
                >
                <Ionicons style={Base.stationCardIcon} name="git-commit"/>
                    <Text style={Base.stationCardText}>{station.AdvertisedLocationName}</Text>
                </TouchableOpacity>
                <Ionicons style={Base.stationCardFav} name="star-outline"/>
            </View>
        )
    })

    return (
        <View style={Base.container}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    // followsUserLocation={true}
                    region={{
                        latitude: curLoc.latitude,
                        longitude: curLoc.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    testID="mapView"
                    >
                    {locationMarker}
                    {markers}
                </MapView>
            </View>
            <View style={styles.form}>
                <Text style={Typography.searchHeader}>Vilken station söker du?</Text>
                <TextInput
                    style={{ ...Forms.input }}
                    onChangeText={(content: string) => {
                        setSearchQuery({ ...searchQuery, query: content})
                    }}
                    value={searchQuery?.query}
                    placeholder="T.ex. Jönköping"
                    testID="inputField"
                    />
                <TouchableOpacity
                style={Base.searchButton}
                testID="searchButton"
                onPress={() => {
                    stations.map((station, index) => {
                        {station.AdvertisedLocationName == searchQuery.query ?
                            navigation.navigate("Station", {
                                station: station,
                                coords: coordsModel.getCoords(station.Geometry.WGS84)
                            }) : null
                        }
                    })
                }}
                >
                    <Text style={Base.searchText}>Sök</Text>
                </TouchableOpacity>
                <Text style={Typography.searchHeader}>Sveriges tågstationer</Text>
                <ScrollView>
                    {allStations}
                </ScrollView>
            </View>
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