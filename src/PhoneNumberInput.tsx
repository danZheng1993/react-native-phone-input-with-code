import React, { useState } from 'react'
import { TextInput, View, ViewProps, TextInputProps } from 'react-native'
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js'

import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { ThemeProvider, DEFAULT_THEME } from './CountryTheme'
import { CountryPicker } from './CountryPicker'
import { CountryCode, Country } from './types'

// interface Props {
//   countryCode: CountryCode
//   onSelect(country: Country): void
// }

const Main = () => {
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>()
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [country, setCountry] = useState<any>(null)
  const [invalid, setInvalid] = useState<boolean>(false)
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const onChangePhoneNumber = (text: string) => {
    const { cca2 } = country;
    const result = new AsYouType(cca2).input(text);
    if (cca2) {
      try {
        const phoneInfo = parsePhoneNumber(text, cca2);
        if (phoneInfo.isValid()) {
          console.log('valid');
          setInvalid(false);
        } else {
          console.log('invalid');
          setInvalid(true);
        }
      } catch(err) {
        setInvalid(true);
      }
      setPhoneNumber(result);
    } else {
      setPhoneNumber(text);
      setInvalid(true);
    }
  }
  const [visible, setVisible] = useState<boolean>(false)
  let inputHightlight = styles.inputHighlight;
  if (phoneNumber !== '') {
    inputHightlight = invalid ? styles.invalidInputHighlight : styles.validInputHighlight;
  }
  const inputStyle = {...styles.inputStyle, ...inputHightlight};
  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <CountryProvider value={DEFAULT_COUNTRY_CONTEXT}>
        <View style={styles.wrapper as ViewProps}>
          <CountryPicker
            withFlag
            withCallingCode
            withCallingCodeButton
            withFilter
            withModal
            withEmoji={false}
            modalProps={{visible}}
            onClose={() => setVisible(false)}
            onOpen={() => setVisible(true)}
            countryCode={countryCode}
            onSelect={onSelect}
          />
          <TextInput
            style={inputStyle as TextInputProps}
            value={phoneNumber}
            onChangeText={onChangePhoneNumber}
          />
        </View>
      </CountryProvider>
    </ThemeProvider>
  )
}

// Main.defaultProps = {
//   onSelect: () => {},
//   withEmoji: true,
// }

const styles = {
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputStyle: {
    flex: 1,
    marginLeft: 10,
    height: 48,
    fontSize: 17,
    lineHeight: 28,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  inputHighlight: {
    borderColor: '#F4F4F4',
  },
  validInputHighlight: {
    borderColor: 'orange',
  },
  invalidInputHighlight: {
    borderColor: '#AE663'
  }
}

export default Main
export {
  getCountriesAsync as getAllCountries,
  getCountryCallingCodeAsync as getCallingCode,
} from './CountryService'
export { CountryModal } from './CountryModal'
export { DARK_THEME, DEFAULT_THEME } from './CountryTheme'
export { CountryFilter } from './CountryFilter'
export { CountryList } from './CountryList'
export { FlagButton } from './FlagButton'
export { Flag } from './Flag'
export { HeaderModal } from './HeaderModal'
export * from './types'
