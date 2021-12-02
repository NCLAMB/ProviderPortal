import React from 'react';

import { Link } from 'react-router-dom';
const SideBarMediaTile = (props) => {
    
    var item = props.ContentFeedItemStandardViewModel;
    const providerName = document.getElementById('provider-name').value;
    //console.log("creating Media tile");
    //console.log(props);

    return (

        <div onContextMenu={(e) => e.preventDefault()} className="col-12 col-sm-12 col-md-12 {item.TileEnabled ? 'enabled' : 'disabled'}  {item.TileClassName}">
            {props.ContentFeedItemStandardViewModel.ResearchNoteWidgetType!==7 &&
            <Link to={`/portal/${providerName}/research/${item.ResearchNoteId}`}>

                <SideBarNoteMediaContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

            </Link>
            }  {props.ContentFeedItemStandardViewModel.ResearchNoteWidgetType === 7 &&
                <Link to={`/portal/${providerName}/media/${item.ResearchNoteId}`}>

                <SideBarNoteMediaContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

                </Link>
            }
            {props.isAuthenticated === 'False' &&
                <div onClick={props.openSigninModal}>
               
                <SideBarNoteMediaContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

                </div>
            }
        </div>

    );
};
export default SideBarMediaTile;




const SideBarNoteMediaContents = (props) => {
    "use strict";
    var item = props.ContentFeedItemStandardViewModel;
    return (

        <div className='tile-research shadow-highlight'>
			<div className="title">
                <h3>
                    {item.ResearchNoteTitle}
                </h3>
            </div>
            <div className="tile-body">
                <div className="row no-gutters align-items-center">
                    <div className="col">
                         <img src={item.ThumbnailUrl} alt={item.ResearchNoteSeoTitle} className="media" />
                        <ul className="info">
                            <li>Date:
								<span>{item.Date}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>	
        </div>
    );
};
