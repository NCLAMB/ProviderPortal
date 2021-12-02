import React, { useState } from "react";
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import SignInModal from './SignInModal.jsx';
import InvalidTokenModal from './InvalidTokenModal.jsx';
import WebFont from 'webfontloader';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import MetaTags from 'react-meta-tags';
import ViewSDKClient from "./PDFViewer/ViewSDKClient";
import { GetValidUserToken, VerifyCookies } from './UserTokenHelper.js';
var provider = document.getElementById('provider-name').value;

if (provider === "cenkos-securities") {
    WebFont.load({
        google: {
            families: ['Open+Sans:400,700,800']
        }
    });
}
if (provider === "sp-angel") {
    WebFont.load({
        google: {
            families: ['Muli:300,400,700,900']
        }
    });
}
if (provider === "zeus-capital") {
    WebFont.load({
        google: {
            families: ['Open+Sans:400,700,800']
        }
    });
}
if (provider === "tamesis-partners") {
    WebFont.load({
        google: {
            families: ['Nunito+Sans:300,400,600,700,900']
        }
    });
}
if (provider === "finncap") {
    WebFont.load({
        custom: {
            families: ['ABCDiatype'],
            urls: ['/ProviderPortal/src/assets/finncap/fonts/fonts.css']
        }
    });
}
if (provider === "the-life-sciences-division") {
    WebFont.load({
        google: {
            families: ['Lato:300,400,800']
        }
    });
}
if (provider === "auctus-advisors") {
    WebFont.load({
        google: {
            families: ['Open+Sans:400,600,700']
        }
    });
}
if (provider === "whireland") {
    WebFont.load({
        google: {
            families: ['Source+Sans+Pro:300;400;600']
        }
    });
}
if (provider === "vsa-capital") {
    WebFont.load({
        google: {
            families: ['Open+Sans:400,600,700']
        }
    });
}
if (provider === "couloir-capital") {
    WebFont.load({
        google: {
            families: ['Raleway:400,600,700', 'Open+Sans:400,600,700']
        }
    });
}
if (provider === "shard-capital") {
    WebFont.load({
        google: {
            families: ['Montserrat:200,400,600', 'Lato:100,300']
        }
    });
}
if (provider === "alternative-resource-capital") {
    WebFont.load({
        google: {
            families: ['Raleway:400,100']
        }
    });
}
if (provider === "first-sentinel") {
    WebFont.load({
		custom: {
            families: ['PlayfairDisplay'],
            urls: ['/ProviderPortal/src/assets/first-sentinel/fonts/fonts.css']
        }
    });
}
if (provider === "shore-capital") {
    WebFont.load({
        custom: {
            families: ['HelveticaNeueRegular','GaramondPremierPro'],
            urls: ['/ProviderPortal/src/assets/shore-capital/fonts/fonts.css']
        }
    });
}
if (provider === "inter-capital") {
    WebFont.load({
		 google: {
            families: ['Roboto:100,300,500']
        }
    });
}
if (provider === "hybridan") {
    WebFont.load({
        google: {
            families: ['Open+Sans:400,600,700']
        }
    });
}
if (provider === "hamman-partners") {
    WebFont.load({
        google: {
            families: ['Raleway:400,600,700', 'Open+Sans:400,600,700']
        }
    });
}
if (provider === "fox-davis-capital;") {
    WebFont.load({
        google: {
            families: ['Bodoni+Moda:400,600', 'Public+Sans:400,600']
        }
    });
}

class PortalHeader extends React.Component {

    constructor(props) {
        super(props);
        const showExpiredTokenValue = document.getElementById('show-expired-token').value;
        let showExpiredToken = false;
        if (showExpiredTokenValue === 'True') {
            showExpiredToken = true;
        }
       
        this.state = {
            providerName: document.getElementById('provider-name').value,
            isAuthenticated: document.getElementById('is-authenticated').value,
            username: document.getElementById('user-name').value,
            showSignUpModal: false,
            showInvalidTokenModal: showExpiredToken,
            showResearchHub: document.getElementById('show-research-hub').value,
            showMediaHub: document.getElementById('show-media-hub').value,
            showCompanyHub: document.getElementById('show-company-hub').value,
            showAnalystHub: document.getElementById('show-analyst-hub').value,
            showEventsHub: document.getElementById('show-events-hub').value,
            editPortalUrl: document.getElementById('edit-portal-url').value,
            showEditButton: document.getElementById('show-edit-button').value,
            ShowPortalRecipientFunctionality: document.getElementById('show-portal-recipient').value,
        };

        this.openSigninModal = this.openSigninModal.bind(this);
        this.closeSigninModal = this.closeSigninModal.bind(this);
        this.closeInvalidTokenModal = this.closeInvalidTokenModal.bind(this);
        this.editPortalUrlClick = this.editPortalUrlClick.bind(this);
        this.logToken();
    }

