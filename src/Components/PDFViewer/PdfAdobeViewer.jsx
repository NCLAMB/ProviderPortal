import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Link, Redirect } from 'react-router-dom';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';
import SideBarTileContainer from '../SideBar/SideBarTileContainer.jsx';
import SideBarMediaTileContainer from '../SideBar/SideBarMediaTileContainer.jsx';
import SideBarEventTileContainer from '../SideBar/SideBarEventTileContainer.jsx';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import SignInModal from '../SignInModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { GetValidUserToken, VerifyCookies } from '../UserTokenHelper.js';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import queryString from 'query-string';
import ReactGA from 'react-ga';
import ViewSDKClient from "./ViewSDKClient";
import MarketingModal from '../MarketingModal/MarketingModal.jsx';
import IpoDisclaimerModal from "./IpoDisclaimerModal.jsx";


class PdfViewer extends React.Component {
    constructor(props) {
        super(props);
        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
        window.parent.postMessage("[scrollToTop]", "*");
        const uid = this.props.match.params.uidParam;

        if (uid !== undefined) {
            // window.parent.postMessage("[uid]" + uid, "*");

        }
        const values = queryString.parse(this.props.location.search);
        const encodedUri = encodeURIComponent(this.props.location.search)
        //const values = "";
        var researchNoteId = this.props.match.params.researchnote;
        var partner = this.props.match.params.partner;

        if (partner === undefined) {
            partner = '';
        }

        var referrer = this.props.match.params.referrer;
        if (referrer === undefined) {
            referrer = '';
        }

        let email = "";
        let useEmailDownloads = false;
        // let downloadUrl = `/dashboard/DownloadResearchNote?id=${researchNoteId}`;
        if (values.user !== undefined) {
            useEmailDownloads = true;
            email = values.user;
            //used for pdf tracking
            window.parent.postMessage("[userEmail]" + values.user, "*");
        }
        else {
            //clear email as downlaod is not email driven
            window.parent.postMessage("[userEmail]", "*");

        }

        let isAuthenticated = false;
        if (document.getElementById('is-authenticated').value === 'True') {
            isAuthenticated = true;
        }

        var verifyCookiesResults = VerifyCookies();

        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        this.state = {
            isIE11: isIE11,
            isLoading: true,
            showSignUpModal: false,
            showNoAccessModal: false,
            showMarketingModal: false,
            showIpoDisclaimerModal: false,
            userMustViewIpoDisclaimerOnPortal: false,
            IsAuthorised: false,
            isAuthenticated: isAuthenticated,
            IsAuthenticatedWhenRequestingDownloadUrl: false,
            IsDownloadsDisabled: false,
            ShowEnhancedAnalyticsButton: false,
            EnhancedAnalyticsUrl:"",
            contactEmail: "",
            notePageUrl: "",
            researchNoteId: researchNoteId,
            filename: "",
            partner: partner,
            referrer: referrer,
            IsContentAvailableInRecipientAddOn: false,
            SideBarIsVisible: false,
            userEmail: email,
            useEmailDownloads: useEmailDownloads,
            downloadUrl: "",
            authenticationCookiesInconsistentWithServer: verifyCookiesResults.authenticationCookiesInconsistentWithServer,
            isAuthenticatedCookieFound: verifyCookiesResults.isAuthenticatedCookieFound,
            isAuthenticatedCookieSetting: verifyCookiesResults.isAuthenticatedCookieSetting,
            serverThinksUserIsLoggedIn: verifyCookiesResults.serverThinksUserIsLoggedIn,
            showRelatedEvents: document.getElementById('show-events-hub').value,

            internalId: "",
            token: "",
            encodedUri: encodedUri,
            isIpoReport: false,
            ipoDisclaimer: ""
        };

        this.FetchUrl = this.FetchUrl.bind(this);
        this.openSigninModal = this.openSigninModal.bind(this);
        this.closeSigninModal = this.closeSigninModal.bind(this);
        this.handleRetryButton = this.handleRetryButton.bind(this);
        this.closeMarketingModal = this.closeMarketingModal.bind(this);
        this.closeIpoDisclaimerModal = this.closeIpoDisclaimerModal.bind(this);
        this.openIpoDisclaimerModal = this.openIpoDisclaimerModal.bind(this);
    }



