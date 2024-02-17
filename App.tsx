import RootDrawerNavigator from './routes/drawer';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  return (
    <NavigationContainer>
      <RootDrawerNavigator />
    </NavigationContainer>
      
  );
}