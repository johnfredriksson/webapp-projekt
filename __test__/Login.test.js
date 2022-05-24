import { render } from '@testing-library/react-native';
import Login from '../components/auth/Login';

jest.useFakeTimers();

test('Form should have text fields with "E-post" and "Lösenord"', async () => {
    const { getByText } = render(<Login />);
    const email = await getByText('E-post');
    const password = await getByText('Lösenord');

    expect(email).toBeDefined();
    expect(password).toBeDefined();
});

test('There should be an auth button with testID "authButton"', async () => {
    const testIdName = "authButton";
    const {getByTestId} = render(<Login />);
    const foundButton = getByTestId(testIdName);

    expect(foundButton).toBeTruthy();
});

test('Form should have a button with testID "optRegisterButton"', async () => {
    const testIdName = "optRegisterButton";
    const {getByTestId} = render(<Login />);
    const foundButton = getByTestId(testIdName);

    expect(foundButton).toBeTruthy();
});