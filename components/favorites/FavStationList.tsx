import { View, Text, ScrollView, StyleSheet } from "react-native";
import stationsModel from "../../models/stations";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Base } from "../../styles";
import coordsModel from "../../models/coords";

export default function favDelayList({navigation, stations, favStations, setFavStations}) {



    const favStationBtns = favStations.map((favStation, index) => {
        const station = stationsModel.getFavStation(favStation, stations);
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
            );
    })

    return (
        <ScrollView>
            {favStationBtns}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});