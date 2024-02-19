import RootDrawerNavigator from './routes/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DealsHereContextProvider } from './components/context';

export default function App() {

  return (
    <DealsHereContextProvider>
      <NavigationContainer>
        <RootDrawerNavigator />
      </NavigationContainer>
    </DealsHereContextProvider>
  )
}