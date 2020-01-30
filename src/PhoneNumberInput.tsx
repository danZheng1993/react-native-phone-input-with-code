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
  countryCodeInvalidText: string
  theme: typeof DEFAULT_INPUT_THEME
  countryCodes?: CountryCode[]
  defaultCountryCode?: CountryCode
  translation?: TranslationLanguageCode
  placeholder?: string
  filterPlaceholder?: string
  numberPlaceholder?: string
  onChange(phoneNumber: string, isValid: boolean): void
}

const Main = (props: Props) => {
  const {
    defaultPhoneNumber,
    onChange,
    invalidText,
    theme,
    countryCodes,
    defaultCountryCode,
    translation,
    placeholder,
    filterPlaceholder,
    numberPlaceholder,
    countryCodeInvalidText,
  } = props;
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>()
  const [phoneNumber, setPhoneNumber] = useState<string>()
  // const [e164Parsed, setE164Parsed] = useState<string>('')
  const [originalForm, setOriginalForm] = useState<string>('')
  const [invalid, setInvalid] = useState<boolean>(false)
  useEffect(() => {
    // if (!!defaultCountryCode && defaultPhoneNumber) {
      let parsedDefaultNumber = '';
      let parsedCountryCode;
      try {
        const asYouType = new AsYouType(defaultCountryCode as libCountryCode);
        asYouType.input(defaultPhoneNumber)
        const asYouTypeNumber = asYouType.getNumber()
        if (asYouTypeNumber !== undefined) {
          parsedCountryCode = asYouTypeNumber.country
          parsedDefaultNumber = asYouTypeNumber.formatNational()
        } else {
          parsedDefaultNumber = defaultPhoneNumber;
          parsedCountryCode = defaultCountryCode;  
        }
      } catch (err) {
        parsedDefaultNumber = defaultPhoneNumber;
        parsedCountryCode = defaultCountryCode;
      }
      setPhoneNumber(parsedDefaultNumber);
      setCountryCode(parsedCountryCode as CountryCode);
    // }
  }, [defaultCountryCode, defaultPhoneNumber]);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setPhoneNumber('')
    // setE164Parsed('')
    setOriginalForm('')
  }
  const onChangePhoneNumber = (text: string) => {
    if (countryCode) {
      try {
        const phoneInfo = parsePhoneNumber(text, countryCode as libCountryCode);
        if (phoneInfo.isValid()) {
          setInvalid(false);
          setPhoneNumber(phoneInfo.formatNational());
          // setE164Parsed(phoneInfo.formatInternational());
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
  const hasCountryCode = originalForm.startsWith('+');
  let inputHightlight = styles.inputHighlight;
  const invalidTextStyle = StyleSheet.flatten([styles.textIndicator, styles.invalidNumber]);
  if (phoneNumber !== '') {
    inputHightlight = (invalid || hasCountryCode) ? styles.invalidInputHighlight : styles.inputHighlight;
  }
  console.log({invalid, hasCountryCode})
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
              placeholder={numberPlaceholder}
            />
            {hasCountryCode && <Text style={invalidTextStyle}>{countryCodeInvalidText}</Text>}
            {(invalid && !hasCountryCode) && <Text style={invalidTextStyle}>{invalidText}</Text>}
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
  numberPlaceholder: 'Phonenumber',
  countryCodeInvalidText: 'Please use country code selector',
}

Main.displayName = 'PhoneNumberInput'

const baseStyles = {
  wrapper: {
    position: 'relative',
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
