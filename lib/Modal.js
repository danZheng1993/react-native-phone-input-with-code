import React from 'react';
import { Animated, Dimensions } from 'react-native';
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('screen');
const styles = {
    wrapper: {
        position: 'absolute',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        left: 0,
        top: 0,
        zIndex: 100,
    },
};
export default class Modal extends React.Component {
    constructor() {
        super(...arguments);
        this.aniVal = new Animated.Value(WINDOW_HEIGHT);
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (visible && !prevProps.visible) {
            this.showModal();
        }
        if (!visible && prevProps.visible) {
            this.hideModal();
        }
    }
    hideModal() {
        Animated.timing(this.aniVal, {
            toValue: WINDOW_HEIGHT,
            duration: 300,
        }).start();
    }
    showModal() {
        Animated.timing(this.aniVal, {
            toValue: 0,
            duration: 300,
        }).start();
    }
    render() {
        return (React.createElement(Animated.View, { style: [
                styles.wrapper,
                { top: this.aniVal }
            ] }, this.props.children));
    }
}
//# sourceMappingURL=Modal.js.map