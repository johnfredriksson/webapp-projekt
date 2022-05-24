import { render } from '@testing-library/react-native';
import SearchList from '../components/search/SearchList';


const products = [
    { name: "Shampoo", stock: 2 },
    { name: "Balsam", stock: 3 },
    { name: "Tvål", stock: 15 },
];

const stations = [
    {
        "AdvertisedLocationName": "Alingsås",
        "Geometry": {
            "WGS84": "POINT (12.53218546120595 57.92690516993427)"
        },
        "LocationSignature": "A",
        "PlatformLine": [
            "1",
            "2",
            "3",
            "4"
        ]
    },
    {
        "AdvertisedLocationName": "Avesta centrum",
        "Geometry": {
            "WGS84": "POINT (16.17060693896951 60.1472930337373)"
        },
        "LocationSignature": "Acm",
        "PlatformLine": [
            "1"
        ]
    },
    {
        "AdvertisedLocationName": "Arbrå",
        "Geometry": {
            "WGS84": "POINT (16.37983461815908 61.47103479246544)"
        },
        "LocationSignature": "Ab",
        "PlatformLine": [
            "1"
        ]
    },
];

test('List should contain three stations', async () => {
    const { getByText } = render(<SearchList stations={stations} />);

    const station1 = await getByText('Alingsås', { exact: false });
    const station2 = await getByText('Avesta centrum', { exact: false });
    const station3 = await getByText('Arbrå', { exact: false });

    expect(station1).toBeDefined();
    expect(station2).toBeDefined();
    expect(station3).toBeDefined();
});

test('Check if there is a MapView in the component', async () => {
    const testIdName = "mapView";
    const { getByTestId } = render(<SearchList stations={stations} />)

    const foundElement = getByTestId(testIdName);

    expect(foundElement).toBeTruthy();
})

test('Check if there is a input field in the component', async () => {
    const testIdName = "inputField";
    const { getByTestId } = render(<SearchList stations={stations} />)

    const foundElement = getByTestId(testIdName);

    expect(foundElement).toBeTruthy();
})

test('Check if there is a search button in the component', async () => {
    const testIdName = "searchButton";
    const { getByTestId } = render(<SearchList stations={stations} />)

    const foundElement = getByTestId(testIdName);

    expect(foundElement).toBeTruthy();
})