import React from 'react'
import {
  StyleSheet,
  ScrollView,
} from 'react-native'
import PhoneNumberInput from './src/PhoneNumberInput'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginTop: 30,
  },
})

export default function App() {
  const onChange = (phoneNumber: string, isValid: boolean) => {
    console.log(phoneNumber, isValid);
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PhoneNumberInput
        onChange={onChange}
      />
    </ScrollView>
  )
}
