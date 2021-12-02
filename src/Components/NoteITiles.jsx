import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class NoteTiles extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sending message");
   
        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');

        this.state = {
            isLoading: true,
            response:null
    };
    }
    componentDidMount() {
        // Load async data.
        const url = document.getElementById('function-server-url').value + "/api/WebApp/ContentProvider/LatestFeed";
        const token = document.getElementById('usr-token').value ;
        const providerId = document.getElementById('provider-id').value ;

         let data = axios.get(url, {
             params: {
                 token: token,
                 contentProviderId: providerId,
                 includeResearch: true,
                 includeMedia:true
             }
         }).then((response) => {
       
             this.setState({

                     isLoading: false,
                     response:response.data

             });
         });

        // Parse the results for ease of use.
        //console.log(response.data);
        //feedItems = data.feedItems;
        
        //this.setState({
          
        //        isLoading: false,
        //        feedItems
         
        //});
    }
    render() { 
        const state = this.state;

        if (state.isLoading === true) {
            return (
                <p> Loading </p>
            );
        } else { 
            return (

                <div className="container-fluid px-4 moo">
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12">

                       
                        </div>
                        <div className="col-lg-9 col-md-8 col-sm-12">
                            <div>

                                <p> {state.response.Title}</p>
                                <ul>
                                    {state.response.FeedItems.ContentFeedItems.map((value, index) => {

                                        if (value.ContentFeedItemNewsViewModel != undefined) {
                                            return <li key={index}>
                                                <p>
                                                    Announcement</p>
                                                <p> {value.ContentFeedItemNewsViewModel.Headline}</p>
                                                <p> {value.ContentFeedItemNewsViewModel.CompanyName}</p>
                                                <p>
                                                    <Link className='hidden-sm' to="/portal/pdfviewer">View note</Link>
                                                </p>
                                            </li>

                                        }
                                        if (value.ContentFeedItemStandardViewModel != undefined) {
                                            return <li key={index}>

                                                <p>{value.ContentFeedItemStandardViewModel.TileClassName}</p>
                                                <p> {value.ContentFeedItemStandardViewModel.ResearchNoteTitle}</p>
                                                <p> {value.ContentFeedItemStandardViewModel.Message}</p>
                                                <p> {value.ContentFeedItemStandardViewModel.TickerMessage}</p>
                                                <p>
                                                    <Link className='hidden-sm hidden-for-small' to="/portal/pdfviewer">View note</Link>
                                                </p>
                                            </li>

                                        }


                                    })
}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>





              
            );


        }
    }
}

export default NoteTiles;