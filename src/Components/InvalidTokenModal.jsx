import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

class InvalidTokenModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            closeModalCallback: props.closeModalCallback
    };
       
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal,
            closeModalCallback: props.closeModalCallback

        });
    }
    handleCloseModal() {

        this.state.closeModalCallback();
    }

    render() {
        return (
            <div>
                
                <Modal
                    isOpen={this.state.showModal}
                    contentLabel="Login Link Expired"
                    className="modal-window"
                    overlayClassName="modal-overlay"
                    closeTimeoutMS={500}
                >
                    
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <h2>Login Link Expired</h2>
                            </div>
                             <div className="row">
                            <div className="col-sm-12 text-center">
                                This login link has expired. We have generated a new link and emailed it to you. Please check you inbox and junk folder.
                            </div>
                            <div className="col-sm-12 text-center">
                                <button className="btn-primary" onClick={this.handleCloseModal}>Close</button>
                            </div>
                        </div>
                        </div>
                    </div>
                       
                </Modal>
            </div>
        );
    }
}
export default InvalidTokenModal;

