import React from 'react';

import { Link } from 'react-router-dom';
const DefaultNewsTile = (props) => {
    var item = props.ContentFeedItemNewsViewModel;
    return (
        <div onContextMenu={(e) => e.preventDefault()} className="col-12 col-sm-12 col-md-9">
            <p>
                Announcement</p>
            <p> {item.Headline}</p>
            <p> {item.CompanyName}</p>
            <p>
                <Link className='hidden-sm' to="/portal/pdfviewer">View note</Link>
            </p>
        </div>
    );
}
export default DefaultNewsTile;