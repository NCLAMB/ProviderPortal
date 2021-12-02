import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const DefaultMediaTileContents = (props) => {
    "use strict";
	var item = props.ContentFeedItemStandardViewModel;
	var allowAnonymousAccess = props.allowAnonymousAccess;
    var provider = document.getElementById('provider-name').value;
    return (
		<div onContextMenu={(e) => e.preventDefault()} className={'media-feed-tile ' + ' shadow-highlight ' + (item.TileEnabled ? "enabled " : "disabled "  ) }>
				<div className="card-horizontal">	
					<div className="img-square-wrapper">
						<div className="play-button">
							{(item.TileEnabled === true || allowAnonymousAccess==='True') &&
								<img src={"/providerportal/src/assets/" + provider + "/play-media-btn.svg"} onError={(e) => { e.target.onerror = null; e.target.src = "/providerportal/src/assets/generic/play-media-btn.svg"}} />
								}
							{item.TileEnabled === false && allowAnonymousAccess === 'False'  &&
								<img src={"/providerportal/src/assets/generic/locked-media-btn.svg"} />
								}
						</div>
						
					<img class="card-img media lazy"
						//src="/assets/img/placeholder-wide-no-text.png"
						src={item.ThumbnailUrl}
						data-src={item.ThumbnailUrl}
						alt={item.ResearchNoteSeoTitle} />
							
					</div>
					<div class="tile-body">
							<h4>{item.ResearchNoteTitle}</h4>
							<p className='single-line highlight ticker'><span dangerouslySetInnerHTML={{ __html: item.TickerMessage }} /></p>
							<ul className="info">
								<li>Date:<span>{item.Date}</span></li>
							</ul>
       
                                
						</div>
						
					</div>
				
			</div>

    );
};
export default DefaultMediaTileContents;