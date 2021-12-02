import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import DefaultFeedTileContainer from '../Feed/DefaultFeedTileContainer.jsx';
import EventFeed from '../Events/EventFeed.jsx';
import debounce from 'lodash.debounce';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import FeedLoading from '../ResearchHub/FeedLoading.jsx';
import FilterError from '../ResearchHub/FilterError.jsx';
import FeedError from '../ResearchHub/FeedError.jsx';
import MarketingModal from '../MarketingModal/MarketingModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';
import { Navbar, Nav, Tabs, Tab} from 'react-bootstrap';

const isAuthenticated = document.getElementById('is-authenticated').value;
const allowAnonymousAccess = document.getElementById('allow-anonymous-access').value;

class Company extends React.Component {

    constructor(props) {
        super(props);

        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
        const uid = this.props.match.params.uidParam;
        const internalId = this.props.match.params.companyid;
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            parentIFrame.autoResize(true);
            console.log('restoring autoResize')
        }
        let tabId = this.props.match.params.tabParam;

        if (tabId === undefined) {
            tabId = "research";
        }

        if (uid !== undefined) {
            window.parent.postMessage("[uid]" + uid, "*");

        }
        
        this.state = {
            isAuthenticated: isAuthenticated,
            isLoadingCompany: true,
            isLoadingFeed: true,
            eventFeedLoaded: false,
            researchVideoFeedLoaded: false,
            internalId: internalId,
            tabId: tabId,
            company: null,
            showResearchOnly: tabId === "research",
            showVideosOnly: tabId === "media",
            tabLoadErrorOccurred: false,
            isFeedEmpty: false,
            allowAnonymousAccess: allowAnonymousAccess,
            showMarketingModal: false
        };

