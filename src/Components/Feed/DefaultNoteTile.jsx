import React from 'react';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import { Link } from 'react-router-dom';
import DefaultNoteTileContents from './DefaultNoteTileContents.jsx';
import DefaultMediaTileContents from './DefaultMediaTileContents.jsx';

const DefaultNoteTile = (props) => {
    
    var item = props.ContentFeedItemStandardViewModel;
    const providerName = document.getElementById('provider-name').value;
    const canAccess = props.isAuthenticated === 'True' || props.allowAnonymousAccess === 'True';
  
    return (
        
        <div className="col-sm-12">
            <MobileView>
                
                {canAccess === true && item.UserCanDownload && item.ResearchNoteWidgetType !== 7 &&
                    <a target='_blank' href={`/dashboard/DownloadResearchNote?id=${item.ResearchNoteId}`}>

                    <DefaultNoteTileContents allowAnonymousAccess={props.allowAnonymousAccess} ContentFeedItemStandardViewModel={item} />

                    </a>
                }
               
                {canAccess === true && item.UserCanDownload === false && item.ResearchNoteWidgetType !== 7 &&
                   
                <Link to={`/portal/${providerName}/research/${item.ResearchNoteId}`}>

                    <DefaultNoteTileContents allowAnonymousAccess={props.allowAnonymousAccess} ContentFeedItemStandardViewModel={item} />

                    </Link>
                } 
              
                </MobileView>
            <BrowserView>
           
                {canAccess === true && item.ResearchNoteWidgetType!==7 &&
            <Link to={`/portal/${providerName}/research/${item.ResearchNoteId}`}>

                    <DefaultNoteTileContents allowAnonymousAccess={props.allowAnonymousAccess} ContentFeedItemStandardViewModel={item} />

            </Link>
                }
            </BrowserView>
            {canAccess === true && item.ResearchNoteWidgetType === 7 &&
                <Link to={`/portal/${providerName}/media/${item.ResearchNoteId}`}>

                <DefaultMediaTileContents allowAnonymousAccess={props.allowAnonymousAccess} ContentFeedItemStandardViewModel={item} />

                </Link>
            }
            {canAccess === false && item.ResearchNoteWidgetType === 7 &&
                <div onClick={props.openSigninModal}>

                <DefaultMediaTileContents allowAnonymousAccess={props.allowAnonymousAccess} ContentFeedItemStandardViewModel={item} />

                </div>
            }
            {canAccess === false && item.ResearchNoteWidgetType !== 7 &&
                <div onClick={props.openSigninModal}>
               
                <DefaultNoteTileContents allowAnonymousAccess={props.allowAnonymousAccess} ContentFeedItemStandardViewModel={item} />

                </div>
            }
        </div>

    );
};
export default DefaultNoteTile;