    componentDidMount() {

    }
    async logToken() {
        const token = await GetValidUserToken();
        window.parent.postMessage("[token]" + token, "*");
        const apiServer =document.getElementById('function-server-url').value
        window.parent.postMessage("[apiServer]" + apiServer, "*");
        
    }
    openSigninModal() {
        this.setState({
            showSignUpModal: true
        });
    }
    closeSigninModal() {
        this.setState({
            showSignUpModal: false
        });
    }
    closeInvalidTokenModal() {
        this.setState({
            showInvalidTokenModal: false
        });
    }
    async NavClicked() {
   
        const token = await GetValidUserToken();
        const viewSDKClient = new ViewSDKClient();
        viewSDKClient.ready().then(() => {
            /* Invoke file preview */

            viewSDKClient.RecordPdfEndView(token, "");//close any previous pdf open views
          
        });
    }
    signOut() {
        const url = "/account/LogOffPortal";
        axios.get(url,
            {
                params:
                {
                    // token: token,

                }
            }).then((response) => {

                //let path = '/portal/' + this.state.providerName + '/';
                //this.props.history.push(path);
                window.parent.postMessage("[resetportal]", '*');



            });
    }

    editPortalUrlClick() {

        const url = this.state.editPortalUrl;
        window.open(url, '_blank');

    }
	
    render() {
     
        return (
            <React.Fragment>
            <MetaTags>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </MetaTags>
            
                <Navbar  collapseOnSelect sticky="top" className="navbar shadow-sm px-4" expand="lg">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                            {this.state.showResearchHub === 'True' &&
                                <Nav.Link eventKey="1" onClick={this.NavClicked} as={Link} onContextMenu={(e) => e.preventDefault()} className="cta-tertiary" to={'/portal/' + this.state.providerName + '/'} exact="{true}">Research</Nav.Link>
                            }         
                            {this.state.showMediaHub === 'True' &&
                                <Nav.Link eventKey="2" onClick={this.NavClicked} as={Link} onContextMenu={(e) => e.preventDefault()} className="cta-tertiary" to={'/portal/' + this.state.providerName + '/media'} exact="{true}">Videos</Nav.Link>
                            }  
                        {this.state.showCompanyHub === 'True' &&
                                <Nav.Link eventKey="3" onClick={this.NavClicked} as={Link} onContextMenu={(e) => e.preventDefault()} className="cta-tertiary" to={'/portal/' + this.state.providerName + '/companies'}  exact="{true}">Companies</Nav.Link>
                            }
                        {this.state.showAnalystHub === 'True' &&
                                <Nav.Link eventKey="4" onClick={this.NavClicked} as={Link} onContextMenu={(e) => e.preventDefault()} className="cta-tertiary" to={'/portal/' + this.state.providerName + '/analysts'}  exact="{true}">Analysts</Nav.Link>
                        }
                        {this.state.showEventsHub === 'True' &&
                                <Nav.Link eventKey="5" onClick={this.NavClicked} as={Link} onContextMenu={(e) => e.preventDefault()} className="cta-tertiary" to={'/portal/' + this.state.providerName + '/events'}  exact="{true}">Events</Nav.Link>
                            }
                        
                    </Nav>
            
                    {this.state.isAuthenticated === 'True' &&
                        <Navbar.Collapse className="justify-content-end">     
                        <button onContextMenu={(e) => e.preventDefault()} to={'/portal/' + this.state.providerName + '/'} className="btn-secondary" onClick={this.signOut}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" />Sign out</button>
                        </Navbar.Collapse>
                       
                    }
                    {this.state.isAuthenticated === 'False' &&
                            <Navbar.Collapse className="justify-content-end">
                            {this.state.ShowPortalRecipientFunctionality === 'False' && 
                                <button className="btn-secondary" onClick={this.openSigninModal}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" />Sign in</button>
                            }
                            {this.state.ShowPortalRecipientFunctionality === 'True' &&
                                <button className="btn-secondary" onClick={this.openSigninModal}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" />Sign in / Sign up</button>
                            }
                            <SignInModal
                                isIpo={false}
                                showModal={this.state.showSignUpModal}
                                researchNoteId=""
                                closeSigninModalCallback={this.closeSigninModal} />
                            <InvalidTokenModal
                                showModal={this.state.showInvalidTokenModal}
                                closeModalCallback={this.closeInvalidTokenModal} />
                        </Navbar.Collapse>
                    }
                </Navbar.Collapse>
                </Navbar>
                <div className="container-fluid px-4">
                    <Row className="message-bar">
                        <div class="col-md-6 col-sm-12">{this.state.isAuthenticated === 'True' &&

                            <h3>
                            Welcome {this.state.username}
                            
                            </h3>

                        }
                        </div>
                       
                        {this.state.showEditButton === 'True' &&
                            <div class="col-md-6 col-sm-12">
                            <button className="btn-tertiary" onClick={this.editPortalUrlClick}><FontAwesomeIcon icon={faEdit} size="lg" /> Edit</button>
                        </div>
                            }
                            
                        
                        
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default PortalHeader;