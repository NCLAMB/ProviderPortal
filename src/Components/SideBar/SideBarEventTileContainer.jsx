import React from 'react';
import SideBarEventTile from './SideBarEventTile.jsx';
import axios from 'axios';
import { GetValidUserToken } from '../UserTokenHelper.js';




class SideBarEventTileContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            showSignUpModal: false,
            researchNoteId: props.researchNoteId,
            IsVisible: props.IsVisible,
            response: null,
            isLoading: true,
            numberOfNotes: null
        };

    }

    componentDidMount() {
        this.fetchRelatedEvents();
    }

    componentWillReceiveProps(props) {
        this.setState({
            researchNoteId: props.researchNoteId,
            IsVisible: props.IsVisible,
            numberOfNotes: null

        });

    }
    async fetchRelatedEvents() {
        const token = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value +
            "/api/Portal/NoteWidgets/RelatedEventsWidgets";


        const researchNoteId = this.props.researchNoteId;
        axios.get(url,
            {
                params: {
                    token: token,
                    researchNoteId: researchNoteId
                }
            }).then((response) => {
                this.setState({
                    isLoading: false,
                    response: response.data,
                    numberOfNotes: response.data.FeedItems.ContentFeedItems.length
                });

            });

    }

    render() {

        if (this.state.IsVisible && this.state.numberOfNotes > 0) {
            return (
                <div className="row">
                    <div className="col-12 col-sm-12">
                        <div className="feed-counter">
                            <p>Related Events</p>
                        </div>

                    </div>
                    {this.state.isLoading === true &&
                        <div className="col-12 col-sm-12">

                            <p>Loading</p>

                        </div>
                    }
                    {this.state.isLoading === false &&
                        this.state.response.ShowError === true &&
                        <div className="col-12 col-sm-12">
                            <span> Error diagnostics:{this.state.response.NextPageUrl}</span>

                            <span> {this.state.response.ExceptionMessage}</span>
                        </div>
                    }

                    {this.state.isLoading === false &&
                        this.state.response.FeedItems.ContentFeedItems.map((value, index) => {
                            if (value.ContentFeedItemEventsViewModel !== undefined) {
                                return <SideBarEventTile key={index} ContentFeedItemEventsViewModel={value.ContentFeedItemEventsViewModel} />;
                            }
                        }
                        )}

                </div>
            );
        } else {
            return (
                <div />
            );


        }

    }
}




export default SideBarEventTileContainer;