    componentDidMount() {

        if (this.state.authenticationCookiesInconsistentWithServer === true) {
            setTimeout(function () { //Start the timer
                this.FetchUrl();
            }.bind(this),
                2000);
        } else {
            this.FetchUrl();
        }

    }
    componentDidUpdate(prevProps) {

        if (prevProps.match.params.researchnote !== this.props.match.params.researchnote) {
            window.parent.postMessage("[urlchange]" + this.props.location.pathname, '*');


            window.parent.postMessage("[scrollToTop]", "*");
            this.setState({
                isLoading: true,
                showSignUpModal: false,
                showNoAccessModal: false,
                showMarketingModal: false,
                forwardToHub: false,
                IsAuthorised: false,
                contactEmail: "",
                notePageUrl: "",
                researchNoteId: this.props.match.params.researchnote,
                IsContentAvailableInRecipientAddOn: false,
                SideBarIsVisible: false,
                userEmail: "",
                useEmailDownloads: false,
                downloadUrl: "",
                NoteExists: false,
                IsDownloadsDisabled: false,
                ShowEnhancedAnalyticsButton: false,
                EnhancedAnalyticsUrl:"",
                showIpoDisclaimerModal: false,
                userMustViewIpoDisclaimerOnPortal: false,
                showNoAccessModal: false,
                isIpoReport: false,
                ipoDisclaimer: ""
            },
                this.FetchUrl
            );
        }

    }
    handleRetryButton() {

        this.setState({

            isLoading: true,
        },
            this.FetchUrl);
    }
    openSigninModal(e) {
        e.preventDefault();
        this.setState({
            showSignUpModal: true,
            showNoAccessModal: false,
            showMarketingModal: false,
            showIpoDisclaimerModal: false,
        });
    }
    closeSigninModal() {

        this.setState({
            forwardToHub: true,
            showSignUpModal: false
        });
    }
    closeMarketingModal() {
        this.setState({
            showMarketingModal: false
        });
    }
    openIpoDisclaimerModal() {
        window.parent.postMessage("[resizerIsDisabled]true", "*");

        this.setState({
            showIpoDisclaimerModal: true,
            showSignUpModal: false,
            showNoAccessModal: false,
            showMarketingModal: false,

        });
    }
    closeIpoDisclaimerModal() {
        window.parent.postMessage("[resizerIsDisabled]true", "*");

        this.setState({
            showIpoDisclaimerModal: false
        });
    }

