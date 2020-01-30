import React from 'react'
import {
  StyleSheet,
  Platform,
  View,
} from 'react-native'
import PhoneNumberInput from './src/PhoneNumberInput'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginTop: 30,
  },
})

const theme = {
  baseHighlight: '#F4F4F4',
  validHighlight: '#EC8031',
  invalidHighlight: '#D14200',
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'Arial'
  }),
  fontSize: 16,
  inputLineHeight: 20,
  inputHeight: 48,
  countrySelectorStyle: {
    primaryColor: '#ccc',
    primaryColorVariant: '#eee',
    backgroundColor: '#ffffff',
    onBackgroundTextColor: '#000000',
    filterPlaceholderTextColor: '#aaa',
    activeOpacity: 0.5,
    itemHeight: 48,
    flagSize: 48,
    flagSizeButton: 48
  }
}

export default function App() {
  const onChange = (phoneNumber: string, isValid: boolean) => {
    console.log(phoneNumber, isValid);
  }
  return (
    <View style={styles.container}>
      <PhoneNumberInput
        onChange={onChange}
        theme={theme}
        countryCodes={['US', 'CA', 'ES', 'AZ', 'BS']}
        invalidText="Invalid Phone number"
      />
    </View>
  )
}
