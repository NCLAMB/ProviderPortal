import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import DefaultFeedTileContainer from '../Feed/DefaultFeedTileContainer.jsx';
import debounce from 'lodash.debounce';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import FeedLoading from '../ResearchHub/FeedLoading.jsx';
import FilterError from '../ResearchHub/FilterError.jsx';
import FeedError from '../ResearchHub/FeedError.jsx';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';

const isAuthenticated = document.getElementById('is-authenticated').value;
const allowAnonymousAccess = document.getElementById('allow-anonymous-access').value;

class Analyst extends React.Component {

    constructor(props) {
        super(props);
        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            parentIFrame.autoResize(true);
            console.log('restoring autoResize')
        }

        window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
        const uid = this.props.match.params.uidParam;
        const analystnameseo = this.props.match.params.analystnameseo;
        if (uid !== undefined) {
            window.parent.postMessage("[uid]" + uid, "*");

        }
        this.state = {
            isAuthenticated: isAuthenticated,
            isLoadingAnalyst: true,
            isLoadingFeed: true,
            analystnameseo: analystnameseo,
            analyst: null,
            showResearchOnly: false,
            showVideosOnly: false,
            allowAnonymousAccess: allowAnonymousAccess
        };
    }

    componentDidMount() {
        this.GetAnalyst();
    }

    componentWillUnmount() {

    }


    scrollToTop() {

        window.parent.postMessage("[scrollToTop]", "*");
    }

    async GetAnalyst() {

        this.scrollToTop();

        var response = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value + "/api/Portal/Analysts/GetAnalyst";
        const token = response;
        const providerId = document.getElementById('provider-id').value;

        

        axios.get(url,
            {
                params: {
                    token: token,
                    analystnameseo: this.state.analystnameseo,
                    providerid: providerId
                }
            }).then((response) => {

                this.setState({
                    isLoadingAnalyst: false,
                    analyst: response.data.ProviderPortalAnalyst
                }, this.DoSearch());

            });

    }

    DoSearch() {
        this.setState({
            isLoadingFeed: true
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
                        authorId: this.state.analyst.AuthorId,
                        ShowEis: true,
                        showNonEis: true,
                        showDailyReports: true,
                        showFullResearchReports: true,

                    }
                }).then((response) => {

                    this.setState({
                        isLoadingCompany: false,
                        isLoadingFeed: false,
                        feedItems: response.data,
                        NextPageUrl: response.data.FeedItems.NextPageUrl,
                        feedItemCollection: response.data.FeedItems.ContentFeedItems,
                        areMoreItems: response.data.FeedItems.ShowNext

                    });

                });
        });

    }

    
    render() {
        const state = this.state;
        if (state.isLoadingAnalyst === true) {
            return (
                <FiltersLoading />
            );
        } else if (state.ErrorOccurred === true) {
            return (
                <FilterError Message={state.Message} />
            );
        } else {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="inline">
                                <div className="widgets-box">
                                    <h3>{state.analyst.AuthorName}</h3>
                                    <ul className="tile-info">
                                       
                                        {state.analyst.ImageUrl === "" &&
                                            <li className="analyst-image"><img src="/assets/img/blank-profile-pic.jpg" /></li>
                                        }
                                        {state.analyst.ImageUrl !== "" &&
                                            <li className="analyst-image"><img src={state.analyst.ImageUrl} /></li>
                                        }
                                        <li className="bio"><h4>Bio:</h4> <p>{state.analyst.AnalystBio}</p></li>
                                        <li className="analysts">
                                            {state.analyst.CompaniesCoveredByAnalyst.map((value, index) => {
                                                return (
                                                    <span>
                                                        <Link to={`/portal/${value.ProviderName}/companies/${value.InternalCompanyId}`}>
                                                            <span>{value.CompanyName}</span>
                                                        </Link>
                                                    </span>
                                                );
                                            })}
                                        </li>
                                    </ul>
                                </div>
                                
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            {state.isLoadingFeed === true &&
                                <FeedLoading />
                            }
                            {state.isLoadingFeed === false &&
                                state.feedItems.ErrorOccurred === true &&
                                <FeedError Message={state.feedItems.Message} />
                            }
                            {state.isLoadingFeed === false &&
                                state.feedItems.ErrorOccurred === false &&
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

                        </div>
                    </div>
                </div>
                );
        }

    }
}

export default Analyst;