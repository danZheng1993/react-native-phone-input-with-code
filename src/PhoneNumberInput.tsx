import React, { useState, useEffect } from 'react'
import { TextInput, Text, View, ViewProps, TextInputProps, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { parsePhoneNumber, AsYouType, CountryCode as libCountryCode } from 'libphonenumber-js'

import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { ThemeProvider, DEFAULT_THEME } from './CountryTheme'
import { CountryPicker } from './CountryPicker'
import { CountryCode, Country } from './types'
import DEFAULT_INPUT_THEME from './DefaultTheme'
import { TranslationLanguageCode } from './types'

interface Props {
  defaultPhoneNumber: string
  invalidText: string
  theme: typeof DEFAULT_INPUT_THEME
  countryCodes?: CountryCode[]
  defaultCountryCode?: CountryCode
  translation?: TranslationLanguageCode
  placeholder?: string
  filterPlaceholder?: string
  onChange(phoneNumber: string, isValid: boolean): void
}

const Main = (props: Props) => {
  const { defaultPhoneNumber, onChange, invalidText, theme, countryCodes, defaultCountryCode, translation, placeholder, filterPlaceholder } = props;
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>()
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [e164Parsed, setE164Parsed] = useState<string>('')
  const [originalForm, setOriginalForm] = useState<string>('')
  const [invalid, setInvalid] = useState<boolean>(false)
  useEffect(() => {
    if (!!defaultCountryCode && defaultPhoneNumber) {
      let parsedDefaultNumber = '';
      let parsedCountryCode;
      try {
        const asYouType = new AsYouType(defaultCountryCode as libCountryCode);
        asYouType.input(defaultPhoneNumber)
        const asYouTypeNumber = asYouType.getNumber()
        if (asYouTypeNumber !== undefined) {
          parsedCountryCode = asYouTypeNumber.country
          parsedDefaultNumber = asYouTypeNumber.formatNational()
        }
      } catch (err) {
        parsedDefaultNumber = defaultPhoneNumber;
        parsedCountryCode = defaultCountryCode;
      }
      setPhoneNumber(parsedDefaultNumber);
      setCountryCode(parsedCountryCode as CountryCode);
    }
  }, [defaultCountryCode, defaultPhoneNumber]);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setPhoneNumber('')
    setE164Parsed('')
    setOriginalForm('')
  }
  const onChangePhoneNumber = (text: string) => {
    if (countryCode) {
      try {
        const phoneInfo = parsePhoneNumber(text, countryCode as libCountryCode);
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
  const styles = StyleSheet.create(({
    wrapper: { ...baseStyles.wrapper },
    inputWrapper: { ...baseStyles.inputWrapper, height: theme.inputHeight },
    inputStyle: {
      ...baseStyles.inputStyle,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      height: theme.inputHeight,
      lineHeight: theme.inputLineHeight,
    },
    inputHighlight: {
      ...baseStyles.inputHighlight,
      borderColor: theme.baseHighlight,
    },
    validInputHighlight: {
      ...baseStyles.validInputHighlight,
      borderColor: theme.validHighlight,
    },
    invalidInputHighlight: {
      ...baseStyles.invalidInputHighlight,
      borderColor: theme.invalidHighlight,
    },
    textIndicator: {
      ...baseStyles.textIndicator,
      top: theme.inputHeight,
      marginTop: 5,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize - 2,
    },
    validNumber: {
      ...baseStyles.validNumber,
      color: theme.validHighlight,
    },
    invalidNumber: {
      ...baseStyles.invalidNumber,
      color: theme.invalidHighlight,
    }
  }))
  let inputHightlight = styles.inputHighlight;
  let textIndicatorStyle = {};
  if (phoneNumber !== '') {
    inputHightlight = invalid ? styles.invalidInputHighlight : styles.validInputHighlight;
    textIndicatorStyle = invalid ? StyleSheet.flatten([styles.textIndicator, styles.invalidNumber]) : StyleSheet.flatten([styles.textIndicator, styles.validNumber])
  }
  const textIndicatorText = invalid ? invalidText : e164Parsed;
  const inputStyle = StyleSheet.flatten([styles.inputStyle, inputHightlight]);
  return (
    <ThemeProvider
      theme={{
        ...DEFAULT_THEME,
        ...theme.countrySelectorStyle,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
      }}>
      <CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
        <View style={styles.wrapper as ViewProps}>
          <CountryPicker
            withFlag
            withCallingCode
            withCallingCodeButton
            withFilter
            withModal
            withEmoji={false}
            modalProps={{visible}}
            countryCodes={countryCodes}
            onClose={() => setVisible(false)}
            onOpen={() => setVisible(true)}
            countryCode={countryCode}
            onSelect={onSelect}
            placeholder={placeholder}
            filterProps={{ placeholder: filterPlaceholder }}
          />
          <View style={styles.inputWrapper as ViewProps}>
            <TextInput
              style={inputStyle as TextInputProps}
              value={phoneNumber}
              onChangeText={onChangePhoneNumber}
              keyboardType="phone-pad"
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
  invalidText: 'Invalid Number',
  theme: DEFAULT_INPUT_THEME,
  placeholder: 'Select',
  filterPlaceholder: 'Filter',
}

Main.displayName = 'PhoneNumberInput'

const baseStyles = {
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  } as ViewStyle,
  inputWrapper: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  } as ViewStyle,
  inputStyle: {
    width: '100%',
    marginLeft: 10,
    height: 48,
    fontSize: 17,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  } as ViewStyle | TextStyle,
  inputHighlight: {
    borderColor: '#F4F4F4',
  },
  validInputHighlight: {
    borderColor: '#EC8031',
  },
  invalidInputHighlight: {
    borderColor: '#D14200'
  },
  textIndicator: {
    position: 'absolute',
    left: 10,
    top: 48,
    marginTop: 5,
    fontSize: 14,
  } as ViewStyle | TextStyle,
  validNumber: {
    color: '#EC8031',
  },
  invalidNumber: {
    color: '#D14200',
  }
}

export default Main
