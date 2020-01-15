import React, { useState } from 'react'
import { TextInput, Text, View, ViewProps, TextInputProps } from 'react-native'
import { parsePhoneNumber } from 'libphonenumber-js'

import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { ThemeProvider, DEFAULT_THEME } from './CountryTheme'
import { CountryPicker } from './CountryPicker'
import { CountryCode, Country } from './types'

interface Props {
  defaultPhoneNumber: string
  invalidText: string
  onChange(phoneNumber: string, isValid: boolean): void
}

const Main = (props: Props) => {
  const { defaultPhoneNumber, onChange, invalidText } = props;
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>()
  const [phoneNumber, setPhoneNumber] = useState<string>(defaultPhoneNumber)
  const [e164Parsed, setE164Parsed] = useState<string>('')
  const [originalForm, setOriginalForm] = useState<string>('')
  const [country, setCountry] = useState<any>(null)
  const [invalid, setInvalid] = useState<boolean>(false)
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
    setPhoneNumber('')
    setE164Parsed('')
    setOriginalForm('')
  }
  const onChangePhoneNumber = (text: string) => {
    const { cca2 } = country;
    if (cca2) {
      try {
        const phoneInfo = parsePhoneNumber(text, cca2);
        if (phoneInfo.isValid()) {
          setInvalid(false);
          setPhoneNumber(phoneInfo.formatNational());
          setE164Parsed(phoneInfo.formatInternational());
          onChange(phoneInfo.formatInternational(), true);
        } else {
          setInvalid(true);
          if (text.startsWith('(')) {
            setPhoneNumber(originalForm);
            onChange(originalForm, false);
            setOriginalForm(originalForm);
          } else {
            setPhoneNumber(text);
            onChange(text, false);
            setOriginalForm(text);
          }
        }
      } catch(err) {
        setInvalid(true);
        onChange(text, false);
        setPhoneNumber(text);
        setOriginalForm(text);
      }
    } else {
      setPhoneNumber(text);
      onChange(originalForm, false);
      setOriginalForm(text);
      setInvalid(true);
    }
  }
  const [visible, setVisible] = useState<boolean>(false)
  let inputHightlight = styles.inputHighlight;
  let textIndicatorStyle = {};
  if (phoneNumber !== '') {
    inputHightlight = invalid ? styles.invalidInputHighlight : styles.validInputHighlight;
    textIndicatorStyle = invalid ? {...styles.textIndicator, ...styles.invalidNumber} : {...styles.textIndicator, ...styles.validNumber}
  }
  const textIndicatorText = invalid ? invalidText : e164Parsed;
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
          <View style={styles.inputWrapper as ViewProps}>
            <TextInput
              style={inputStyle as TextInputProps}
              value={phoneNumber}
              onChangeText={onChangePhoneNumber}
            />
            {phoneNumber !== '' && <Text style={textIndicatorStyle}>{textIndicatorText}</Text>}
          </View>
        </View>
      </CountryProvider>
    </ThemeProvider>
  )
}

Main.defaultProps = {
  onChange: (phoneNumber: string, isValid: boolean) => { console.log({ phoneNumber, isValid }); },
  defaultPhoneNumber: '',
  invalidText: 'Invalid Number'
}

const styles = {
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  inputStyle: {
    width: '100%',
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
    borderColor: '#EC8031',
  },
  invalidInputHighlight: {
    borderColor: '#AE6633'
  },
  textIndicator: {
    position: 'absolute',
    left: 10,
    top: 48,
    marginTop: 5,
    fontSize: 14,
  },
  validNumber: {
    color: '#EC8031',
  },
  invalidNumber: {
    color: '#AE6633',
  }
}

export default Main