        this.closeMarketingModal = this.closeMarketingModal.bind(this);

    }

    componentDidMount() {
        this.GetCompany();
    }

    componentWillUnmount() {

    }

    handleTabSelect = (key) => {
        this.setState({ key });

        const stateObj = this.state;

        let newUrl = this.props.location.pathname;
        
        newUrl = newUrl + "/" + key;
        window.parent.postMessage("[urlchange]" + newUrl, "*");

        if (key === "events") {

            this.setState({
                isLoadingCompany: false,
                isLoadingFeed: true,
            }, this.DoEventSearch());
        }
        else {
            this.setState({
                isLoadingCompany: false,
                isLoadingFeed: true,
                showResearchOnly: key === "research",
                showVideosOnly: key === "media"
            }, this.DoSearch());
        }

    }

    scrollToTop() {

        window.parent.postMessage("[scrollToTop]", "*");
    }

    async GetCompany() {
        var response = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value + "/api/Portal/Companies/GetCompany";
        const token = response;
        const providerId = document.getElementById('provider-id').value;

        this.scrollToTop();

        axios.get(url,
            {
                params: {
                    token: token,
                    providerId: providerId,
                    internalid:this.state.internalId
                }
            }).then((response) => {
                if (this.state.tabId === "events") {
                    this.setState({
                        isLoadingCompany: false,
                        company: response.data.Company,
                        showRatings: response.data.ShowRatings,
                        showMarketingModal: response.data.ShowMarketingModal
                    }, this.DoEventSearch());

                }
                else {
                    this.setState({
                        isLoadingCompany: false,
                        company: response.data.Company,
                        showRatings: response.data.ShowRatings,
                        showMarketingModal: response.data.ShowMarketingModal
                    }, this.DoSearch());
                }


        });

    }
    closeMarketingModal() {
        this.setState({
            showMarketingModal: false
        });
    }
    DoEventSearch() {
        this.setState({
            isLoadingFeed: true
        });

        GetValidUserToken().then((response) => {
            const url = document.getElementById('function-server-url').value + "/api/Portal/Events/EventsHub";
            const token = response;
            const providerId = document.getElementById('provider-id').value;
            
            axios.get(url,
                {
                    params: {
                        token: token,
                        providerId: providerId,
                        internalId: this.state.company.InternalCompanyId
                    }
                }).then((response) => {

                    this.setState({
                        isLoadingCompany: false,
                        isLoadingFeed: false,
                        eventFeedLoaded: true,
                        researchVideoFeedLoaded: false,
                        events: response.data,
                        isFeedEmpty: response.data.IsFeedEmpty

                    });
                });
        });
    }
    DoSearch() {
        this.setState({
            isLoadingFeed: true,
            eventFeedLoaded: false
        });

        GetValidUserToken().then((response) => {
            const url = document.getElementById('function-server-url').value + "/api/Portal/ResearchHub/Feed";
            const token = response;
            const providerId = document.getElementById('provider-id').value;

            axios.get(url,
                {
                    params: {
                        token: token,
                        contentProviderIds: providerId,
                        startRow: 0,
                        numOfRows: 20,
                        searchText: this.state.company.InternalCompanyId,
                        ShowEis: this.state.showResearchOnly,
                        showNonEis: this.state.showResearchOnly,
                        showDailyReports: this.state.showResearchOnly,
                        showFullResearchReports: this.state.showResearchOnly,
                        showMediaContent: this.state.showVideosOnly
                    }
                }).then((response) => {

                    this.setState({
                        isLoadingCompany: false,
                        isLoadingFeed: false,
                        feedItems: response.data,
                        NextPageUrl: response.data.FeedItems.NextPageUrl,
                        feedItemCollection: response.data.FeedItems.ContentFeedItems,
                        areMoreItems: response.data.FeedItems.ShowNext,
                        tabLoadErrorOccurred: response.data.ErrorOccurred,
                        researchVideoFeedLoaded: true
                    });

                    
                });
        });

    }
    render() {
        const state = this.state;
        const providerName = document.getElementById('provider-name').value;
        if (state.isLoadingCompany === true) {
            return (
                <FiltersLoading/>
            );
        } else if (state.ErrorOccurred === true) {
            return (
                <FilterError Message={state.Message}/>
            );
        } else {
            return (


                <div className="container-fluid px-4">

                    {state.isLoadingCompany === false &&

                    <MarketingModal
                        showModal={this.state.showMarketingModal}
                        closeSigninModalCallback={this.closeMarketingModal}
                        internalId={this.state.company.InternalCompanyId} />

                    }
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="inline">
                                <ul className="tile-info">
                                    <li className="name">{state.company.CompanyName}
                                        {state.company.CurrentPrice !== "0" &&
                                            <span>  {state.company.CurrentPrice
                                            }p </span>
                                        }
                                        
                                    </li>
                                     
                                    {state.company.HideTargetPrice === false &&
                                        <li>{state.company.TargetPriceLabel}: {state.company.TargetPrice !== "0" && <span>{state.company.TargetPrice}</span>}</li>
                                    }

                                    {state.showRatings === "True" &&

                                        <li>Rating: {state.company.Recomendation !== "No Rating" && <span> {state.company.Recomendation}</span>}</li>

                                    }
                                    <li>Ticker: <span>{state.company.CompanyTicker}</span></li>
                                     

                                    {state.company.CurrentPrice !== "0" &&
                                        <li className="price-change">Price Chg: <span>{state.company.PriceChg}p</span> {state.company
                                            .PriceChangeIsNegative ===
                                            true &&
                                            <span className="negative"><FontAwesomeIcon icon={faChevronCircleDown} size="lg" /></span>

                                        }
                                            {state.company.PriceChangeIsNegative ===
                                                false &&
                                                <span className="postive"><FontAwesomeIcon icon={faChevronCircleUp} size="lg" /></span>

                                            }</li>
                                    }
                                    {state.company.CurrentPrice !== "0" &&
                                        <li>Price Chg pct: <span>{state.company.PriceChgPercent
                                        }%</span></li>
                                    }

                                    {state.showRatings === "True" &&
                                        state.company.TargetPrice !== "0" &&
                                        <li>Position Date: <span>{state.company.RecomendationDate
                                        }</span></li>
                                    }
                                    <li>{state.company.Description}</li>

                                    {state.company.HasPrimaryAnalyst === true &&
                                        <li>Primary Analyst: <Link to={`/portal/${providerName}/analysts/${state.company.PrimaryAnalyst.SeoName}`}>
                                        <span>{state.company.PrimaryAnalyst.Name}</span>
                                    </Link></li>
                                    }

                                    <li className="analysts">
                                        {state.company.HasPrimaryAnalyst === true &&
                                            <span>Other Analysts:</span>
                                        }
                                        {state.company.HasPrimaryAnalyst === false &&
                                            <span>Analysts:</span>
                                        }
                                        {state.company.Analysts.map((value, index) => {
                                            return (
                                                <span>
                                                    <Link to={`/portal/${providerName}/analysts/${value.SeoName}`}>
                                                        <span>{value.Name}</span>
                                                    </Link>
                                                </span>
                                            );
                                        })} </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12">

                            <Tabs defaultActiveKey={state.tabId} onSelect={this.handleTabSelect} id="uncontrolled-tab-example">
                                <Tab eventKey="research" title="Research">
                                    
                                    {state.isLoadingFeed === true &&
                                        <FeedLoading />
                                    }
                                    {state.isLoadingFeed === false &&
                                        state.tabLoadErrorOccurred === true &&
                                        <FeedError Message={state.feedItems.Message} />
                                    }
                                    {state.isLoadingFeed === false &&
                                        state.tabLoadErrorOccurred === false &&
                                        state.researchVideoFeedLoaded === true &&
                                        <DefaultFeedTileContainer
                                            isAuthenticated={state.isAuthenticated}
                                            isLoadingMoreFeedItems={state.isLoadingMoreFeedItems}
                                            areMoreItems={state.areMoreItems}
                                            feedItemContainer={state.feedItems.FeedItems}
                                            feedItemCollection={state.feedItemCollection}
                                            showMorehandler={this.GetNextPageOfFeedItems}
                                            showResearchOnly={state.showResearchOnly}
                                            showVideosOnly={state.showVideosOnly}
                                        scrollToTopHandler={this.scrollToTop}
                                        allowAnonymousAccess={state.allowAnonymousAccess}
                                        />
                                    }
                                </Tab>
                                <Tab eventKey="media" title="Videos">
                                    {state.isLoadingFeed === true &&
                                        <FeedLoading />
                                    }
                                    {state.isLoadingFeed === false &&
                                        state.tabLoadErrorOccurred === true &&
                                        <FeedError Message={state.feedItems.Message} />
                                    }
                                    {state.isLoadingFeed === false &&
                                        state.tabLoadErrorOccurred === false &&
                                        state.researchVideoFeedLoaded === true &&
                                        <DefaultFeedTileContainer
                                            isAuthenticated={state.isAuthenticated}
                                            isLoadingMoreFeedItems={state.isLoadingMoreFeedItems}
                                            areMoreItems={state.areMoreItems}
                                            feedItemContainer={state.feedItems.FeedItems}
                                            feedItemCollection={state.feedItemCollection}
                                            showMorehandler={this.GetNextPageOfFeedItems}
                                            showResearchOnly={state.showResearchOnly}
                                            showVideosOnly={state.showVideosOnly}
                                        scrollToTopHandler={this.scrollToTop}
                                        allowAnonymousAccess={state.allowAnonymousAccess}
                                        />
                                    }
                                </Tab>
                                <Tab eventKey="events" title="Events">
                                    {state.eventFeedLoaded}
                                   {state.isLoadingFeed === true &&
                                        <FeedLoading />
                                    }

                                    {state.isLoadingFeed === false &&
                                        state.eventFeedLoaded === true &&
                                        <EventFeed
                                            isAuthenticated={state.isAuthenticated}
                                            events={state.events}
                                            isFeedEmpty={state.isFeedEmpty}
                                        />
                                    }

                                </Tab>
                            </Tabs>


                            
                        </div>
                    </div>
                </div>
            );


        }

    }
}

export default Company;