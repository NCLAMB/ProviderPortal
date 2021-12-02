import React from 'react';
import SideBarNoteTile from './SideBarNoteTile.jsx';
import axios from 'axios';
import SignInModal from '../SignInModal.jsx';



class SideBarTileContainer extends React.Component {
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
      
        let url = document.getElementById('function-server-url').value + "/api/Portal/NoteWidgets/RelatedNoteWidgets";
        const token = document.getElementById('usr-token').value;

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
    componentWillReceiveProps(props) {
        this.setState({
            researchNoteId: props.researchNoteId,
            IsVisible: props.IsVisible,
            numberOfNotes: null

    });

    }

    render() {
       
        if (this.state.IsVisible && this.state.numberOfNotes > 0) {
            return (
                <div className="row">
                    <div className="col-12 col-sm-12">
                        <div className="feed-counter">
                            <p>Related Reports</p>
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

                                
                            if (value.ContentFeedItemStandardViewModel !== undefined) {
                                
                                    return <SideBarNoteTile key={index} isAuthenticated={this.state.IsAuthorised}
                                        ContentFeedItemStandardViewModel={value.ContentFeedItemStandardViewModel}/>
                                }

                            }
                        )}


                    {this.state.isLoading === false &&
                        this.state.response.ShowNoResults === true &&
                        <div className="col-12 col-sm-12">
                            <p>{this.state.response.EmptyResultsMessage}</p>
                        </div>
                    }
                </div>
            );
        } else {
            return (
                <div>&nbsp;</div>
            );


        }
        
    }
}




export default SideBarTileContainer;