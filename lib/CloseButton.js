import React from 'react';
import { Image, TouchableNativeFeedback, View, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from './CountryTheme';
const styles = StyleSheet.create({
    container: {
        height: 48,
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        height: 25,
        width: 25,
        resizeMode: 'contain'
    }
});
const CloseButtonAndroid = (props) => {
    let closeImage = require('./assets/images/close.android.png');
    if (props.image) {
        closeImage = props.image;
    }
    const { onBackgroundTextColor } = useTheme();
    return (React.createElement(View, { style: [styles.container, props.style] },
        React.createElement(TouchableNativeFeedback, { background: Platform.Version < 21
                ? TouchableNativeFeedback.SelectableBackground()
                : TouchableNativeFeedback.SelectableBackgroundBorderless(), onPress: props.onPress },
            React.createElement(View, null,
                React.createElement(Image, { source: closeImage, style: [
                        styles.imageStyle,
                        props.imageStyle,
                        { tintColor: onBackgroundTextColor }
                    ] })))));
};
const CloseButtonIOS = (props) => {
    let closeImage = require('./assets/images/close.ios.png');
    if (props.image) {
        closeImage = props.image;
    }
    const { onBackgroundTextColor } = useTheme();
    return (React.createElement(View, { style: [styles.container, props.style] },
        React.createElement(TouchableOpacity, { onPress: props.onPress },
            React.createElement(Image, { source: closeImage, style: [
                    styles.imageStyle,
                    props.imageStyle,
                    { tintColor: onBackgroundTextColor }
                ] }))));
};
const propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.any
};
CloseButtonIOS.prototype = propTypes;
CloseButtonAndroid.prototype = propTypes;
export default class CloseButton extends React.Component {
    render() {
        return Platform.select({
            ios: React.createElement(CloseButtonIOS, Object.assign({}, this.props)),
            android: React.createElement(CloseButtonAndroid, Object.assign({}, this.props)),
            web: React.createElement(CloseButtonIOS, Object.assign({}, this.props)),
        });
    }
}
//# sourceMappingURL=CloseButton.js.map