    openDisclaimerModal() {

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
    FetchPdf() {


        if (this.state.IsAuthorised && this.state.isIE11 === false) {



            var downloadUrl = this.state.downloadUrl;
            var filename = this.state.filename;

            var showDownloadPDF = false;
            var isDownloadDisabled = this.state.IsDownloadsDisabled;

            if (isDownloadDisabled == false) {
                showDownloadPDF = true;
            }
            const viewSDKClient = new ViewSDKClient();
           // if (this.state.isIpoReport) {
            if ('parentIFrame' in window) {
                //console.log('Stopping auto resize');
                window.parent.postMessage("[resizerIsDisabled]true", "*");

                parentIFrame.autoResize(false);

            }
                viewSDKClient.ready().then(() => {

                    viewSDKClient.RecordPdfEndView(this.state.token, "", this.state.userEmail);//close any previous open views
                    viewSDKClient.previewFile("pdf-div", downloadUrl, filename, this.state.token,
                        this.state.researchNoteId, this.state.userEmail, 'true', {
                        showDownloadPDF: showDownloadPDF, showAnnotationTools: false
                    });
                });
            //}
            //else {
            //    if ('parentIFrame' in window) {
            //        console.log('starting auto resize');
            //        window.parent.postMessage("[resizerIsDisabled]false", "*");

            //        parentIFrame.autoResize(true);
              
            //    }
            //    viewSDKClient.ready().then(() => {

            //        viewSDKClient.RecordPdfEndView(this.state.token, "", this.state.userEmail);//close any previous open views
            //        viewSDKClient.previewFile("pdf-div", downloadUrl, filename, this.state.token,
            //          this.state.researchNoteId, this.state.userEmail, 'false' {

            //            embedMode: "IN_LINE", showDownloadPDF: showDownloadPDF
            //        });
            //    });
            //}
          
            
            //viewSDKClient.ready().then(() => {

            //    viewSDKClient.RecordPdfEndView(this.state.token, "", this.state.userEmail);//close any previous open views
            //    viewSDKClient.previewFile("pdf-div", downloadUrl, filename, this.state.token, this.state.researchNoteId, this.state.userEmail, {

            //        embedMode: "SIZED_CONTAINER", showDownloadPDF: showDownloadPDF, dockPageControls: true
            //    });
            //});
         
         

        }
    }
    async FetchUrl() {
        const token = await GetValidUserToken();

        this.setState({
            token: token
        });
        let url = "/dashboard/GetDownloadUrl";

        const researchNoteId = this.state.researchNoteId;

        if (this.state.useEmailDownloads) {
            url = "/dashboard/GetDownloadUrlWithEmail";

        }

        axios.get(url,
            {
                params: {
                    token: token,
                    researchnoteid: researchNoteId,
                    email: this.state.userEmail

                }
            }).then((response) => {
                let downloadUrl = `${response.data.ServerUrl}/dashboard/PortalDownloadResearchNote?id=${this.state.researchNoteId}&token=${token}&partner=${this.state.partner}&whitelabelCompanyId=${this.state.referrer}`;
                if (this.state.useEmailDownloads) {
                    downloadUrl = `${response.data.ServerUrl}/dashboard/PortalDownloadResearchNoteWithEmail?id=${this.state.researchNoteId}&email=${this.state.userEmail}&encodedUri=${this.state.encodedUri}`;
                }


                let cookie = this.getCookie("ipodisclaimer");
                let showIpoDisclaimerModal = false;

                if ((cookie == "" || cookie != this.state.researchNoteId)
                    && response.data.NoteAccessSummary.IsIpoReport === true
                    && response.data.UserMustViewIpoDisclaimerOnPortal === true
                    && response.data.NoteAccessSummary.UserIsAuthenticated === true
                    && response.data.NoteAccessSummary.UserCanAccessNote === true
                ) {
                    showIpoDisclaimerModal = true;

                }
                if ('parentIFrame' in window) {
                    window.parent.postMessage("[resizerIsDisabled]true", "*");
                    parentIFrame.autoResize(false);
                }

                this.setState({
                    isLoading: false,
                    showSignUpModal: response.data.NoteAccessSummary.IsIpoReport &&
                        !response.data.NoteAccessSummary.UserIsAuthenticated,
                    showNoAccessModal: !response.data.NoteAccessSummary.UserCanAccessNote
                        &&
                        !(response.data.NoteAccessSummary.IsIpoReport &&
                            !response.data.NoteAccessSummary.UserIsAuthenticated)
                    ,
                    filename: response.data.NoteAccessSummary.Filename,
                    IsAuthenticatedWhenRequestingDownloadUrl: response.data.NoteAccessSummary.UserIsAuthenticated,
                    IsAuthorised: response.data.NoteAccessSummary.UserCanAccessNote,
                    pdfUrl: response.data.DownloadUrl,
                    contactEmail: response.data.NoteAccessSummary.PortalContactEmail,
                    notePageUrl: response.data.NoteAccessSummary.NotePageUrl,
                    IsContentAvailableInRecipientAddOn: response.data.NoteAccessSummary
                        .IsContentAvailableInRecipientAddOn,
                    SideBarIsVisible: true,
                    userEmail: response.data.NoteAccessSummary.UserEmail,
                    NoteExists: response.data.NoteAccessSummary.NoteExists,
                    downloadUrl: downloadUrl,
                    showMarketingModal: response.data.ShowMarketingModal,
                    internalId: response.data.InternalId,
                    IsDownloadsDisabled: response.data.NoteAccessSummary.IsDownloadDisabled,
                    ShowEnhancedAnalyticsButton: response.data.NoteAccessSummary.ShowEnhancedAnalyticsButton,
                    EnhancedAnalyticsUrl: response.data.NoteAccessSummary.EnhancedAnalyticsUrl,
                    isIpoReport: response.data.NoteAccessSummary.IsIpoReport,
                    ipoDisclaimer: response.data.NoteAccessSummary.IpoDisclaimer,
                    showIpoDisclaimerModal: showIpoDisclaimerModal
                },
                   

                    this.FetchPdf

                );


            });

    }

    render() {
        const providerName = document.getElementById('provider-name').value;

        const downloadUrl = this.state.downloadUrl;
        if (this.state.forwardToHub === true) {
            return <Redirect to={`/portal/${providerName}`} />
        }
        return (

            <div className="container-fluid px-4">
                <div className="row">
                    <div className="col-lg-9 col-md-8 col-sm-12">
                        {this.state.isLoading === true &&
                            <div className="loading">
                                <div className="sk-folding-cube">
                                    <div className="sk-cube1 sk-cube"></div>
                                    <div className="sk-cube2 sk-cube"></div>
                                    <div className="sk-cube4 sk-cube"></div>
                                    <div className="sk-cube3 sk-cube"></div>
                                </div>
                                <p>Loading Research Note</p>
                            </div>

                        }
                        <SignInModal

                            showModal={this.state.showSignUpModal}
                            isIpo={this.state.isIpoReport}
                            researchNoteId={this.state.researchNoteId}
                            closeSigninModalCallback={this.closeSigninModal} />

                        {this.state.isLoading === false &&

                            <MarketingModal
                                showModal={this.state.showMarketingModal}
                                closeSigninModalCallback={this.closeMarketingModal}
                                internalId={this.state.internalId} />
                        }


                        <Modal
                            closeTimeoutMS={500}
                            isOpen={this.state.showNoAccessModal
                                // && this.state.authenticationCookiesInconsistentWithServer === false
                            }
                            contentLabel="Login or Registration required"
                            className="modal-window"
                            overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}

                        >
                            <div className="container">
                                <div className="row">
                                    <Link className="btn-close" aria-label="Close" data-dismiss="modal" to={`/portal/${providerName}`}><FontAwesomeIcon icon={faTimes} size="lg" /></Link>

                                    <div className="col-sm-12 text-center">
                                        {this.state.NoteExists === true &&
                                            this.state.isIpoReport === false &&
                                            this.state.isAuthenticated === false &&
                                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Login or Registration required</h2>
                                        }
                                        {this.state.NoteExists === true &&
                                            this.state.isIpoReport === true &&
                                            this.state.isAuthenticated === false &&
                                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Login required</h2>
                                        }
                                        {this.state.NoteExists === true &&
                                            this.state.isAuthenticated === true &&
                                            this.state.IsContentAvailableInRecipientAddOn === true &&
                                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Registration required</h2>
                                        }
                                        {this.state.NoteExists === true &&
                                            this.state.isAuthenticated === true &&
                                            this.state.IsContentAvailableInRecipientAddOn === false &&
                                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Premium Access required</h2>
                                        }
                                        {this.state.NoteExists === false &&
                                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Sorry this Research Note does not exist</h2>
                                        }
                                    </div>

                                    <div className="col-sm-12 text-center">

                                        {this.state.NoteExists === true &&
                                            <div>

                                                {this.state.isAuthenticated === false &&
                                                    this.state.isIpoReport === false &&
                                                    <p><b>Login here:</b> If you already have an account then please <a href="" onClick={this.openSigninModal}>Login Here</a> </p>

                                                }
                                                {this.state.isAuthenticated === false &&
                                                    this.state.isIpoReport === true &&
                                                    <p>To access the pre-IPO research, please <a href="" onClick={this.openSigninModal}>Sign Up Here</a>. </p>

                                                }
                                                {this.state.IsContentAvailableInRecipientAddOn && this.state.isIpoReport === false &&
                                                    <p><b>Not set up yet?</b> You may be able to register and access our research - <Link to={`/portal/${providerName}/register/${this.state.researchNoteId}`}>Register Here</Link> </p>

                                                }

                                                {this.state.isAuthenticated === true &&
                                                    this.state.isIpoReport === true &&
                                                    this.state.IsContentAvailableInRecipientAddOn === true &&
                                                    <p>You are logged in but with an account that does not have access to this report.</p>
                                                }

                                                {this.state.isAuthenticated === true &&
                                                    this.state.isIpoReport === true &&
                                                    this.state.IsAuthorised === false &&
                                                    <p>You are logged in as {this.state.userEmail}. This does not have access to this pre-IPO report.</p>
                                                }

                                                {this.state.isIpoReport === false &&
                                                    <p><b>Institutional investor?</b> Contact <a target="_top" href={"mailto:" + this.state.contactEmail} >{
                                                        this.state.contactEmail}</a> in order to become a client and access our full research product.</p>

                                                }



                                                {this.state.isIpoReport === false &&
                                                    <p>Alternatively, please visit the following link where you may be able to access the content in <a href={
                                                        this.state.notePageUrl} target="_blank">Research Tree</a>.</p>
                                                }
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>
                        </Modal>

                        <Modal

                            isOpen={false

                            }
                            contentLabel="Sorry there has been a problem"
                            className="modal-window"
                            overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}

                        >
                            <div className="row">
                                <div className="col-sm-12 text-center">
                                    <Link className="btn-close" aria-label="Close" data-dismiss="modal" to={`/portal/${providerName}`}><FontAwesomeIcon icon={faTimes} size="lg" /></Link>
                                </div>
                                <div className="col-sm-12 text-center">
                                    <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Sorry there has been a problem</h2>

                                </div>

                                <div className="col-sm-12 text-center">

                                    {this.state.NoteExists === true &&
                                        <div>


                                            {this.state.isAuthenticatedCookieFound === false &&
                                                <p>There are important cookies missing or corrupted.
                                                    You may need to clear down your cookies or go to your
                                                    browser settings to enable them.</p>

                                            }
                                            {this.state.isAuthenticatedCookieFound === true && this.state.isAuthenticatedCookieSetting !== this.state.serverThinksUserIsLoggedIn &&
                                                <p>There has been a problem. Refreshing the page may help.</p>
                                            }
                                            <div className="col-sm-12  text-center">
                                                <button className="btn-primary" onClick={this.handleRetryButton}>Retry</button>
                                            </div>
                                        </div>

                                    }
                                </div>

                            </div>

                        </Modal>

                        {this.state.isLoading === false &&
                            this.state.IsAuthorised === true &&
                            <div>

                                {this.state.isIE11 === true &&
                                    <div>
                                        Sorry, viewing PDF's is not supported in IE. Click <a target="_bank" href={this.state.downloadUrl
                                        }>here</a> to download
                                    </div>
                                }
                                {this.state.isIE11 === false &&

                                    <div className="in-line-container">
                                        <div id="pdf-div" className="in-line-div" />
                                    </div>


                                }


                            </div>

                        }


                    </div>
                    <div onContextMenu={(e) => e.preventDefault()} className="col-lg-3 col-md-4 col-sm-12">
                        <div className="side-content">
                          
                        {this.state.isIpoReport === true &&

                            <button className="btn-primary" onClick={this.openIpoDisclaimerModal}><FontAwesomeIcon size="lg" />IPO Disclaimer</button>

                        }
                          
                        {this.state.isLoading === false &&

                            <IpoDisclaimerModal
                                showModal={this.state.showIpoDisclaimerModal}
                                ipoDisclaimer={this.state.ipoDisclaimer}
                                closeIpoDisclaimerModalCallback={this.closeIpoDisclaimerModal}
                                researchNoteId={this.state.researchNoteId}/>
                        }

                        {this.state.IsAuthorised === true &&
                            this.state.IsDownloadsDisabled === false &&
                            <a target="_blank" href={this.state.downloadUrl
                            } className='btn-secondary download'><FontAwesomeIcon icon={faFileDownload} size="lg" />Download</a>
                            }

                            {this.state.IsAuthorised === true &&
                                this.state.ShowEnhancedAnalyticsButton === true &&
                                <a target="_blank" href={this.state.EnhancedAnalyticsUrl
                            } className='btn-primary'>View Note Analytics</a>
                            }

                        {this.state.IsAuthorised === true &&
                            this.state.showRelatedEvents === 'True' &&
                            <BrowserView>
                                <SideBarEventTileContainer
                                    researchNoteId={this.state.researchNoteId}
                                    IsVisible={this.state.SideBarIsVisible} />
                            </BrowserView>

                        }
                        {this.state.IsAuthorised === true &&
                            <BrowserView>
                                <SideBarTileContainer
                                    researchNoteId={this.state.researchNoteId}
                                    IsVisible={this.state.SideBarIsVisible} />
                            </BrowserView>

                        }
                        {this.state.IsAuthorised === true &&
                            <BrowserView>
                                <SideBarMediaTileContainer
                                    researchNoteId={this.state.researchNoteId}
                                    IsVisible={this.state.SideBarIsVisible} />
                            </BrowserView>

                        }
                        </div>
                    </div>

                </div>
            </div>

        );

    }
}

export default PdfViewer;