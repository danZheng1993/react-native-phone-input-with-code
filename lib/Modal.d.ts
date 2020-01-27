import React from 'react';
import { Animated } from 'react-native';
interface Props {
    visible: boolean;
    children: React.ReactNode;
}
export default class Modal extends React.Component<Props> {
    aniVal: Animated.Value;
    componentDidUpdate(prevProps: Props): void;
    hideModal(): void;
    showModal(): void;
    render(): JSX.Element;
}
export {};
