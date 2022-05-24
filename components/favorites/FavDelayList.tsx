import { View, Text, ScrollView, StyleSheet } from "react-native";
import delaysModel from "../../models/delays";
import { DelayCard } from "../../styles";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function favDelayList({navigation, stations, favDelays, allDelays}) {



    const delays = favDelays.map((favDelay, index) => {
        const delay = delaysModel.getFavDelay(favDelay, allDelays);
        if (delay) {
            console.log(delay)
            const delayObj = delaysModel.getDelayObject(delay, stations);
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
    })

    return (
        <ScrollView>
            {delays}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});