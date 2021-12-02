import React from 'react';

const FeedLoading = (props) => {


    return (
        <div className="loading">
        <div className="sk-folding-cube">
			  <div className="sk-cube1 sk-cube"></div>
			  <div className="sk-cube2 sk-cube"></div>
			  <div className="sk-cube4 sk-cube"></div>
			  <div className="sk-cube3 sk-cube"></div>
		</div>
		<p>Loading Feed</p>
	</div>
    );
};
export default FeedLoading;