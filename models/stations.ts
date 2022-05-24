import config from "../config/config.json";

const stations = {
    getStations: async function getStations() {
        const response = await fetch(`${config.base_url}/stations`);
        const result = await response.json();

        return result.data;
    },
    getFavStation: function getFavStation(LocationSignature:string, stations:Array<any>) {
        return stations.find(station => station.LocationSignature == LocationSignature);
    },
};

export default stations;