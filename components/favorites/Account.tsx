import { Text, View, Button, TouchableOpacity } from "react-native";
import authModel from "../../models/auth";
import { DelaySingle  } from "../../styles";

export default function Account({navigation, setIsLoggedIn}) {
    return(
        <View>
            <TouchableOpacity
            style={DelaySingle.bigBtn}
                onPress={() => {
                    authModel.logout();
                    setIsLoggedIn(false);
                    navigation.navigate("Sök", {reload: true});
                }}
            >
                <Text style={DelaySingle.bigBtnTxt}>Logga ut</Text>
            </TouchableOpacity>
        </View>
    )
}