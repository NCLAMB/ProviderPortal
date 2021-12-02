import React from 'react';
import { Link } from 'react-router-dom';

const SideBarEventTile = (props) => {

    var item = props.ContentFeedItemEventsViewModel;
    const providerName = document.getElementById('provider-name').value;
    //console.log("creating Media tile");
    //console.log(props);

    return (

        <div onContextMenu={(e) => e.preventDefault()} className="col-12 col-sm-12 col-md-12 { 'enabled'} ">
            
            <Link to={`/portal/${providerName}/events/${item.TitleSeo}`}>

                <SideBarNoteEventContents ContentFeedItemEventsViewModel={props.ContentFeedItemEventsViewModel} />

                </Link>
            
        </div>

    );
};
export default SideBarEventTile;

const SideBarNoteEventContents = (props) => {
    "use strict";
    var item = props.ContentFeedItemEventsViewModel;

    return (
        <div className="events-tile">
            <div className="title">
                <h4>
                    {item.Title}
                </h4>
            </div>
            <div className="tile-body">
                <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                        <ul className="info">
                            <li>Date:<span>{item.Date}</span></li>
                            <li><span>{item.Strapline}</span></li>
                            <li>Event Type:<span>{item.EventType}</span></li>
                            <li>Time:<span>{item.Time}</span></li>
                            <li>Location:<span>{item.Location}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
};



