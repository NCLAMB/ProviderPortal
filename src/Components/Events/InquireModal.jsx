import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { GetValidUserToken } from '../UserTokenHelper.js';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class InquireModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSendingEmail: false,
            hasSentEmail: false,
            showModal: props.showModal,
            eventId: props.eventId,
            closeInquireModalCallback: props.closeInquireModalCallback
        };


        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleConfirmButtonClick = this.handleConfirmButtonClick.bind(this);


    }
    componentDidMount() {


    }
    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal,
            eventId: props.eventId,
            closeInquireModalCallback: props.closeInquireModalCallback

        });
    }

    afterOpenModal() {

        setTimeout(() => {

            window.parent.postMessage("[scrollToTop]", "*");
        }, 500);
    }

    handleCloseModal() {

        this.setState({

            isSendingEmail: false,
            hasSentEmail: false,
        }, this.state.closeInquireModalCallback);
    }

    async handleConfirmButtonClick() {


        this.setState({ isSendingEmail: true });
        var response = await GetValidUserToken();
        const token = response;

        const providerId = document.getElementById('provider-id').value;
        let url = "/ProviderPortalEvent/SendEventInquiryEmail";
        axios.get(url,
            {
                params:
                {
                    token: token,
                    //providerId: providerId,
                    eventId: this.state.eventId
                }
            }).then((response) => {
                console.log("response");
                this.setState({
                    hasSentEmail: true,
                    isSendingEmail: false
                }, this.state.closeInquireModalCallback);

            });
    }

    render() {
        var modalClass = "theme-" + document.getElementById("provider-name").value + " modal-overlay";
        const providerName = document.getElementById('provider-name').value;

        return (
            <div>
                <Modal
                    onAfterOpen={this.afterOpenModal}
                    isOpen={this.state.showModal}
                    contentLabel="Inquire"
                    className="modal-window"
                    overlayClassName={"theme-" + document.getElementById("provider-name").value + "modal-overlay"}
                    closeTimeoutMS={500}
                >

                    <div className="container">

                        <div className="row">
                            <button id='button' className="btn-close" aria-label="Close" data-dismiss="modal" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimes} size="lg" /></button>
                            <div className="col-sm-12">
                                <h2 className="text-center">Interest Confirmation</h2>
                                {this.state.hasSentEmail === false &&
                                    <div className="row">
                                        <div className="col-sm-12 text-left">
                                            <div className="row">
                                                <p>Please click on the button below to confirm your interest in this event.</p>
                                            </div>
                                            <div className="row">
                                                <p>An inquiry email will be sent to the relevant provider.</p>
                                            </div>
                                        </div>


                                        <div className="col-sm-6 order-1 order-md-2 text-right">
                                            <button className="btn-primary" disabled={this.state.isSendingEmail} onClick={this.handleConfirmButtonClick}>Confirm</button>
                                        </div>
                                        <div className="col-sm-6 order-2 order-md-1 text-left">
                                            <button className="btn-secondary" onClick={this.handleCloseModal}>Cancel</button>
                                        </div>
                                    </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default InquireModal;