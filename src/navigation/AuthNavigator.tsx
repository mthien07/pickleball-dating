import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import { LoginRegisterScreen } from '../screens/auth/LoginRegisterScreen';
import { EmailSignupScreen } from '../screens/auth/EmailSignupScreen';
import { PhoneSignupScreen } from '../screens/auth/PhoneSignupScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ProfileSetupScreen } from '../screens/placeholders';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import SignupScreenDesign from '../screens/auth/SignupScreenDesign';
import LoginScreenDesign from '../screens/auth/LoginScreenDesign';
import { colors } from '../theme/tokens';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="Onboarding"
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LoginRegister" component={LoginRegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EmailSignup" component={EmailSignupScreen} />
      <Stack.Screen name="PhoneSignup" component={PhoneSignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="SignupDesign" component={SignupScreenDesign} />
      <Stack.Screen name="LoginDesign" component={LoginScreenDesign} />
    </Stack.Navigator>
  );
};
