import config from "../config/config.json";
import storageModel from "./storage";

const favStations = {
    getFavStations: async function getFavStations() {
        const token = await storageModel.readToken();
        const headers = {
            "x-access-token": token.token
        };
        let res:Array<any> = [];
        await fetch(`${config.auth_url}/data?api_key=${config.api_key}`, { headers })
            .then(response => response.json())
            .then(data => {
                res = data.data;
            })
        return res;
    },

    createFavStations: async function createFavStations() {
        const token = await storageModel.readToken();
        let res:Array<any> = [];
        
        var data = {
            artefact: '{"favStations":true,"items":[]}',
            api_key: config.api_key
        };
        
        await fetch("https://auth.emilfolino.se/data", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
            method: 'POST'
        })
        .then(function (response) {
            return response.json();
        }).then(function(result) {
            res = result.data;
        });

        return res;
    },

    checkFavStations: async function checkFavStations() {
        const userData = await this.getFavStations();
        let artefact = userData.find(data => JSON.parse(data.artefact).favStations == true);
        if (!artefact) {
            artefact = await this.createFavStations();
        }
        return artefact;
    },

    addToArtefact: async function addToArtefact(item: string) {
        const artefactObj = await this.checkFavStations();
        const artefact = JSON.parse(artefactObj.artefact);
        artefact.items.push(item);
        const token = await storageModel.readToken();
        
        var data = {
            id: artefactObj.id,
            artefact: JSON.stringify(artefact),
            api_key: config.api_key
        };
        
        await fetch("https://auth.emilfolino.se/data", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
            method: 'PUT'
        })
        return artefact.items
        
    },

    removeFromArtefact: async function removeFromArtefact(item: string) {
        const artefactObj = await this.checkFavStations();
        const artefact = JSON.parse(artefactObj.artefact);
        artefact.items.pop(item);
        const token = await storageModel.readToken();
        
        var data = {
            id: artefactObj.id,
            artefact: JSON.stringify(artefact),
            api_key: config.api_key
        };
        
        await fetch("https://auth.emilfolino.se/data", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
            method: 'PUT'
        })

        return artefact.items

        
    },

    deleteArtefact: async function addToArtefact() {
        const artefactObj = await this.checkFavStations();
        const token = await storageModel.readToken();
        
        var data = {
            id: artefactObj.id,
            api_key: config.api_key
        };
        
        await fetch("https://auth.emilfolino.se/data", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
            method: 'DELETE'
        })
        
    },

    getFormatedItems: async function getFormatedItems() {
        const token = await storageModel.readToken();
        const headers = {
            "x-access-token": token.token
        };
        let res:Array<any> = [];
        let result: any;
        await fetch(`${config.auth_url}/data?api_key=${config.api_key}`, { headers })
            .then(response => response.json())
            .then(data => {
                result = data.data;
            })
            .catch(function(error) {
                console.log("Error: " + error.message)
                throw error;
            })
        let artefact = result.find(data => JSON.parse(data.artefact).favStations == true);
        if (artefact) {
            artefact = JSON.parse(artefact.artefact)
            return artefact.items;
        }
        
        return res;
    },

    isItemInArtefact: function isItemInArtefact(item:string, artefact:Array<any>) {
        let check = false
        artefact.forEach(arto => {
            if (arto == item) {
                check = true
            }
        });
        return check
    }
}

export default favStations;