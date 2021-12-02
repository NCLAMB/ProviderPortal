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


class IpoDisclaimerModal extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            showModal: props.showModal,
            ipoDisclaimer: props.ipoDisclaimer,
            closeIpoDisclaimerModalCallback: props.closeIpoDisclaimerModalCallback,
            researchNoteId: props.researchNoteId
        };

        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    componentDidMount() {


    }
    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal,
            ipoDisclaimer: props.ipoDisclaimer

        });
    }
    afterOpenModal() {

        setTimeout(() => {

            window.parent.postMessage("[scrollToTop]", "*");
        }, 500);
    }
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    handleCloseModal() {

        console.log("closed");
        var cookie = this.getCookie("ipodisclaimer");

        if (cookie == "" || cookie != this.state.researchNoteId) {
            document.cookie = "ipodisclaimer=" + this.state.researchNoteId;
        }
        

        this.setState({

            showModal: false,
        }, this.state.closeIpoDisclaimerModalCallback);
    }
    render() {
        const providerName = document.getElementById('provider-name').value;
        return (

            <div>
                <Modal
                    onAfterOpen={this.afterOpenModal}
                    isOpen={this.state.showModal}
                    contentLabel="Ipo Disclaimer"
                    className="modal-window"
                    overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                    closeTimeoutMS={500}
                    
                >

                    <div className="container">

                        <div className="row">
                            <button id='button' className="btn-close" aria-label="Close" data-dismiss="modal" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimes} size="lg" /></button>
                           
                            <div className="col-sm-12">
                                <h2 className="text-center">Ipo Disclaimer</h2>

                                <div className="row">
                                    <div className="col-sm-12 text-left">
                                        <div className="row">
                                            <div dangerouslySetInnerHTML={{ __html: this.state.ipoDisclaimer }} />

                                        </div>

                                    </div>

                                    <div className="col-sm-12  text-center">
                                        <button className="btn-secondary" onClick={this.handleCloseModal}>Close</button>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                </Modal>

            </div>

        );
    }



}

export default IpoDisclaimerModal;