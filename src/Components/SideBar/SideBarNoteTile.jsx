import React from 'react';
import SideBarNoteTileContents from './SideBarNoteTileContents.jsx';
import {

    isBrowser,
    isMobile
} from "react-device-detect";
import { Link } from 'react-router-dom';
const SideBarNoteTile = (props) => {
    
    var item = props.ContentFeedItemStandardViewModel;
    const providerName = document.getElementById('provider-name').value;

    return (
         
        <div className="col-12 col-sm-12">
            {isMobile && props.ContentFeedItemStandardViewModel.UserCanDownload  && props.ContentFeedItemStandardViewModel.ResearchNoteWidgetType !== 7 &&
                <a href={`/dashboard/DownloadResearchNote?id=${item.ResearchNoteId}`}>

                    <SideBarNoteTileContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

                </a>
            }
            {isMobile && props.ContentFeedItemStandardViewModel.UserCanDownload===false && props.ContentFeedItemStandardViewModel.ResearchNoteWidgetType !== 7 &&
               <Link to={`/portal/${providerName}/research/${item.ResearchNoteId}`}>

                    <SideBarNoteTileContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

                </Link>
            }
            {isBrowser && props.ContentFeedItemStandardViewModel.ResearchNoteWidgetType!==7 &&
            <Link to={`/portal/${providerName}/research/${item.ResearchNoteId}`}>

                <SideBarNoteTileContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

            </Link>
            }
            {props.ContentFeedItemStandardViewModel.ResearchNoteWidgetType === 7 &&
                <Link to={`/portal/${providerName}/media/${item.ResearchNoteId}`}>

                    <SideBarNoteTileContents ContentFeedItemStandardViewModel={props.ContentFeedItemStandardViewModel} />

                </Link>
            }

        </div>

    );
};
export default SideBarNoteTile;





