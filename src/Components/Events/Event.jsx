import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import InquireModal from './InquireModal.jsx';
import debounce from 'lodash.debounce';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import FilterError from '../ResearchHub/FilterError.jsx';
import { Jumbotron, Container, Badge, Row, Alert, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';

const isAuthenticated = document.getElementById('is-authenticated').value;

class Event extends React.Component {

    constructor(props) {
        super(props);
        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
        const uid = this.props.match.params.uidParam;
        const eventtitleseo = this.props.match.params.eventtitleseo;
        if (uid !== undefined) {
            window.parent.postMessage("[uid]" + uid, "*");

        }
        this.state = {
            isAuthenticated: isAuthenticated,
            isLoadingEvent: true,
            isLoadingFeed: true,
            eventTitleSeo: eventtitleseo,
            event: null
        };

        this.openInquireModal = this.openInquireModal.bind(this);
        this.closeInquireModal = this.closeInquireModal.bind(this);
        this.registerButtonClick = this.registerButtonClick.bind(this);
    }

    componentDidMount() {
        this.GetEvent();
    }

    componentWillUnmount() {

    }
    openInquireModal() {
        this.setState({
            showInquireModal: true
        });
    }
    async registerButtonClick() {

        var response = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value + "/api/Portal/Events/RegisterLinkClick";
        const token = response;


        axios.get(url,
            {
                params: {
                    token: token,
                    eventTitleSeo: this.state.eventTitleSeo
                }
            }).then((response) => {

                //e.preventDefault();
                window.open(this.state.event.RegistrationUrl, "_blank")

            });
    }

    closeInquireModal() {
        this.setState({
            showInquireModal: false
        }, this.refreshPage());
    }

    scrollToTop() {

        window.parent.postMessage("[scrollToTop]", "*");
    }

    refreshPage() {
        window.location.reload(false);
    }

    async GetEvent() {
        var response = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value + "/api/Portal/Events/GetEvent";
        const token = response;
        const providerId = document.getElementById('provider-id').value;


        axios.get(url,
            {
                params: {
                    token: token,
                    eventtitleseo: this.state.eventTitleSeo,
                    providerid: providerId
                }
            }).then((response) => {

                this.setState({
                    isLoadingEvent: false,
                    event: response.data.Event
                });

            });

    }

    
    render() {
        const state = this.state;

        //var imgUrl = state.event.BannerImageUrl;
        //var divStyle = {
        //    backgroundImage: 'url(' + imgUrl + ')'
        //}

        if (state.isLoadingEvent === true) {
            return (
                <FiltersLoading />
            );
        } else if (state.ErrorOccurred === true) {
            return (
                <FilterError Message={state.Message} />
            );
        } else {
            return (
               
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    {state.event.BannerImageUrl !== "" && state.event.HasBannerImage === true &&
                        <Jumbotron fluid style={{ backgroundImage:'url(' + state.event.BannerImageUrl + ')', backgroundRepeat:'no-repeat', backgroundSize:'cover' }}>
                              <Container fluid="lg">
                                <Row>
                                
                                        <Col sm={12}>
                                            <Badge variant="primary">
                                                {state.event.EventTypeTitle}
                                            </Badge>
                                        </Col>
                                  
                            </Row>
                        </Container>
                        </Jumbotron>
                    }
                    {state.event.HasBannerImage === false &&
                        
                        <Jumbotron fluid>
                            <Container fluid="lg">
                                <Row>
                                        <Col sm={12}>
                                            <Badge variant="primary">
                                                {state.event.EventTypeTitle}
                                            </Badge>
                                        </Col>

                                </Row>
                            </Container>
                        </Jumbotron>
                        
                    }

                    <Container fluid="lg">
                        <Row>
                            <div className="teaser-title-section">
                                <Col sm={12} md={8}>
                                    
                                    <h1>{state.event.Headline}</h1>
                                    <p><FontAwesomeIcon icon={faCalendar} size="lg" /><date>{state.event.EventStartLongDate}</date></p>
                                </Col>
                                {state.event.ThumbnailUrl !== "" && state.event.HasLogoImage === true &&
                                    <Col sm={12} md={4}>
                                        {state.event.ThumbnailUrl !== "" &&
                                            <img src={state.event.ThumbnailUrl} />
                                        }
                                    </Col>
                                }
                            </div>
                        </Row>
                    </Container>
                    
                    <Container fluid="lg">
                        <div className="main-page-content">
                            <Row>
                                <div className="col-lg-8 col-12">
                                   

                                        {state.event.IsEventVisibleToUser === true &&
                                            <React.Fragment>
                                                <h2 className="sub-title">{state.event.Strapline}</h2>

                                                <div className="content" dangerouslySetInnerHTML={{ __html: state.event.Body }} />
                                            </React.Fragment>
                                        }

                                        {state.event.IsEventVisibleToUser === false &&
                                            state.event.IsUserAnonymous === true &&
                                            <Alert variant="danger">
                                                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle} size="lg" /> Sorry</Alert.Heading>
                                                <p>This event is only available to institutional users. Please contact <a href={state.event.PortalContactEmailHref}>{state.event.PortalContactEmail}</a> to explore access. Sorry you do not currently have access to this event. Please sign in for further information.</p>
                                            </Alert>
                                        }
                                        {state.event.IsEventVisibleToUser === false &&
                                            state.event.IsUserAnonymous === false &&
                                            state.event.IsEventForNonInstitutionalUsersOnly === false &&
                                            state.event.IsEventForInstitutionalUsersOnly === true &&


                                            <Alert variant="danger">
                                                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle} size="lg" /> Sorry</Alert.Heading>
                                                <p>This event is only available to institutional users. Please contact <a href={state.event.PortalContactEmailHref}>{state.event.PortalContactEmail}</a> to explore access.</p>
                                            </Alert>
                                        }
                                        {state.event.IsEventVisibleToUser === false &&
                                            state.event.IsUserAnonymous === false &&
                                            state.event.IsEventForInstitutionalUsersOnly === false &&
                                            state.event.IsEventForNonInstitutionalUsersOnly === true &&


                                            <Alert variant="danger">
                                                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle} size="lg" /> Sorry</Alert.Heading>
                                                <p>Sorry this event is only available to non-institutional users.</p>
                                            </Alert>
                                        }
                                    
                                </div>

                                {state.event.IsEventVisibleToUser === true &&

                                    <div className="col-lg-4 col-12 side-bar">


                                        {state.event.ShowInquireButton === true &&

                                            <React.Fragment>
                                                <button className="btn-primary" onClick={this.openInquireModal}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" /> Inquire</button>

                                                <InquireModal
                                                    showModal={this.state.showInquireModal}
                                                    eventId={this.state.event.EventId}
                                                    closeInquireModalCallback={this.closeInquireModal} />

                                            </React.Fragment>


                                    }

                                    {state.event.ShowRegistrationButton === true &&

                                        <React.Fragment>
                                        <button className="btn-primary" onClick={this.registerButtonClick}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" />Register</button>

                                        </React.Fragment>


                                    }

                                        {state.event.IsUserAttending === true &&


                                            <Alert variant="success"><p><FontAwesomeIcon icon={faCheckCircle} size="md" />Inquiry Sent</p></Alert>

                                        }
                                        {state.event.IsMultiDayEvent === false &&

                                            <React.Fragment>
                                                <p><FontAwesomeIcon icon={faCalendar} size="lg" /><date>{state.event.EventStartLongDate}</date></p>
                                            </React.Fragment>

                                        }
                                        {state.event.IsMultiDayEvent === true &&

                                            <p><FontAwesomeIcon icon={faCalendar} size="lg" /><date>{state.event.EventStartLongDate}</date> - <date>{state.event.EventEndLongDate}</date> </p>

                                        }
                                        <ul className="event-info">


                                            {state.event.EventTime !== "" &&

                                                <li>Time: <span>{state.event.EventTime}</span></li>


                                            }
                                            {state.event.IsUserAnonymous === false &&

                                                <React.Fragment>
                                                    <li>City: <span>{state.event.LocationCity}</span></li>

                                                    {/*<li>Details:<span>{state.event.LocationDetails}</span></li>*/}
                                                    <li>Details:<span><div className="content" dangerouslySetInnerHTML={{ __html: state.event.LocationDetails }} /></span></li>


                                                </React.Fragment>
                                            }

                                            <li>Event Type: <span>{state.event.EventTypeTitle}</span></li>


                                            {state.event.Speakers !== "" &&


                                            
                                            <li>Speakers: <span><div className="content" dangerouslySetInnerHTML={{ __html: state.event.Speakers }} /></span></li>

                                            }
                                            {state.event.Moderators !== "" &&


                                                <li>Moderators: <span>{state.event.Moderators}</span></li>


                                            }
                                            {state.event.Host !== "" &&


                                                <li>Host: <span>{state.event.Host}</span></li>


                                            }
                                            {state.event.ManagementTeam !== "" &&


                                                <li>Management Team: <span>{state.event.ManagementTeam}</span></li>


                                            }
                                            {state.event.Companies !== "" &&


                                                <li>Companies: <span>{state.event.Companies}</span></li>


                                            }


                                            {state.event.EventFiles.length > 0
                                                &&

                                                <li> Documents
        
                                        <ul>
                                                        {state.event.EventFiles.map((value, index) => {

                                                            return (
                                                                <li><a href={value.FileAddress}>{value.Title}</a></li>
                                                            );
                                                        })}
                                                    </ul>
                                                </li>
                                            }

                                        </ul>


                                        {state.event.HasBeenCancelled === true &&



                                            <Alert variant="danger">
                                                <Alert.Heading><FontAwesomeIcon icon={faExclamationCircle} size="lg" /> Event Cancelled</Alert.Heading>
                                                <h4>Reason For Cancelling</h4>
                                                <p>
                                                    <span dangerouslySetInnerHTML={{ __html: state.event.CancelledMessage }} />
                                                </p>

                                            </Alert>


                                        }

                                    </div>

                                }

                            </Row>
                        </div>
                     </Container> 
                   
                </Container>
              
              
            );
        }

    }
}

export default Event;