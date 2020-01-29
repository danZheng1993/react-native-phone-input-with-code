import React from 'react';
interface Props {
    visible: boolean;
    children: React.ReactNode;
}
export default class Modal extends React.Component<Props> {
    render(): JSX.Element;
}
export {};
