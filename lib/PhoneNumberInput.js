import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { parsePhoneNumber, AsYouType } from 'libphonenumber-js';
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext';
import { ThemeProvider, DEFAULT_THEME } from './CountryTheme';
import { CountryPicker } from './CountryPicker';
import DEFAULT_INPUT_THEME from './DefaultTheme';
const Main = (props) => {
    const { defaultPhoneNumber, onChange, invalidText, theme, countryCodes, defaultCountryCode, translation, placeholder, filterPlaceholder } = props;
    const [countryCode, setCountryCode] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [e164Parsed, setE164Parsed] = useState('');
    const [originalForm, setOriginalForm] = useState('');
    const [invalid, setInvalid] = useState(false);
    useEffect(() => {
        let parsedDefaultNumber = '';
        let parsedCountryCode;
        try {
            const asYouType = new AsYouType(defaultCountryCode);
            asYouType.input(defaultPhoneNumber);
            const asYouTypeNumber = asYouType.getNumber();
            if (asYouTypeNumber !== undefined) {
                parsedCountryCode = asYouTypeNumber.country;
                parsedDefaultNumber = asYouTypeNumber.formatNational();
            }
            else {
                parsedDefaultNumber = defaultPhoneNumber;
                parsedCountryCode = defaultCountryCode;
            }
        }
        catch (err) {
            parsedDefaultNumber = defaultPhoneNumber;
            parsedCountryCode = defaultCountryCode;
        }
        setPhoneNumber(parsedDefaultNumber);
        setCountryCode(parsedCountryCode);
    }, [defaultCountryCode, defaultPhoneNumber]);
    const onSelect = (country) => {
        setCountryCode(country.cca2);
        setPhoneNumber('');
        setE164Parsed('');
        setOriginalForm('');
    };
    const onChangePhoneNumber = (text) => {
        if (countryCode) {
            try {
                const phoneInfo = parsePhoneNumber(text, countryCode);
                if (phoneInfo.isValid()) {
                    setInvalid(false);
                    setPhoneNumber(phoneInfo.formatNational());
                    setE164Parsed(phoneInfo.formatInternational());
                    onChange(phoneInfo.formatInternational(), true);
                }
                else {
                    setInvalid(true);
                    if (text.startsWith('(')) {
                        setPhoneNumber(originalForm);
                        onChange(originalForm, false);
                        setOriginalForm(originalForm);
                    }
                    else {
                        setPhoneNumber(text);
                        onChange(text, false);
                        setOriginalForm(text);
                    }
                }
            }
            catch (err) {
                setInvalid(true);
                onChange(text, false);
                setPhoneNumber(text);
                setOriginalForm(text);
            }
        }
        else {
            setPhoneNumber(text);
            onChange(originalForm, false);
            setOriginalForm(text);
            setInvalid(true);
        }
    };
    const [visible, setVisible] = useState(false);
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
    }));
    let inputHightlight = styles.inputHighlight;
    let textIndicatorStyle = {};
    if (phoneNumber !== '') {
        inputHightlight = invalid ? styles.invalidInputHighlight : styles.validInputHighlight;
        textIndicatorStyle = invalid ? StyleSheet.flatten([styles.textIndicator, styles.invalidNumber]) : StyleSheet.flatten([styles.textIndicator, styles.validNumber]);
    }
    const textIndicatorText = invalid ? invalidText : e164Parsed;
    const inputStyle = StyleSheet.flatten([styles.inputStyle, inputHightlight]);
    return (React.createElement(ThemeProvider, { theme: {
            ...DEFAULT_THEME,
            ...theme.countrySelectorStyle,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSize,
        } },
        React.createElement(CountryProvider, { value: { ...DEFAULT_COUNTRY_CONTEXT, translation } },
            React.createElement(View, { style: styles.wrapper },
                React.createElement(CountryPicker, { withFlag: true, withCallingCode: true, withCallingCodeButton: true, withFilter: true, withModal: true, withEmoji: false, modalProps: { visible }, countryCodes: countryCodes, onClose: () => setVisible(false), onOpen: () => setVisible(true), countryCode: countryCode, onSelect: onSelect, placeholder: placeholder, filterProps: { placeholder: filterPlaceholder } }),
                React.createElement(View, { style: styles.inputWrapper },
                    React.createElement(TextInput, { style: inputStyle, value: phoneNumber, onChangeText: onChangePhoneNumber, keyboardType: "phone-pad" }),
                    phoneNumber !== '' && React.createElement(Text, { style: textIndicatorStyle }, textIndicatorText))))));
};
Main.defaultProps = {
    onChange: (phoneNumber, isValid) => { console.log({ phoneNumber, isValid }); },
    defaultPhoneNumber: '',
    invalidText: 'Invalid Number',
    theme: DEFAULT_INPUT_THEME,
    placeholder: 'Select',
    filterPlaceholder: 'Filter',
};
Main.displayName = 'PhoneNumberInput';
const baseStyles = {
    wrapper: {
        position: 'relative',
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
        borderColor: '#D14200'
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
        color: '#D14200',
    }
};
export default Main;
//# sourceMappingURL=PhoneNumberInput.js.map