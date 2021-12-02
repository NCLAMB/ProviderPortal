import React, { Component } from "react";
import PSPDFKit from "./pspdfkit/index.jsx";
//import "./App.css";

//const LICENSE_KEY =
//    process.env.REACT_APP_PSPDFKIT_LICENSE_KEY &&
//        process.env.REACT_APP_PSPDFKIT_LICENSE_KEY.trim();
const LICENSE_KEY =
    'R0ZC4Pa_g2As_46TCaiKa6vyao620vADCDeiqf0bh_Prk5toZqZVbRgKmN2z3UxhULfQSzlZSAtajbXpGJau71gGAf0w2xRujpZs_YjKM3TbmFWEVVQ6S2w1UOPmRCBG8oVGHt-JU2B1TtZgAjMCGl-9u4zRMMsIBgpwOH9xEJU5gWwJe_QJbuGY9NmM6Ve6QB7Hq8KnindS-crDwtaJR1xUhpCGBeKQVPkhRUyPzHqPwAxFhylf-XjPbpwLmtnm0LfOuEK_e69xw10jd8k22_D0sggO7OrerC2Tadzyiwj86idWWBp26ngZJu0BnLKEa2PmrGDzY7RQKwR9guYSAW5mYTHCqAmrFntRJJsIq8XRCeoo8eRD3dB1MOTNaqYY6kbBOB9tOAKxf6a5yk_vlfIeQXRxhptXWBms1ygfrRz1E_xaKTkeKbEwIDX8n3Fl';



const baseUrl = `${window.location.protocol}//${window.location.host}//providerportal/public/`;
console.log("Base Ulr:" + baseUrl);
class PSDPDFViewer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            pdf: "https://researchvaultlocaldev.blob.core.windows.net/public/demo.pdf"
        };
        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
        this.openAnother = this.openAnother.bind(this);
    }

    openAnother() {
        this.setState({
            pdf: "https://researchvaultlocaldev.blob.core.windows.net/public/demo.pdf"
        });
    }

    render() {
        return (


            <div className="container-fluid px-4">
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-9">

                        <div className="App">
                            <div className="App-viewer">
                                <PSPDFKit
                                    pdfUrl={this.state.pdf}
                                    licenseKey={LICENSE_KEY}
                                    baseUrl={baseUrl}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-3">
                        <ul>
                            <li>Lorem ipsum dolor sit amet, consectetuer adipiscing
                                elit. Aenean commodo ligula eget dolor. Aenean
                                            massa.</li>
                            <li>Cum sociis natoque penatibus et magnis dis
                                parturient montes, nascetur ridiculus mus. Donec quam
                                felis, ultricies nec, pellentesque eu, pretium quis,
                                            sem.</li>
                            <li>Nulla consequat massa quis enim. Donec pede justo,
                                            fringilla vel, aliquet nec, vulputate eget, arcu.</li>
                            <li>In enim justo, rhoncus ut, imperdiet a, venenatis
                                vitae, justo. Nullam dictum felis eu pede mollis
                                            pretium. Integer tincidunt.</li>
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}

export default PSDPDFViewer;