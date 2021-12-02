import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FiltersLoading from '../ResearchHub/FiltersLoading.jsx';
import { GetValidUserToken } from '../UserTokenHelper.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';

const isAuthenticated = document.getElementById('is-authenticated').value;

class AnalystHub extends React.Component {


    constructor(props) {
        super(props);

        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
        const uid = this.props.match.params.uidParam;
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            parentIFrame.autoResize(true);
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            console.log('restoring autoResize')
        }
        if (uid !== undefined) {
            window.parent.postMessage("[uid]" + uid, "*");

        }
        this.state = {
            isAuthenticated: isAuthenticated,
            isLoading: true,

        };


    }

    componentDidMount() {
        this.GetHubAnalysts();

    }

    componentWillUnmount() {

    }

    scrollToTop() {

        window.parent.postMessage("[scrollToTop]", "*");
    }

    async GetHubAnalysts() {
        var response = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value + "/api/Portal/Analysts/AnalystHub";
        const token = response;
        const providerId = document.getElementById('provider-id').value;

        axios.get(url,
            {
                params: {
                    token: token,
                    providerId: providerId
                }
            }).then((response) => {

                this.setState({
                    isLoading: false,
                    analysts: response.data
                });

            });

    }

    render() {
        const state = this.state;
        const providerName = document.getElementById('provider-name').value;

        if (state.isLoading === true) {
            return (
                <FiltersLoading />
            );
        } else if (state.analysts.ErrorOccurred === true) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">Error</div>
                    </div>
                </div>
            );
        } else {
            return (
                
                

                            <section>
                                <div className="container-fluid px-4">
                                    <div className="d-flex flex-sm-row flex-column flex-wrap">


                                        {this.state.analysts.Analysts.map((value, index) => {

                                            return (
                                                

                         
                                                <Link to={`/portal/${providerName}/analysts/${value.AnalystNameSeo}`}>
                                                <div onContextMenu={(e) => e.preventDefault()} className="analyst-tile row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                                    
                                                    <div className="col p-3 d-flex flex-column position-static">
                                                        <ul className="tile-info">
                                                            <li className="">First Name <span>{value.AnalystFirstName}</span></li>
                                                            <li className="">Last Name <span>{value.AnalystLastName}</span></li>
                                                                <li className="sectors">Sectors:
                                                                    <li><span>{value.Sector}</span></li></li>
                                                        </ul>
                    
                                                    </div>
                                                        <div className="col-auto d-none d-sm-block">
                                                            <div className="img-container">
                                                                {value.ImageUrl === "" &&
                                                                    <img className="bd-placeholder-img"  height="200px" role="img" aria-label="Placeholder: Thumbnail" src="/assets/img/blank-profile-pic.jpg" />
                                                                }
                                                                {value.ImageUrl !== "" &&
                                                                    <img className="bd-placeholder-img"  height="200px" role="img" aria-label="Placeholder: Thumbnail" src={value.ImageUrl} />
                                                                }
                                                            </div>
                                                       
                                                         
                                                        </div>
                                                   
                                                    </div>
                                                </Link>

                                );
                            })}
                                    </div>
                                </div>

                            </section>

                );
        }

    }
}

export default AnalystHub;