import { Platform } from 'react-native';

import { getHeightPercent } from './ratio'

export default {
  baseHighlight: '#F4F4F4',
  validHighlight: '#EC8031',
  invalidHighlight: '#D14200',
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'Arial'
  }),
  fontSize: 18,
  inputLineHeight: 28,
  inputHeight: 48,
  countrySelectorStyle: {
    primaryColor: '#ccc',
    primaryColorVariant: '#eee',
    backgroundColor: '#ffffff',
    onBackgroundTextColor: '#000000',
    filterPlaceholderTextColor: '#aaa',
    activeOpacity: 0.5,
    itemHeight: getHeightPercent(7),
    flagSize: Platform.select({ android: 20, default: 30 }),
    flagSizeButton: Platform.select({ android: 20, default: 30 })
  }
}