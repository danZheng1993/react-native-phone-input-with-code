import React from 'react';
import ModalComponent, { ModalContent } from 'react-native-modals';

interface Props {
  visible: boolean,
  children: React.ReactNode,
}

export default class Modal extends React.Component<Props> {
  render() {
    const { visible } = this.props;
    return (
      <ModalComponent
        visible={visible}
      >
        <ModalContent style={{ flex: 1 }}>
          {this.props.children}
        </ModalContent>
      </ModalComponent>
    )
  }
}
