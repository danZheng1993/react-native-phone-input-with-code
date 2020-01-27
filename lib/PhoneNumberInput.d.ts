import { CountryCode } from './types';
import DEFAULT_INPUT_THEME from './DefaultTheme';
import { TranslationLanguageCode } from './types';
interface Props {
    defaultPhoneNumber: string;
    invalidText: string;
    theme: typeof DEFAULT_INPUT_THEME;
    countryCodes?: CountryCode[];
    defaultCountryCode?: CountryCode;
    translation?: TranslationLanguageCode;
    placeholder?: string;
    filterPlaceholder?: string;
    onChange(phoneNumber: string, isValid: boolean): void;
}
declare const Main: {
    (props: Props): JSX.Element;
    defaultProps: {
        onChange: (phoneNumber: string, isValid: boolean) => void;
        defaultPhoneNumber: string;
        invalidText: string;
        theme: {
            baseHighlight: string;
            validHighlight: string;
            invalidHighlight: string;
            fontFamily: string | undefined;
            fontSize: number;
            inputLineHeight: number;
            inputHeight: number;
            countrySelectorStyle: {
                primaryColor: string;
                primaryColorVariant: string;
                backgroundColor: string;
                onBackgroundTextColor: string;
                filterPlaceholderTextColor: string;
                activeOpacity: number;
                itemHeight: number;
                flagSize: number;
                flagSizeButton: number;
            };
        };
        placeholder: string;
        filterPlaceholder: string;
    };
    displayName: string;
};
export default Main;
