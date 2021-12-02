import React from 'react';

const DefaultNoteTileContents = (props) => {
    "use strict";
	var item = props.ContentFeedItemStandardViewModel;
	var allowAnonymousAccess = props.allowAnonymousAccess;
    var provider = document.getElementById('provider-name').value;
    return (
		<div onContextMenu={(e) => e.preventDefault()} className={'tile-research ' + ' shadow-highlight ' + (item.TileEnabled ? "enabled " : "disabled ") }>
			<div className="marker">
				<div className="title">
					<h4> 
						{item.ResearchNoteTitle}
					</h4>
				</div>
				<div className="tile-body">
					<div className="row no-gutters align-items-center">
						<div className="col mr-2">
							{item.ShowMacroTickerText === true &&
								<p className='single-line highlight ticker'><span dangerouslySetInnerHTML={{ __html: item.MacroClassifications }} /></p>
							}
							{item.ShowCompanyTickerText === true &&
								<p className='single-line highlight ticker'><span dangerouslySetInnerHTML={{ __html: item.TickerMessage }} /></p>
							}

							<p className="block-text">{item.Message}</p>
							<ul className="info">
								<li>Date:
										<span>{item.Date}</span>
                                </li>
							</ul>
							{item.MediaItemType === 0 &&
                                <ul className="info">
									<li>Analyst:<span>{item.AnalystName}</span></li>
									<li className='pages'>Pages:
											{item.IsOnePage === true &&
											<span>{item.NumOfPages} page</span>
										}
										{item.IsOnePage === false &&
											<span>{item.NumOfPages} pages</span>
										}
									</li>
									<li className="ratings">
										{item.ShowRating && item.CanEditRating && item.IsRatingNotZero === false &&
											<div>{item.Rating}
												<div id="rt-rate-it-display" style="display: none">
													<input type="range" min="0" max="5" value="{item.Rating}" step="1" id="backing{item.UniqueId}" />
													<div data-researchnoteid="{item.ResearchNoteId}" className="rt-rate-it" data-rateit-backingfld="#backing{item.UniqueId}"
														data-rateit-readonly="true">{item.Rating}
													</div>
												</div>
											</div>
										}
										</li>
                                </ul>
                                }
						</div>
						<div className="col-auto">
							{(item.TileEnabled === true || allowAnonymousAccess==='True') &&
								<img src={"/providerportal/src/assets/" + provider + "/arrow-right.png"} onError={(e) => { e.target.onerror = null; e.target.src = "/providerportal/src/assets/generic/arrow-right.png"}} />
								}
							{item.TileEnabled === false && allowAnonymousAccess === 'False'  &&
								<img src={"/providerportal/src/assets/generic/padlock-ico.png"} />
								}
								
						</div>
					</div>
				</div>
			</div>
        </div>

    );
};
export default DefaultNoteTileContents;