import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import { GetValidUserToken } from '../UserTokenHelper.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import debounce from 'lodash.debounce';

const isAuthenticated = document.getElementById('is-authenticated').value;

class CompanyHub extends React.Component {

    constructor(props) {
        super(props);
        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
        const uid = this.props.match.params.uidParam;
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            parentIFrame.autoResize(true);
            console.log('restoring autoResize')
        }
        this.handleSearchInput = this.handleSearchInput.bind(this);

        if (uid !== undefined) {
            window.parent.postMessage("[uid]" + uid, "*");

        }
        this.state = {
            isAuthenticated: isAuthenticated,
            isLoading: true,
            isFetching:true,
        };

        
    }

    componentDidMount() {
        this.GetHubCompanies();

    }

    componentWillUnmount() {

    }


    scrollToTop() {

        window.parent.postMessage("[scrollToTop]", "*");
    }

    handleSearchInput(event) {
        console.log("Search...");
        this.setState({
            SearchTerm: event.target.value
        }, this.DeBouncedSearch);
    }

    DeBouncedSearch = debounce(() => { this.DoSearch(); }, 1000)

    DoSearch() {
        this.setState({
            isFetching: true
        });

        GetValidUserToken().then((response) => {


            const url = document.getElementById('function-server-url').value + "/api/Portal/Companies/CompanyHub";
            const token = response;
            const providerId = document.getElementById('provider-id').value;

            axios.get(url,
                {
                    params: {
                        token: token,
                        providerId: providerId,
                        searchTerm: this.state.SearchTerm
                    }
                }).then((response) => {

                    this.setState({
                        isLoading: false,
                        isFetching:false,
                        companies: response.data,
                        showRatings: response.data.ShowRatings
                    });

                });

        });



    }
    async GetHubCompanies() {

        this.DoSearch();
        //var response = await GetValidUserToken();
        //const url = document.getElementById('function-server-url').value + "/api/Portal/Companies/CompanyHub";
        //const token = response;
        //const providerId = document.getElementById('provider-id').value;

        //axios.get(url,
        //    {
        //        params: {
        //            token: token,
        //            providerId: providerId
        //        }
        //    }).then((response) => {

        //    this.setState({
        //        isLoading: false,
        //        companies: response.data,
        //        showRatings: response.data.ShowRatings
        //    });

        //});

    }

    render() {
        const state = this.state;
        const providerName = document.getElementById('provider-name').value;
        if (state.isLoading === true) {
            return (
                <FiltersLoading/>
            );
        } else if (state.companies.ErrorOccurred === true) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">Error</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container-fluid px-4">

                    <div className="row">
                        <div className="col-sm-12">
                            <input id="input-search-term" value={this.state.SearchTerm} placeholder="Search" onChange={this.handleSearchInput} className="form-control trigger-search" title="Enter a company name or ticker" />
                        </div>
                    </div>
                    {state.isFetching === true &&
                        <FiltersLoading />
                    }
                    {state.isFetching === false &&
                    <div className="row">

                        <div className="col-12">

                            {this.state.companies.ProviderPortalSectors.map((value, index) => {


                                return (

                                    <section>
                                                <h3 className="divider">{value.SectorName}</h3>

                                                <div className="container-fluid">
                                                    <div className="d-flex flex-sm-row flex-column flex-wrap">
                                                        {value.Companies.map((value, index) => {
                                                            return (
                                                                <div onContextMenu={(e) => e.preventDefault()} className="company-tile">
                                                                    <Link to={`/portal/${providerName}/companies/${value
                                                                    .InternalCompanyId}`}>

                                                                        <ul className="tile-info">
                                                                            <li className="name">{value.CompanyName
                                                                                }</li>
                                                                            <li className="">Ticker <span>{value
                                                                                    .CompanyTicker}</span></li>
                                                                            {value.CurrentPrice !== "0" &&
                                                                                    <li>Current Price: <span>{value
                                                                                        .CurrentPrice
                                                                                    }p</span></li>
                                                                                }
                                                                            {value.CurrentPrice !== "0" &&
                                                                            <li className="price-change">Price Chg: <span>{
                                                                                value.PriceChg}p</span> {value
                                                                                    .PriceChangeIsNegative ===
                                                                                    true &&
                                                                                    <span className="negative"><FontAwesomeIcon icon={
faChevronCircleDown} size="lg" /></span>
                                                                                }
                                                                                        {value
                                                                                            .PriceChangeIsNegative ===
                                                                                            false &&
                                                                                            <span className="postive"><FontAwesomeIcon icon={
faChevronCircleUp} size="lg" /></span>

                                                                                        }</li>
                                                                        } 
                                                                            {value.CurrentPrice !== "0" &&
                                                                            <li>Price Chg pct:<span>{value
                                                                                .PriceChgPercent
                                                                            }%</span></li>
                                                                        }
                                                                            {value.TargetPrice !== "0" &&
                                                                                value.HideTargetPrice === false &&
                                                                                <li>{value.TargetPriceLabel}:<span>{value.TargetPrice}</span></li>
                                                                        }
                                                                            {state.showRatings === "True" &&
                                                                                value.Recomendation !== "No Rating" &&
                                                                                    <li>Rating: <span>{value
                                                                                        .Recomendation}</span></li>
                                                                            }
                                                                            {state.showRatings === "True" &&
                                                                                value.TargetPrice !== "0" &&
                                                                                    <li>Rating Date: <span>{value
                                                                                        .RecomendationDate
                                                                                    }</span></li>
                                                                                }

                                                                        </ul>

                                                                    </Link>
                                                                </div>
                                                            );

                                                        })}
                                                    </div>
                                                </div>
                                          </section>
                                    );


                                }
                            )}

                        </div>
                        </div>
                    }
                </div>
                  
            );


        }

    }
}

export default CompanyHub;