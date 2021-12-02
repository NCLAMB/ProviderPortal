import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';
import debounce from 'lodash.debounce';

class EventFeed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: props.events,
            isAuthenticated: props.isAuthenticated,
            isFeedEmpty: props.isFeedEmpty
        };

        console.log(this.state.isFeedEmpty);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(props) {
        this.setState({
            events: props.events,
        });

    }

    render() {
        return (
            
            <div className="row">
                <div className="col-12 col-sm-12">

                    { this.state.events.CurrentEvents.length > 0
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
                                                            <img className="tile-img card-img-top placeholder" width="100%" src={"/providerportal/src/assets/" + providerName + "/hexagon-texture-bg.png"} />
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

                    { this.state.events.PastEvents.length > 0
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
                    {this.state.isFeedEmpty === true
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
            </div>
            
            );
    }
}

export default EventFeed;