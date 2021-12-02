import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FeedLoading from '../ResearchHub/FeedLoading.jsx';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';
import SignInModal from './../SignInModal.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faHome, faLock } from '@fortawesome/free-solid-svg-icons';

class MediaPage extends React.Component {
    constructor(props) {
        super(props);

        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            parentIFrame.autoResize(true);
            console.log('restoring autoResize')
        }

        let allowAnonymousAccess = false;
        if (document.getElementById('allow-anonymous-access').value === 'True') {
            allowAnonymousAccess = true;
        }

        
        this.state = {
            isLoading: true,
            response: null,
            showSignUpModal: false,
            allowAnonymousAccess: allowAnonymousAccess
        };
        this.openSigninModal = this.openSigninModal.bind(this);
        this.closeSigninModal = this.closeSigninModal.bind(this);


        console.log(this.state.allowAnonymousAccess);
    }


    componentDidMount() {
        GetValidUserToken().then((token) => {
            this.fetchMedia(token);
        });
    } openSigninModal(e) {
        e.preventDefault();
        this.setState({
            showSignUpModal: true
        });
    }
    closeSigninModal() {

        this.setState({
            forwardToHub: true,
            showSignUpModal: false
        });
    }
    fetchMedia(userToken) {
        const url = document.getElementById('function-server-url').value + "/api/Portal/Media/Media";
        const mediaItemId = this.props.match.params.mediaId;
        axios.get(url,
            {
                params: {
                    token: userToken,
                    mediaitemid: mediaItemId
                }
            }).then((response) => {

            this.setState({
                isLoading: false,
                showSignUpModal: false,
                response: response.data
            });
        });
    }
    resize() {
        this.setState({ hideNav: window.innerWidth <= 760 });
    }

    render() {
        const state = this.state;
        const providerName = document.getElementById('provider-name').value;

        return (

            <Container>
                <Row>
					<Col sm={12} lg={12}>
         
                        {state.isLoading === true &&
                            <div className="loading">
                                <div className="sk-folding-cube">
                                    <div className="sk-cube1 sk-cube"></div>
                                    <div className="sk-cube2 sk-cube"></div>
                                    <div className="sk-cube4 sk-cube"></div>
                                    <div className="sk-cube3 sk-cube"></div>
                                </div>
                                <p>Loading</p>
                            </div>
                        }
                        {this.state.isLoading === false &&
                            this.state.response.DoesMediaExist === false &&
                        <div class="error-template">
                            <h1>Sorry!</h1>
                            <h2>Media doesn't exist.</h2>
                        </div>
                            
                        }
                        {this.state.isLoading === false && 
                            this.state.response.IsAuthorised === false &&
                            this.state.allowAnonymousAccess === false &&
                            this.state.response.DoesMediaExist === true &&
                            
                        <div className="error-template">
                            <h1>Sorry!</h1>
                            <FontAwesomeIcon icon={faLock} size="md" className="circle-icon" />
                            <h2>No access to this video</h2>
                            <div className="error-details">
                                <p>Please either login or register to access the content</p>
                                <p>Alternatively, please contact if you are an institutional investor who would like to get access.</p>
                            </div>
                            <div className="error-actions">
                                <a href="" onClick={this.openSigninModal} class="btn btn-primary btn-lg"><FontAwesomeIcon icon={faHome} size="md" />Login </a>
                                <a href={"mailto:" + this.state.response.ContactEmail} target="_top" className="btn btn-secondary btn-lg"><FontAwesomeIcon icon={faEnvelopeOpenText} size="md" />Contact</a>
                            </div>
                        </div>
                        }
                        <SignInModal
                            closeTimeoutMS={500}
                            className="modal-window"
                            isIpo={false}
                            overlayClassName= "modal-overlay"
                            showModal={this.state.showSignUpModal}
                            //researchNoteId={this.state.researchNoteId}
                            closeSigninModalCallback={this.closeSigninModal} />

                        
                        {this.state.isLoading === false &&
                            (this.state.response.IsAuthorised === true || this.state.allowAnonymousAccess === true) &&
                            this.state.response.DoesMediaExist === true &&
                            <Row>
                            
                                <Col sm={12}>
                                    <h1>{state.response.Title}</h1>
                                </Col>
                            
                                <Col sm={12}>
                                    <h3>Companies: {state.response.CompanyName}</h3>
                                </Col>
                                <Col sm={12}>
										<ul className="info">
											<li>Date:
												<span>{state.response.PublishedDate}</span>
											</li>
										</ul>
                               
                                </Col>
                            
                            <div className="col-sm-12 d-block d-sm-block d-md-none">
                                    <iframe
                                        frameBorder='0'
                                        scrolling='no'
                                        width="100%"
                                        height="400px"
                                        alt={state.response.AltText}
                                        src={state.response.MediaItemUrl}
                                        frameBorder="0"
                                        allowFullScreen oallowfullscreen="" msallowfullscreen=""></iframe>

                                </div>
                                
                            <div className="col-sm-12 d-none d-md-block d-lg-none">
                                        <iframe
                                            frameBorder='0'
                                            scrolling='no'
                                            width="100%"
                                            height="500px"
                                            alt={state.response.AltText}
                                            src={state.response.MediaItemUrl}
                                            frameBorder="0"
                                              allowFullScreen oallowfullscreen="" msallowfullscreen=""></iframe>

                                    </div>

                            <div className="col-sm-12 d-none d-lg-block d-xl-block">
                                    <iframe
                                        frameBorder='0'
                                        scrolling='no'
                                        width="100%"
                                        height="600px"
                                        alt={state.response.AltText}
                                        src={state.response.MediaItemUrl}
                                        frameBorder="0"
                                        allowFullScreen oallowfullscreen="" msallowfullscreen=""></iframe>

                                </div>
                           
                                <div className="col-sm-12">
                                <span dangerouslySetInnerHTML={{ __html: this.state.response.Body }} />
                                </div>
                           
                            

                            </Row>
                            }
                        
                           

                    </Col>
                </Row>
            </Container>
        );

    }
}



export default MediaPage;