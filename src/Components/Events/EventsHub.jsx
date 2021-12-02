import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';
import debounce from 'lodash.debounce';

const isAuthenticated = document.getElementById('is-authenticated').value;

class EventsHub extends React.Component {

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
            isFetching: true,
            isFeedEmpty: false
        };


    }

    componentDidMount() {
        this.GetHubEvents();

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

            const url = document.getElementById('function-server-url').value + "/api/Portal/Events/EventsHub";
            const token = response;
            const providerId = document.getElementById('provider-id').value;

            console.log(this.state.isFetching);

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
                        isFetching: false,
                        events: response.data,
                        isFeedEmpty: response.data.IsFeedEmpty
                    });

                });

        });



    }

    async GetHubEvents() {

        this.DoSearch();

        //var response = await GetValidUserToken();
        //const url = document.getElementById('function-server-url').value + "/api/Portal/Events/EventsHub";
        //const token = response;
        //const providerId = document.getElementById('provider-id').value;

        //axios.get(url,
        //    {
        //        params: {
        //            token: token,
        //            providerId: providerId
        //        }
        //    }).then((response) => {

        //        this.setState({
        //            isLoading: false,
        //            events: response.data
        //        });

        //    });

    }

    render() {
        const state = this.state;
        const providerName = document.getElementById('provider-name').value;

        if (state.isLoading === true) {
            return (
                <FiltersLoading />
            );
        } else if (state.events.ErrorOccurred === true) {
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

                    <div className="row px-3">
                        <div className="col-sm-12">
                            <input id="input-search-term" value={this.state.SearchTerm} placeholder="Search" onChange={this.handleSearchInput} className="form-control trigger-search" title="Enter a company name or ticker" />
                        </div>
                    </div>
                    {this.state.isFetching === true &&
                        <FiltersLoading />
                    }
                    {this.state.isFetching === false
                        && this.state.events.CurrentEvents.length > 0
                        &&
                        <section>
                    <div className="row py-4">
                        <div className="col-12">
                    
                            <div className="col-12">
                                    <h3 className="divider">Upcoming Events</h3>
                            </div>

                            <div className="d-flex flex-sm-row flex-column flex-wrap">
                                     

                                {this.state.events.CurrentEvents.map((value, index) => {

                                    return (
                                        <div onContextMenu={(e) => e.preventDefault()} className="events-tile">
                                            <Link to={`/portal/${value.ContentProvider}/events/${value.TitleSeo}`}>
                                                <span className="badge badge-primary">{value.EventType}</span>

                                                {value.HasThumbnailUrl === "True" &&
                                                    <img className="tile-img card-img-top" width="100%" src={value.ThumbnailUrl} />
                                                }

                                                {value.HasThumbnailUrl === "False" &&
                                                    value.HasBannerUrl === "True" &&
                                                    <img className="tile-img card-img-top" width="100%" src={value.BannerImageUrl} />
                                                }

                                                {value.HasThumbnailUrl === "False" &&
                                                    value.HasBannerUrl === "False" &&
                                                    <img className="tile-img card-img-top placeholder" width="100%" src={"/providerportal/src/assets/" +  providerName + "/hexagon-texture-bg.png"} />
                                                }
                                          
                                                <div className="col p-3 d-flex flex-column position-static tile-image">
                                                    <ul className="tile-info">
                                                    <li className=""><date>{value.Date}</date></li>
                                                    <li className="title"><h4>{value.Title}</h4></li>
                                                    <li className="">{value.Strapline}</li>
                                                    <li className="">Time: <span>{value.Time}</span></li>
                                                    <li className="">Location: <span>{value.Location}</span></li>
                                                    <li className="">Companies: <span>{value.Companies}</span></li>
                                                    </ul>
                                                    </div>
                                            </Link>
                                        </div>

                                    );
                                })}

                           
                        </div>
                    
                        </div>
                        </div>
                    </section>
                }

                    {this.state.isFetching === false
                        && this.state.events.PastEvents.length > 0
                        &&
                        <section>
                        <div className="row py-4">
                        <div className="col-12">
                   
                                <div className="col-12">
                                    <h3 className="divider">Past Events</h3>
                                </div>

                            <div className="d-flex flex-sm-row flex-column flex-wrap">


                                {this.state.events.PastEvents.map((value, index) => {

                                    return (
                                        <div onContextMenu={(e) => e.preventDefault()} className="events-tile">
                                            <Link to={`/portal/${value.ContentProvider}/events/${value.TitleSeo}`}>
                                                <span className="badge badge-primary">{value.EventType}</span>
                                                {value.ThumbnailUrl !== "" &&
                                                    <img className="tile-img card-img-top" width="100%" src={value.ThumbnailUrl} />
                                                }
                                                {value.HasThumbnailUrl === "False" &&
                                                    value.HasBannerUrl === "False" &&
                                                    <img className="tile-img card-img-top placeholder" width="100%" src={"/providerportal/src/assets/" + providerName + "/hexagon-texture-bg.png"} />
                                                }
                                                <div className="col p-3 d-flex flex-column position-static">
                                                    <ul className="tile-info">
                                                        <li className=""><date>{value.Date}</date></li>
                                                        <li className="title"><h4>{value.Title}</h4></li>
                                                        <li className="">{value.Strapline}</li>
                                                        <li className="">{value.Time}</li>
                                                    </ul>
                                                </div>
                                            </Link>
                                        </div>

                                    );
                                })}

                           
                        </div>
                   
                        </div>
                        </div>
                    </section>
                }
                    
                    {this.state.isFetching === false
                        && this.state.isFeedEmpty === true
                        &&

                        <section>
                            <div className="row py-4">
                                <div className="col-12 text-center">

                                <h4>
                                    There are currently no events to show you.
                                </h4>

                                   

                                </div>
                            </div>
                        </section>
                    }          
                </div>

            );
        }

    }
}

export default EventsHub;