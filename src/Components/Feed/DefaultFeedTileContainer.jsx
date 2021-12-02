import React from 'react';
import DefaultNoteTile from './DefaultNoteTile.jsx';
import DefaultNewsTile from './DefaultNewsTile.jsx';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import SignInModal from '../SignInModal.jsx';



class DefaultFeedTileContainer extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
           
            showSignUpModal: false,
            researchNoteId: "",
            feedItemCollection: props.feedItemCollection,
            feedItemContainer: props.feedItemContainer,
            isAuthenticated: props.isAuthenticated,
            showMorehandler: props.showMorehandler,
            isLoadingMoreFeedItems: props.isLoadingMoreFeedItems,
            areMoreItems: props.areMoreItems,
            scrollToTopHandler: props.scrollToTopHandler,
            showResearchOnly: props.showResearchOnly,
            showVideosOnly: props.showVideosOnly,
            allowAnonymousAccess: props.allowAnonymousAccess
        };
     


        this.openSigninModal = this.openSigninModal.bind(this);
        this.closeSigninModal = this.closeSigninModal.bind(this);
    }

    componentDidMount() {

    }
    componentWillReceiveProps(props) {
        this.setState({
            feedItemCollection: props.feedItemCollection,
            feedItemContainer: props.feedItemContainer,
            isAuthenticated: props.isAuthenticated,
            showMorehandler: props.showMorehandler,
            isLoadingMoreFeedItems: props.isLoadingMoreFeedItems,
            showResearchOnly: props.showResearchOnly,
            showVideosOnly: props.showVideosOnly,
            allowAnonymousAccess: props.allowAnonymousAccess
        });

    }
    openSigninModal(researchNoteId) {
        this.props.scrollToTopHandler();
        this.setState({
            showSignUpModal: true,
            researchNoteId: researchNoteId
        });
    }

    closeSigninModal() {
        this.setState({
            showSignUpModal: false,
            researchNoteId: ""
        });
    }
    render() {
       
        return (
            <div className="row">
                <div className="col-12 col-sm-12">
                  

                    <div className="feed-counter">
                        {this.state.showResearchOnly === true &&
                            <p>Research<span> {this.state.feedItemContainer.TotalCount} </span> </p>
                        }
                        {this.state.showVideosOnly === true &&
                            <p>Videos<span> {this.state.feedItemContainer.TotalCount} </span> </p>
                        }
                        {this.state.showResearchOnly === false &&
                            this.state.showVideosOnly === false &&
                            <p>Research and Videos<span> {this.state.feedItemContainer.TotalCount} </span> </p>
                        }
                        
					</div>
                    
                </div>
                {this.state.feedItemContainer.ShowError === true &&
                    <div className="col-12 col-sm-12">
                    <span> Error diagnostics:{this.state.feedItemContainer.NextPageUrl}</span>

                    <span> {this.state.feedItemContainer.ExceptionMessage}</span>
                    </div>
                }
                <SignInModal
                    showModal={this.state.showSignUpModal}
                    researchNoteId={this.state.researchNoteId}
                    isIpo={false}
                    closeSigninModalCallback={this.closeSigninModal} />


                {this.state.feedItemCollection.map((value, index) => {

                    if (value.ContentFeedItemNewsViewModel != undefined) {
                        return <DefaultNewsTile key={index} openSigninModal={this.openSigninModal} isAuthenticated={props.isAuthenticated} ContentFeedItemNewsViewModel={value.ContentFeedItemNewsViewModel} />
                    }
                    if (value.ContentFeedItemStandardViewModel != undefined) {
                        return <DefaultNoteTile key={index} openSigninModal={() => this.openSigninModal(
                            value.ContentFeedItemStandardViewModel.ResearchNoteId)}

                            isAuthenticated={this.state.isAuthenticated} allowAnonymousAccess={this.state.allowAnonymousAccess} ContentFeedItemStandardViewModel={value
                                .ContentFeedItemStandardViewModel} />
                    }

                }
                )}
                {this.state.isLoadingMoreFeedItems === false && this.state.areMoreItems ===true &&
                    <div className="col-12 col-sm-12">
                    <button className="btn-primary" onClick={this.state.showMorehandler}>Show More</button>
                    </div>
                }
            
                {this.state.isLoadingMoreFeedItems === true &&
                    <div className="col-12 col-sm-12">
                        
                    </div>
                }
                {this.state.feedItemContainer.ShowNoResults === true &&
                    <div className="col-12 col-sm-12">
                    <p>{this.state.feedItemContainer.EmptyResultsMessage}</p>
                    </div>
                }
                {this.state.isLoadingMoreFeedItems === false && this.state.areMoreItems === false &&
                    <div className="col-12 col-sm-12">
                        
                    </div>
                }
            </div>

        );
    }
}




export default DefaultFeedTileContainer;