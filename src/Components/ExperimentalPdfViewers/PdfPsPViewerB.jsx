import React, { Component } from "react";
import PSPDFKit from "./pspdfkit/index.jsx";
//import "./App.css";
 

const LICENSE_KEY =
    'R0ZC4Pa_g2As_46TCaiKa6vyao620vADCDeiqf0bh_Prk5toZqZVbRgKmN2z3UxhULfQSzlZSAtajbXpGJau71gGAf0w2xRujpZs_YjKM3TbmFWEVVQ6S2w1UOPmRCBG8oVGHt-JU2B1TtZgAjMCGl-9u4zRMMsIBgpwOH9xEJU5gWwJe_QJbuGY9NmM6Ve6QB7Hq8KnindS-crDwtaJR1xUhpCGBeKQVPkhRUyPzHqPwAxFhylf-XjPbpwLmtnm0LfOuEK_e69xw10jd8k22_D0sggO7OrerC2Tadzyiwj86idWWBp26ngZJu0BnLKEa2PmrGDzY7RQKwR9guYSAW5mYTHCqAmrFntRJJsIq8XRCeoo8eRD3dB1MOTNaqYY6kbBOB9tOAKxf6a5yk_vlfIeQXRxhptXWBms1ygfrRz1E_xaKTkeKbEwIDX8n3Fl';
const baseUrl = `${window.location.protocol}//${window.location.host}//providerportal/public/`;

class PSDPDFViewer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            pdf: "https://researchvaultlocaldev.blob.core.windows.net/public/demo.pdf"
        };
        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
       
        if ('parentIFrame' in window) {
            console.log(window.parentIFrame);
            console.log('setting iframe  size');
            window.parentIFrame.size(1200);
        }
    }

   
    

    render() {
        return (
            <div className="App">
                <div className="App-viewer">
                    <PSPDFKit
                        pdfUrl={this.state.pdf}
                        licenseKey={LICENSE_KEY}
                        baseUrl={baseUrl}
                    />
                </div>
               
            </div>
        );
    }
}

export default PSDPDFViewer;