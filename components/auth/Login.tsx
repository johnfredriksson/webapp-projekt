import Auth from '../../interfaces/auth';
import { useState } from 'react';
import AuthModel from '../../models/auth';
import AuthFields from './AuthFields';
import { showMessage } from "react-native-flash-message";
import favDelaysModel from '../../models/favDelays';
import favStationsModel from '../../models/favStations';

export default function Login({navigation, setIsLoggedIn, setFavDelays, setFavStations}) {
    const [auth, setAuth] = useState<Partial<Auth>>({});
    async function doLogin() {
        if (auth.email && auth.password) {
            const result = await AuthModel.login(auth.email, auth.password);

            showMessage(result);

            setIsLoggedIn(true);

                (async () => {
                  const allFavDelay = await favDelaysModel.getFormatedItems()
                  setFavDelays(allFavDelay)
                  const allFavStations = await favStationsModel.getFormatedItems()
                  setFavStations(allFavStations)
                  
                })();
        } else {
            showMessage({
                message: "Saknas",
                description: "E-post eller lösenord saknas",
                type: "warning"
            });
        }
    }

    return (
        <AuthFields
            auth={auth}
            setAuth={setAuth}
            submit={doLogin}
            title="Logga in"
            navigation={navigation}
        />
    );
};