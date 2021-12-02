import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class SignInModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSendingEmail: false,
            hasSentEmail: false,
            showModal: props.showModal,
            isIpo:props.isIpo,
            researchNoteId: props.researchNoteId,
            email: "",
            showInvalidEmailMessage: false,
            closeSigninModalCallback: props.closeSigninModalCallback,
            showForwardToRegistration: false,
            ShowPortalRecipientFunctionality: document.getElementById('show-portal-recipient').value
        };
       
        this.handleResetModal = this.handleResetModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSendButtonClick = this.handleSendButtonClick.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);


    }
    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal,
            isIpo: props.isIpo,
            researchNoteId: props.researchNoteId,
            closeSigninModalCallback: props.closeSigninModalCallback

        });
    }
    componentDidMount() {


    }
    handleResetModal(e) {
        e.preventDefault();
     
        this.setState({
            isSendingEmail: false,
            hasSentEmail: false,
            email: "",
            showInvalidEmailMessage: false,
            showForwardToRegistration: false,
        });
        return false;
    }
    afterOpenModal() {

        setTimeout(() => {

            window.parent.postMessage("[scrollToTop]", "*");
        }, 500);
    }
    handleEmailInput(event) {
        this.setState({
            email: event.target.value
        });
    }
    handleCloseModal() {

        this.setState({

            isSendingEmail: false,
            hasSentEmail: false,
            email: ""
        }, this.state.closeSigninModalCallback);
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    handleSendButtonClick() {

        var emailIsValid = this.validateEmail(this.state.email);

        if (emailIsValid === false) {
            this.setState({
                showInvalidEmailMessage: true
            });
            return;

        }

        this.setState({ showInvalidEmailMessage: false, isSendingEmail: true });


        const providerId = document.getElementById('provider-id').value;
        let url = "/ProviderPortalEntry/ValidatePortalUser";
        axios.get(url,
            {
                params:
                {
                    // token: token,
                    email: this.state.email,
                    providerId: providerId,
                    researchnoteId: this.state.researchNoteId
                }
            }).then((response) => {
                console.log("response");
                this.setState({
                    hasSentEmail: true,
                    isSendingEmail: false,
                    showForwardToRegistration: response.data
                });

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
                    contentLabel="Sign In"
                    className="modal-window"
                    overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                    closeTimeoutMS={500}
                >

                    <div className="container">
                            
                        <div className="row">
                            <div className="col-sm-12">
                                {this.state.ShowPortalRecipientFunctionality === 'False' &&
                                    <h2 className="text-center">Sign in</h2>
                                }
                                {this.state.ShowPortalRecipientFunctionality === 'True' &&
                                    <h2 className="text-center">Sign in / Sign up</h2>
                                }

                                {this.state.hasSentEmail === false &&
                                    <div className="row">
                                        <div className="col-sm-12 text-left">
                                            <p>Please input your email address</p>

                                        </div>

                                        <div className="col-sm-12 text-center">
                                            <input id="input-email" onChange={this.handleEmailInput}
                                                value={this.state.email} placeholder="Please enter your email address" className="form-control" title="Please enter your email address" />

                                        </div>
                                        <div className="col-sm-12 text-center">
                                            {this.state.isSendingEmail &&
                                                <p>Please wait..</p>
                                            }
                                            {this.state.showInvalidEmailMessage &&

                                                <span className="error">Please enter a valid email</span>
                                            }
                                        </div>

                                        <div className="col-sm-6 order-1 order-md-2 text-right">
                                            <button className="btn-primary" disabled={this.state.isSendingEmail} onClick={this.handleSendButtonClick}>Send</button>
                                        </div>
                                        <div className="col-sm-6 order-2 order-md-1 text-left">
                                            <button className="btn-secondary" onClick={this.handleCloseModal}>Cancel</button>
                                    </div>
                                    </div>
                                }
                                {this.state.hasSentEmail === true && this.state.showForwardToRegistration === false &&
                                    <div className="row">
                                        <div className="col-sm-12 text-center">
                                            Please check your inbox and junk folder for our email
                            </div>
                                        <div className="col-sm-12 text-center">
                                            <button className="btn-primary" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimesCircle} size="lg" />Close</button>
                                        </div>
                                    </div>
                                }
                                {this.state.hasSentEmail === true && this.state.showForwardToRegistration === true &&
                                    !this.state.isIpo && 
                                    <div className="row">
                                        <div className="col-sm-12 text-center">
                                            <p><b>Sorry your account is not recognised: </b>
                                                You may be able to register and access our research - <Link onClick={this.handleCloseModal} to={`/portal/${providerName}/register/${this.state.researchNoteId}`}>Register Here</Link>
                                            </p>
                                        </div>
                                        <div className="col-sm-12 text-center">
                                            <button className="btn-primary" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimesCircle} size="lg" />Close</button>
                                        </div>
                                    </div>
                                }
                                {this.state.hasSentEmail === true && this.state.showForwardToRegistration === true &&
                                    this.state.isIpo &&
                                    <div className="row">
                                    <div className="col-sm-12 text-center">

                                        <p>Sorry your {this.state.email} email address is not recognised. Please
                                            <Link onClick={this.handleResetModal} to={``}> <b>Try Again Here</b></Link>
                                        </p>
                                         
                                        </div>
                                        <div className="col-sm-12 text-center">
                                            <button className="btn-primary" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimesCircle} size="lg" />Close</button>
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
export default SignInModal;

