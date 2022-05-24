import config from "../config/config.json";

const delays = {
    getDelays: async function getDelays() {
        const response = await fetch(`${config.base_url}/delayed`);
        const result = await response.json();

        return result.data;
    },
    getTimeFormated: function getTimeFormated(time:string, estTime:string) {
        const timeObj:Date = new Date(time);
        const estTimeObj:Date = new Date(estTime);
        const hours = Math.abs(estTimeObj - timeObj) / (1000 * 60 * 60) % 24;
        const minutes = Math.abs(estTimeObj.getTime() - timeObj.getTime()) / (1000 * 60) % 60;
        const timeRes = {
            "day": estTime.slice(0, 10),
            "time": time.slice(11, 16),
            "estTime": estTime.slice(11, 16),
            "hours": Math.floor(hours),
            "minutes": minutes,
        };
        return timeRes;
    },
    getDelayStation: function getDelayStation(delayCode:string, stations:Array<any>) {
        return stations.find(station => station.LocationSignature == delayCode);
    },
    getFavDelay: function getFavDelay(activityId:string, delays:Array<any>) {
        return delays.find(delay => delay.ActivityId == activityId);
    },
    getDelayObject: function getDelayObject(delay:Object, stations:Array<any>) {
        let fromLocation = "null";
        let toLocation   = "null";
        let locationsExist = false;
        if (delay.FromLocation) {
            fromLocation = this.getDelayStation(delay.FromLocation[0].LocationName, stations);
            locationsExist = true;
        }
        if (delay.ToLocation) {
            toLocation = this.getDelayStation(delay.ToLocation[0].LocationName, stations);
        }
        const res = {
            "delay": delay,
            "locations": [
                {
                    "fromLocation": fromLocation,
                    "toLocation": toLocation,
                },
                locationsExist,
            ],
            "time": this.getTimeFormated(delay.AdvertisedTimeAtLocation, delay.EstimatedTimeAtLocation)
        }
        return res;
    },
};

export default delays;