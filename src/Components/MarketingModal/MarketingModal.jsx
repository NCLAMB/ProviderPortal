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
import { Carousel, InputGroup } from 'react-bootstrap';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';



class MarketingModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: props.showModal,
            isLoadingModal: true,
            researchFeedImageUrl: "",
            eventFeedImageUrl: "",
            erfFeaturesUrl: "",
            closeSigninModalCallback: props.closeSigninModalCallback,
            internalId: props.internalId,
            dontShowMarketingModal: false,
            modalTitle: ""
        };

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal,
            researchNoteId: props.researchNoteId,
            closeSigninModalCallback: props.closeSigninModalCallback
        });
    }
    componentDidMount() {
        this.GetMarketingModalContent();
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
            email: ""
        }, this.state.closeSigninModalCallback);
    }
    GetMarketingModalContent() {

        GetValidUserToken().then((response) => {

         

            const url = document.getElementById('function-server-url').value + "/api/Portal/MarketingModal/GetMarketingModal";
            const token = response;
            const providerId = document.getElementById('provider-id').value;
            const internalId = this.state.internalId;

            axios.get(url,
                {
                    params: {
                        token: token,
                        providerId: providerId,
                        internalId: internalId
                    }
                }).then((response) => {

                    this.setState({
                        researchFeedImageUrl: response.data.ResearchFeedArticleImageUrl,
                        eventFeedImageUrl: response.data.EventFeedArticleImageUrl,
                        erfFeaturesUrl: response.data.ErfFeaturesUrl,
                        isLoadingModal: false,
                        modalTitle: response.data.ModalTitle

                    });
                });

        });


    }
    handleInputChange() {

        const url = document.getElementById('function-server-url').value + "/api/Portal/MarketingModal/SetHideMarketingModal";
        const token = document.getElementById('usr-token').value;


        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        axios.get(url,
            {
                params: {
                    token: token,
                    
                }
            }).then((response) => {

                this.setState({
                    [name]: value
                });

                //this.setState({
                //    researchFeedImageUrl: response.data.ResearchFeedArticleImageUrl,
                //    eventFeedImageUrl: response.data.EventFeedArticleImageUrl,
                //    erfFeaturesUrl: response.data.ErfFeaturesUrl,
                //    isLoadingModal: false

                //});
            });
    }
    handleLearnMoreButtonClick() {
        (e) => {
            e.preventDefault();
            window.location.href = this.state.erfFeaturesUrl;
        }
    }

    render() {
        var modalClass = "theme-" + document.getElementById("provider-name").value + " modal-overlay";
        const providerName = document.getElementById('provider-name').value;

        if (this.state.isLoadingModal === true) {
            return (
                <FiltersLoading />
            );
        }
        else {
        return (
            <div>
                <Modal
                    onAfterOpen={this.afterOpenModal}
                    isOpen={this.state.showModal}
                    contentLabel="How to embed your Research and Events Feeds"
                    className="modal-window"
                    overlayClassName={"theme-" + document.getElementById("provider-name").value + " theme-generic modal-overlay"}
                    closeTimeoutMS={500}
                >
                    <div className="container">

                        <div className="row">
                            <button id='button' className="btn-close" aria-label="Close" data-dismiss="modal" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimes} size="lg" /></button>
                            <div className="col-sm-12">

                                <h2 className="text-center">{this.state.modalTitle}</h2>

                                {this.state.researchFeedImageUrl !== "" &&
                                    this.state.eventFeedImageUrl == "" &&
                                    <div>
                                    <h3 className="text-center">How to embed your Research Feeds</h3>
                                    <p>Through our technology partner, Research Tree, you can now compliantly embed your research straight into your website</p>
                                    </div>
                                }

                                {this.state.researchFeedImageUrl == "" &&
                                    this.state.eventFeedImageUrl !== "" &&
                                    <div>
                                    <h3 className="text-center">How to embed your Events Feeds</h3>
                                    <p>Through our technology partner, Research Tree, you can now compliantly embed your events straight into your website</p>
                                     </div>
                                }

                                {this.state.researchFeedImageUrl !== "" &&
                                    this.state.eventFeedImageUrl !== "" &&
                                    <div>
                                    <h3 className="text-center">How to embed your Research and Events Feeds</h3>
                                    <p>Through our technology partner, Research Tree, you can now compliantly embed your research and events straight into your website</p>
                                    </div>
                                }

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Carousel>
                                    {this.state.researchFeedImageUrl !== "" &&
                                        <Carousel.Item interval={3000}>

                                            <img className="bd-placeholder-img d-block w-100" role="img" aria-label="Placeholder: Thumbnail" src={this.state.researchFeedImageUrl} />
                                     
                                        </Carousel.Item>
                                    }
                                    {this.state.eventFeedImageUrl !== "" &&
                                        <Carousel.Item interval={3000}>

                                            <img className="bd-placeholder-img d-block w-100" role="img" aria-label="Placeholder: Thumbnail" src={this.state.eventFeedImageUrl} />
                                    
                                        </Carousel.Item>
                                    }
                                </Carousel>

                            </div>
                        </div>
                        


                        <div className="row">
                            <div className="col-sm-12">
                                <label className="form-inputs">
                                    <li>Don't show me this again.
							        <input name="dontShowMarketingModal" type="checkbox" checked={this.state.dontShowMarketingModal} onChange={this.handleInputChange} />
                                        <span className="checkmark"></span>
                                        {this.state.showtandcMessage === true &&
                                            <span className='error'> *</span>
                                        }
                                    </li>
                                </label>
         
                           
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-sm-12 col-lg-6 order-2 order-md-2 text-center">
                                <button className="btn-primary" onClick={
                                    (e) => {
                                        e.preventDefault();
                                        window.open(this.state.erfFeaturesUrl, "_blank")
                                    }
                                }><FontAwesomeIcon icon={faArrowCircleRight} size="lg" />Learn more</button>
                            </div>
                            <div className="col-sm-12 col-lg-6 order-1 order-md-2 text-center">
                                <button className="btn-secondary" onClick={this.handleCloseModal}><FontAwesomeIcon icon={faTimesCircle} size="lg" />Close</button>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div>
            
            );
        }
    }
}

export default MarketingModal;