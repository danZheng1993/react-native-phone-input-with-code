import React from 'react';
import { StyleProp, ViewStyle, ImageSourcePropType, ImageStyle } from 'react-native';
interface CloseButtonProps {
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    image?: ImageSourcePropType;
    onPress?(): void;
}
export default class CloseButton extends React.Component<CloseButtonProps> {
    render(): JSX.Element | undefined;
}
export {};
