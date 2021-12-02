import React from 'react';
import {  BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import PortalHeader from '../components/Header.jsx';
import ResearchHub from '../components/ResearchHub/ResearchHub.jsx';
import MediaHub from '../components/MediaHub/MediaHub.jsx';
import PdfViewer from '../components/PDFViewer/PdfAdobeViewer.jsx';
import CompanyHub from '../components/companies/companyhub.jsx';
import Company from '../components/companies/company.jsx';
import RegisterRecipient from '../components/Register/RegisterRecipient.jsx';
import MediaPage from '../components/Media/MediaPage.jsx';
import EntryLoader from '../components/EntryLoader.jsx';

//import PdfJsViewer from '../components/PdfJsViewer.jsx';
//import PdfReactViewer from '../components/PdfReactViewer.jsx';
import NotFoundPage from '../components/NotFoundPage.jsx';
import AnalystHub from '../components/Analysts/AnalystsHub.jsx';
import Analyst from '../components/Analysts/Analyst.jsx';
import EventsHub from '../components/Events/EventsHub.jsx';
import Event from '../components/Events/Event.jsx';

//All routes mst include one with /uid/:uidParam?. This is due to a routine which will append the uid when the site 
//is initialised and embed.js


class AppRouter extends React.Component {

    constructor(props) {
        super(props);
    }
  
    render() {
        return (
        <BrowserRouter>
            <div>
                <PortalHeader />
                <Switch>
                    <Route path="/" component={ResearchHub} exact={true} />
                    <Route path="/portal" component={ResearchHub} exact={true} />
                    <Route path="/portal/:providerParam?/Loader/" component={EntryLoader} exact={true} />
                    <Route path="/portal/:providerParam?/Loader/uid/:uidParam?" component={EntryLoader} exact={true} />

                    <Route path="/portal/:providerParam?/Register/" component={RegisterRecipient} exact={true} />
                    <Route path="/portal/:providerParam?/Register/uid/:uidParam?" component={RegisterRecipient} exact={true} />

                    <Route path="/portal/:providerParam?/Register/:researchnote?" component={RegisterRecipient} exact={true} />
                    <Route path="/portal/:providerParam?/Register/:researchnote?/uid/:uidParam?" component={RegisterRecipient} exact={true} />


                    <Route path="/portal/:providerParam?" component={ResearchHub} exact={true} />
                    <Route path="/portal/:providerParam?/uid/:uidParam?" component={ResearchHub} exact={true} />

                    <Route path="/portal/:providerParam?/pdfviewer/:researchnote?" component={PdfViewer} exact={true} />
                    <Route path="/portal/:providerParam?/pdfviewer/:researchnote?/uid/:uidParam?"
                        component={PdfViewer} exact={true} />

                    <Route path="/portal/:providerParam?/research/:researchnote?" component={PdfViewer} exact={true} />
                    <Route path="/portal/:providerParam?/research/:researchnote?/uid/:uidParam?" component={PdfViewer} exact={true} />

                    <Route path="/portal/:providerParam?/research/:researchnote?/partner/:partner?" component={PdfViewer} exact={true} />
                    <Route path="/portal/:providerParam?/research/:researchnote?/partner/:partner?/uid/:uidParam?" component={PdfViewer} exact={true} />

                    <Route path="/portal/:providerParam?/research/:researchnote?/referrer/:referrer?" component={PdfViewer} exact={true} />
                    <Route path="/portal/:providerParam?/research/:researchnote?/referrer/:referrer?/uid/:uidParam?" component={PdfViewer} exact={true} />



                    <Route path="/portal/:providerParam?/companies" component={CompanyHub} exact={true} />
                    <Route path="/portal/:providerParam?/companies/uid/:uidParam?" component={CompanyHub} exact={true} />

                    <Route path="/portal/:providerParam?/companies/:companyid?" component={Company} exact={true} />
                    <Route path="/portal/:providerParam?/companies/:companyid?/uid/:uidParam?" component={Company} exact={true} />

                    <Route path="/portal/:providerParam?/companies/:companyid?/:tabParam?" component={Company} exact={true} />
                    <Route path="/portal/:providerParam?/companies/:companyid?/:tabParam?/uid/:uidParam?" component={Company} exact={true} />

                    <Route path="/portal/:providerParam?/analysts" component={AnalystHub} exact={true} />
                    <Route path="/portal/:providerParam?/analysts/uid/:uidParam?" component={AnalystHub} exact={true} />

                    <Route path="/portal/:providerParam?/analysts/:analystnameseo?" component={Analyst} exact={true} />
                    <Route path="/portal/:providerParam?/analysts/:analystnameseo?/uid/:uidParam?" component={Analyst} exact={true} />

                    <Route path="/portal/:providerParam?/events" component={EventsHub} exact={true} />
                    <Route path="/portal/:providerParam?/events/uid/:uidParam?" component={EventsHub} exact={true} />

                    <Route path="/portal/:providerParam?/events/:eventtitleseo?" component={Event} exact={true} />
                    <Route path="/portal/:providerParam?/events/:eventtitleseo?/uid/:uidParam?" component={Event} exact={true} />

                    <Route path="/portal/:providerParam?/media" component={MediaHub} exact={true} />
                    <Route path="/portal/:providerParam?/media/uid/:uidParam?" component={MediaHub} exact={true} />

                    <Route path="/portal/:providerParam?/media/:mediaId?" component={MediaPage} exact={true} />
                    <Route path="/portal/:providerParam?/media/:mediaId?/uid/:uidParam?" component={MediaPage} exact={true} />
                    <Route component={NotFoundPage} />

                </Switch>
            </div>


            </BrowserRouter>
        )
    }
    

}
export default AppRouter;

//const AppRouter = () => (

//    <BrowserRouter>
//        <div>
//            <PortalHeader />
//            <Switch>
//                <Route path="/" component={ResearchHub} exact={true} />
//                <Route path="/portal" component={ResearchHub} exact={true} />
//                <Route path="/portal/:providerParam?/Loader/" component={EntryLoader} exact={true} />
//                <Route path="/portal/:providerParam?/Loader/uid/:uidParam?" component={EntryLoader} exact={true} />

//                <Route path="/portal/:providerParam?/Register/" component={RegisterRecipient} exact={true} />
//                <Route path="/portal/:providerParam?/Register/uid/:uidParam?" component={RegisterRecipient} exact={true} />

//                <Route path="/portal/:providerParam?/Register/:researchnote?" component={RegisterRecipient} exact={true} />
//                <Route path="/portal/:providerParam?/Register/:researchnote?/uid/:uidParam?" component={RegisterRecipient} exact={true} />

                
//                <Route path="/portal/:providerParam?" component={ResearchHub} exact={true}/>
//                <Route path="/portal/:providerParam?/uid/:uidParam?" component={ResearchHub} exact={true}/>

//                <Route path="/portal/:providerParam?/pdfviewer/:researchnote?" component={PdfViewer} exact={true} />
//                <Route path="/portal/:providerParam?/pdfviewer/:researchnote?/uid/:uidParam?"
//                    component={PdfViewer} exact={true} />

//                <Route path="/portal/:providerParam?/research/:researchnote?" component={PdfViewer} exact={true} />
//                <Route path="/portal/:providerParam?/research/:researchnote?/uid/:uidParam?" component={PdfViewer} exact={true} />

//                <Route path="/portal/:providerParam?/research/:researchnote?/partner/:partner?" component={PdfViewer} exact={true} />
//                <Route path="/portal/:providerParam?/research/:researchnote?/partner/:partner?/uid/:uidParam?" component={PdfViewer} exact={true} />

//                <Route path="/portal/:providerParam?/research/:researchnote?/referrer/:referrer?" component={PdfViewer} exact={true} />
//                <Route path="/portal/:providerParam?/research/:researchnote?/referrer/:referrer?/uid/:uidParam?" component={PdfViewer} exact={true} />

                

//                <Route path="/portal/:providerParam?/companies" component={CompanyHub} exact={true} />
//                <Route path="/portal/:providerParam?/companies/uid/:uidParam?" component={CompanyHub} exact={true} />

//                <Route path="/portal/:providerParam?/companies/:companyid?" component={Company} exact={true} />
//                <Route path="/portal/:providerParam?/companies/:companyid?/uid/:uidParam?" component={Company} exact={true} />

//                <Route path="/portal/:providerParam?/companies/:companyid?/:tabParam?" component={Company} exact={true} />
//                <Route path="/portal/:providerParam?/companies/:companyid?/:tabParam?/uid/:uidParam?" component={Company} exact={true} />

//                <Route path="/portal/:providerParam?/analysts" component={AnalystHub} exact={true} />
//                <Route path="/portal/:providerParam?/analysts/uid/:uidParam?" component={AnalystHub} exact={true} />

//                <Route path="/portal/:providerParam?/analysts/:analystnameseo?" component={Analyst} exact={true} />
//                <Route path="/portal/:providerParam?/analysts/:analystnameseo?/uid/:uidParam?" component={Analyst} exact={true} />

//                <Route path="/portal/:providerParam?/events" component={EventsHub} exact={true} />
//                <Route path="/portal/:providerParam?/events/uid/:uidParam?" component={EventsHub} exact={true} />

//                <Route path="/portal/:providerParam?/events/:eventtitleseo?" component={Event} exact={true} />
//                <Route path="/portal/:providerParam?/events/:eventtitleseo?/uid/:uidParam?" component={Event} exact={true} />

//                <Route path="/portal/:providerParam?/media" component={MediaHub} exact={true} />
//                <Route path="/portal/:providerParam?/media/uid/:uidParam?" component={MediaHub} exact={true} />

//                <Route path="/portal/:providerParam?/media/:mediaId?" component={MediaPage} exact={true} />
//                <Route path="/portal/:providerParam?/media/:mediaId?/uid/:uidParam?" component={MediaPage} exact={true} />
//                <Route component={NotFoundPage} />

//            </Switch>
//        </div>


//    </BrowserRouter>

//);

//export default AppRouter;
