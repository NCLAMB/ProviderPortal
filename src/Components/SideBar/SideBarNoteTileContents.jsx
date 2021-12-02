import React from 'react';
const SideBarNoteTileContents = (props) => {
    "use strict";
    var provider = document.getElementById('provider-name').value;
    var item = props.ContentFeedItemStandardViewModel;
    return (
        <div onContextMenu={(e) => e.preventDefault()} className={'tile-research ' + ' shadow-highlight ' + (item.TileEnabled ? "enabled " : "disabled ") }>
            <div className="title">
                <h4>
                    {item.ResearchNoteTitle}
                </h4>
            </div>
            <div className="tile-body">
                <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                        
                        <ul className="info">
                            <li>Date:<span>{item.Date}</span></li>
                            <li>Analyst:<span>{item.AnalystName}</span></li>
                            <li>
                                Company:
                                {item.ShowCompanyTickerText === true &&
                                    item.IsVariousCompanies === false &&
                                    <span className='highlight '><span dangerouslySetInnerHTML={{ __html: item.TickerMessage }} /></span>
                                }

                                {item.ShowCompanyTickerText === true &&
                                    item.IsVariousCompanies === true &&
                                    <span className='highlight '><span dangerouslySetInnerHTML={{ __html: item.VariousTickersMessage }} /></span>
                                }

                            </li>
							<li>Pages:
									{item.IsOnePage === true &&
                                    <span>{item.NumOfPages} page</span>
                                }
                                {item.IsOnePage === false &&
                                    <span>{item.NumOfPages} pages</span>
                                }
                            </li>
                        </ul>
                    </div>
                    <div className="col-auto">
                        <img src={"/providerportal/src/assets/" + provider + "/arrow-right.png"} onError={(e) => { e.target.onerror = null; e.target.src = "/providerportal/src/assets/generic/arrow-right.png"}} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SideBarNoteTileContents;

