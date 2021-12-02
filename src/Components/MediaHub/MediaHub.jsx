import React from 'react';
import ResearchMediaHub from '../ResearchMediaHub.jsx';
import ReactGA from 'react-ga';

const isAuthenticated = document.getElementById('is-authenticated').value;
const allowAnonymousAccess = document.getElementById('allow-anonymous-access').value;

class MediaHub extends React.Component {

    constructor(props) {
        super(props);

        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);
     
        const uid = this.props.match.params.uidParam;

        if (uid !== undefined) {
            //    window.parent.postMessage("[uid]" + uid, "*");

        }
        window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            parentIFrame.autoResize(true);
            console.log('restoring autoResize')
        }

        this.state = {
            isAuthenticated: isAuthenticated,
            allowAnonymousAccess: allowAnonymousAccess,
            showResearchOnly: false,
            showVideosOnly: true,
            feedFiltersUrl: document.getElementById('function-server-url').value + "/api/portal/Media/MediaFeedFilters",
            feedUrl: document.getElementById('function-server-url').value + "/api/Portal/Media/MediaFeed"
        };


    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    scrollToTop() {

        window.parent.postMessage("[scrollToTop]", "*");
    }

    render() {
        const state = this.state;

        return (

            <ResearchMediaHub
                isAuthenticated={state.isAuthenticated}
                allowAnonymousAccess={state.allowAnonymousAccess}
                showResearchOnly={state.showResearchOnly}
                showVideosOnly={state.showVideosOnly}
                feedUrl={state.feedUrl}
                feedFiltersUrl={state.feedFiltersUrl}
            />
        );


    }

    //constructor(props) {
    //    super(props);
     
    //    ReactGA.initialize('UA-61074648-2');
    //    ReactGA.pageview(window.location.pathname + window.location.search);
    //    console.log('hub');
    //    const uid = this.props.match.params.uidParam;

    //    if (uid !== undefined) {
    //    //    window.parent.postMessage("[uid]" + uid, "*");

    //    }
    //    window.parent.postMessage("[urlchange]" + props.location.pathname, "*");
      
     
    //    this.state = {
    //        isAuthenticated: isAuthenticated,
    //        isLoadingFilters: true,
    //        isLoadingMoreFeedItems:false,
    //        isLoading: true,
    //        feedItems: null,
    //        filters: null,
    //        SelectedCountries: [],
    //        SelectedAnalyst: null,
    //        SelectedSectors: [],
    //        SelectedRatings: [],
    //        SelectedCorpClient: [],
    //        SelectedEis: [],
    //        SelectedReportLengths: [],
    //        SelectedReportType: [],
    //        SearchTerm: "",
    //        showResearchOnly: false,
    //        showVideosOnly: true,
    //        allowAnonymousAccess: allowAnonymousAccess
    //    };
    //    this.selectCountriesChange = this.selectCountriesChange.bind(this);
    //    this.selectAnalystChange = this.selectAnalystChange.bind(this);
    //    this.selectSectorsChange = this.selectSectorsChange.bind(this);
    //    this.selectRatingsChange = this.selectRatingsChange.bind(this);
    //    this.selectCorpClientChange = this.selectCorpClientChange.bind(this);
    //    this.selectEisChange = this.selectEisChange.bind(this);
    //    this.selectReportTypeChange = this.selectReportTypeChange.bind(this);
    //    this.selectReportLengthsChange = this.selectReportLengthsChange.bind(this);
    //    this.handleSearchInput = this.handleSearchInput.bind(this);
    //    this.ClearFilters = this.ClearFilters.bind(this);
    //    this.GetNextPageOfFeedItems = this.GetNextPageOfFeedItems.bind(this);
    //    this.scrollToTop = this.scrollToTop.bind(this);
      

    //}

    //componentDidMount() {
    //    window.addEventListener('scroll', this.handleScroll);
       
    //    this.GetFilters();
        
    //}

    //componentWillUnmount() {
    //    window.removeEventListener('scroll', this.handleScroll);
    //}

    //handleScroll = debounce(() => {
      
    //    var scrollProgress = (window.innerHeight +
    //        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0));

    //    console.log(scrollProgress + "-"+ document.documentElement.offsetHeight);
        
    //    if (scrollProgress
    //            > document.documentElement.offsetHeight-300
    //    ) {
    //        this.GetNextPageOfFeedItems();
    //    }
    //}, 100);

    //GetNextPageOfFeedItems() {

    
    //    this.setState({
    //        isLoadingMoreFeedItems: true
    //    }, () => {
    //        axios.get(this.state.NextPageUrl,
    //            {
    //            }).then((response) => {
    //            const state = this.state;
    //            state.feedItems = response.data;
    //            state.isLoading = false;
    //            const itemCollection = this.state.feedItemCollection.concat(response.data.FeedItems.ContentFeedItems);
    //            this.setState({
    //                NextPageUrl: response.data.FeedItems.NextPageUrl,
    //                feedItemCollection: itemCollection,
    //                areMoreItems: response.data.FeedItems.ShowNext,
    //                isLoadingMoreFeedItems: false
    //            });

    //        });
    //    });
     
    //}

    //DoSearch () {
    //    this.setState({
    //        isLoading: true
    //    });

    //    GetValidUserToken().then((response) => {
    //        const url = document.getElementById('function-server-url').value + "/api/Portal/Media/MediaFeed";
    //        const token = response;
    //        const providerId = document.getElementById('provider-id').value;
    //        let analyst = "";
    //        if (this.state.SelectedAnalyst !== null) {
    //            analyst = this.state.SelectedAnalyst.Value;
    //        }

    //        let showEis = false;
    //        let showNonEis = false;
    //        let showDailyReports = false;
    //        let showFullResearchReports = false;
    //        let showMediaContent = false;

    //        const eisList = this.ConvertSelectedArrayToString(this.state.SelectedEis);
    //        if (eisList.includes("1")) {
    //            showNonEis = true;
    //        }
    //        if (eisList.includes("2")) {
    //            showEis = true;
    //        }
    //        if (eisList.includes("2") === false && eisList.includes("1") === false) {
    //            showNonEis = true;
    //        }

    //        const reportTypeList = this.ConvertSelectedArrayToString(this.state.SelectedReportType);
    //        if (reportTypeList.includes("1")) {
    //            showDailyReports = true;
    //        }
    //        if (reportTypeList.includes("2")) {
    //            showFullResearchReports = true;
    //        }
    //        if (reportTypeList.includes("3")) {
    //            showMediaContent = true;
    //        }
    //        if (reportTypeList.includes("2") === false && reportTypeList.includes("1") === false && reportTypeList.includes("3") === false) {
    //            showDailyReports = true;
    //            showFullResearchReports = true;
    //            showMediaContent = true;
    //        }

          
    //        axios.get(url,
    //            {
    //                params: {
    //                    token: token,
    //                    contentProviderIds: providerId,
    //                    startRow: 0,
    //                    numOfRows: 20,
    //                    searchText: this.state.SearchTerm,
    //                    //listedCountryIds: this.ConvertSelectedArrayToString(this.state.SelectedCountries),
    //                    sectorIds: this.ConvertSelectedArrayToString(this.state.SelectedSectors),
    //                    //pageCountIds: this.ConvertSelectedArrayToString(this.state.SelectedReportLengths),
    //                    authorId: analyst,
    //                    //ShowEis: showEis,
    //                    //showNonEis: showNonEis,
    //                    //showDailyReports: showDailyReports,
    //                    //showFullResearchReports: showFullResearchReports,
    //                    //showMediaContent: showMediaContent,
    //                    //contentProviderIds: this.ConvertSelectedArrayToString(this.state.SelectedCountries),
    //                    //ratingIds: this.ConvertSelectedArrayToString(this.state.SelectedRatings),
    //                    //corporateSponsoredSettingsIds: this.ConvertSelectedArrayToString(this.state.SelectedCorpClient)

    //                }
    //            }).then((response) => {

    //            this.setState({
    //                isLoadingFilters: false,
    //                isLoading: false,
    //                feedItems: response.data,
    //                NextPageUrl: response.data.FeedItems.NextPageUrl,
    //                feedItemCollection: response.data.FeedItems.ContentFeedItems,
    //                areMoreItems: response.data.FeedItems.ShowNext

    //            }, this.scrollToTop());
                    
    //            });
        
    //    });

    //}
    //scrollToTop() {

    //    window.parent.postMessage("[scrollToTop]", "*");
    //}
    //ClearFilters(e) {
    //    e.preventDefault();
    //    this.setState({
    //        SelectedCountries: [],
    //        SelectedAnalyst: null,
    //        SelectedSectors: [],
    //        SelectedRatings: [],
    //        SelectedCorpClient: [],
    //        SelectedEis: [],
    //        SelectedReportType: [],
    //        SelectedReportLengths: [],
    //        SearchTerm: ""
    //    }, this.DoSearch);
    //}

    //DeBouncedSearch = debounce(() => { this.DoSearch(); },1000)

    //selectCountriesChange(value) {
    //    this.setState({ SelectedCountries: value }, this.DeBouncedSearch
    //    );
    //}
    //selectAnalystChange(value) {
    //    this.setState({ SelectedAnalyst: value }, this.DeBouncedSearch);
        
    //}
    //selectSectorsChange(value) {
    //    this.setState({ SelectedSectors: value }, this.DeBouncedSearch);
    //}
    //selectRatingsChange(value) {
    //    this.setState({ SelectedRatings: value }, this.DeBouncedSearch);
    //}
    //selectCorpClientChange(value) {
    //    this.setState({ SelectedCorpClient: value }, this.DeBouncedSearch);
    //}
    //selectEisChange(value) {
    //    this.setState({ SelectedEis: value }, this.DeBouncedSearch);
    //}
    //selectReportTypeChange(value) {
    //    this.setState({ SelectedReportType: value }, this.DeBouncedSearch);
    //}
    //selectReportLengthsChange(value) {
    //    this.setState({ SelectedReportLengths: value }, this.DeBouncedSearch);
    //}
    //handleSearchInput(event) {
    //    this.setState({
    //        SearchTerm: event.target.value
    //    }, this.DeBouncedSearch);
    //}
    //async GetFilters() {
    //    var response = await GetValidUserToken();
    //    const url = document.getElementById('function-server-url').value + "/api/portal/Media/MediaFeedFilters";
    //        const token = response;
    //    const providerId = document.getElementById('provider-id').value;

    //    axios.get(url, {
    //        params: {
    //            token: token,
    //            providerId: providerId,
    //            startRow: 0,
    //            numOfRows: 20

    //        }
    //    }).then((response) => {

    //        this.setState({
    //            isLoadingFilters: false,
    //            isLoading: true,
    //            feedItems: null,
    //            filters: response.data,
    //        }, this.DoSearch());
            
    //    });
        
    //}
    //ConvertSelectedArrayToString(arrayObject) {
    //    let output = "";

    //    for (var key in arrayObject) {
    //        if (arrayObject.hasOwnProperty(key)) {
    //            output = output + arrayObject[key].Value + ",";
    //        }
    //    }
      
    //    return output;
    //}
  
  
    //render() {
    //    const state = this.state;

        
    //    //if (state.isAuthenticated ===  'False') {
    //    //    return (
    //    //        <p>Sorry not logged in</p>
    //    //    );
    //    //}
    //    if (state.isLoadingFilters === true) {
    //        return (
    //            <FiltersLoading/>
    //        );
    //    }
    //    else if (state.filters.ErrorOccurred === true) {
    //        return (
    //            <FilterError Message={state.filters.Message} />
    //        ); 
    //    } else {
    //        return (
    //            <div className="container-fluid px-4">
         
    //                <div className="row">
    //                    <div className="col-md-4">
    //                        <MediaHubFilters mediaHub={this} />
    //                    </div>
    //                    <div className="col-md-8">
    //                        {state.isLoading === true &&
    //                            <FeedLoading/>
    //                        }
    //                        {state.isLoading === false && state.feedItems.ErrorOccurred === true &&
    //                            <FeedError Message={state.feedItems.Message} />
    //                        }
    //                        {state.isLoading === false && state.feedItems.ErrorOccurred === false &&
    //                            <DefaultFeedTileContainer
    //                            isAuthenticated={state.isAuthenticated}
    //                            isLoadingMoreFeedItems={state.isLoadingMoreFeedItems}
    //                            areMoreItems={state.areMoreItems}
    //                            feedItemContainer={state.feedItems.FeedItems}
    //                            feedItemCollection={state.feedItemCollection}
    //                            showMorehandler={this.GetNextPageOfFeedItems}
    //                            scrollToTopHandler={this.scrollToTop}
    //                            showResearchOnly={state.showResearchOnly}
    //                            showVideosOnly={state.showVideosOnly}
    //                            allowAnonymousAccess={state.allowAnonymousAccess}
    //                        />
    //                        }
    //                    </div>
    //                </div>
    //            </div>
    //        );


    //    }

    //}
}

export default MediaHub;