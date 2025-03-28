import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Loader from './Components/Loader';
import Menu from './Components/Menu';
import Income from './Components/Income';
import Expense from './Components/Expense';
import CustomTabBar from './Components/CustomTabBar';
import SubHeader from './Components/SubHeader';
import BillsAndPayments from './Components/BillsAndPayments';
import Recommendations from './Components/Recommendations';
import CreditRating from './Components/CreditRating';
import Challenges from './Components/Challenges';
import Debt from './Components/Debt';
import Profile from'./Components/Profile';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="TabMenu"
        component={Menu}
        options={{
          unmountOnBlur: false,
        }}
      />
       <Tab.Screen
        name="Rating"
        component={CreditRating}
        options={{
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={Challenges}
        options={{
          unmountOnBlur: false,
        }}
      />
       <Tab.Screen
        name="Debt"
        component={Debt}
        options={{
          unmountOnBlur: false,
        }}
      />
       <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          unmountOnBlur: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loaderEnded, setLoaderEnded] = useState(false);

  return (
    <NavigationContainer>
      {!loaderEnded ? (
        <Loader onEnd={() => setLoaderEnded(true)} />
      ) : (
        <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={MyTabs} />
        
          <Stack.Screen name="Income" component={Income} />
          <Stack.Screen name="Expense" component={Expense} />
          <Stack.Screen name="SubHeader" component={SubHeader} />
          <Stack.Screen name="BillsAndPayments" component={BillsAndPayments} />
          <Stack.Screen name="Recommendations" component={Recommendations} />

        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
