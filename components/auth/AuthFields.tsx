import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { Typography, Forms, Base } from '../../styles';
import { DelaySingle } from "../../styles";

export default function AuthFields({ auth, setAuth, title, submit, navigation}) {
    return (
        <View style={Base.container}>
            <Text style={Typography.header2}>{title}</Text>
            <Text style={Typography.label}>E-post</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    setAuth({ ...auth, email: content })
                }}
                value={auth?.email}
                keyboardType="email-address"
            />
            <Text style={Typography.label}>Lösenord</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    setAuth({ ...auth, password: content })
                }}
                value={auth?.password}
                secureTextEntry={true}
            />

            <TouchableOpacity
                style={DelaySingle.bigBtn}
            onPress={() => {
                submit();
            }}
            testID="authButton"
            >
            <Text style={DelaySingle.bigBtnTxt}>{title}</Text>
            </TouchableOpacity>
            {title === "Logga in" &&
                <TouchableOpacity
                style={DelaySingle.bigBtn}
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                    testID="optRegisterButton"
                >
                    <Text style={DelaySingle.bigBtnTxt}>Registrera istället</Text>
                </TouchableOpacity>
            }
        </View>
    );
};