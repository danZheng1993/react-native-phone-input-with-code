import React, { useState } from 'react'
import {
  Text,
  StyleSheet,
  PixelRatio,
  Switch,
  Button,
  ScrollView,
} from 'react-native'
import CountryPicker from './src/'
import PhoneNumberInput from './src/PhoneNumberInput'
import { CountryCode, Country } from './src/types'
import { Row } from './src/Row'
import { DARK_THEME } from './src/CountryTheme'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginTop: 30,
  },
  welcome: {
    fontSize: 17,
    textAlign: 'center',
    margin: 5,
  },
  instructions: {
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
    marginBottom: 0,
  },
  data: {
    maxWidth: 250,
    padding: 10,
    marginTop: 7,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777',
  },
})

interface OptionProps {
  title: string
  value: boolean
  onValueChange(value: boolean): void
}
const Option = ({ value, onValueChange, title }: OptionProps) => (
  <Row fullWidth>
    <Text style={styles.instructions}>{title}</Text>
    <Switch {...{ value, onValueChange }} />
  </Row>
)

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>()
  const [country, setCountry] = useState<Country>(null)
  const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(
    false,
  )
  const [withCurrencyButton, setWithCurrencyButton] = useState<boolean>(false)
  const [withFlagButton, setWithFlagButton] = useState<boolean>(true)
  const [withCallingCodeButton, setWithCallingCodeButton] = useState<boolean>(
    false,
  )

  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(false)
  const [withCurrency, setWithCurrency] = useState<boolean>(false)
  const [withModal, setWithModal] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [dark, setDark] = useState<boolean>(false)
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const switchVisible = () => setVisible(!visible)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PhoneNumberInput
        countryCode={countryCode}
        onSelect={onSelect}
      />
    </ScrollView>
  )
}
