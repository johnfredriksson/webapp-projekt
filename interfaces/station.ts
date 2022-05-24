import { GeometryItem } from "./geometry.ts";

interface Station {
    AdvertisedLocationName: string,
    Geometry: GeometryItem,
    "LocationSignature": string,
}

export default Station