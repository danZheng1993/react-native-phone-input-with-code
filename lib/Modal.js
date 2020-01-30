import React from 'react';
import ModalComponent, { ModalContent } from 'react-native-modals';
export default class Modal extends React.Component {
    render() {
        const { visible } = this.props;
        return (React.createElement(ModalComponent, { visible: visible },
            React.createElement(ModalContent, { style: { flex: 1 } }, this.props.children)));
    }
}
//# sourceMappingURL=Modal.js.map