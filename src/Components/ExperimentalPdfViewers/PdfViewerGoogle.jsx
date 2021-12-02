import React from 'react';


class PdfViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sending message");

        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
        this.state = {
            isLoading: true
        };
    }



    componentDidMount() {
        var pdfViewer = document.getElementById('pdf-viewer');
        console.log('setting height');
        pdfViewer.style.height = "100vh"; 
    }
    render() {
        const divStyle = {
            margin: '20px',
            width: '250px',
            height: '250px',
            backgroundColor: 'yellow',
        };
        return (

            <div className="container-fluid px-4"> 
                <div className="row">
                    <div className="col-lg-9 col-sm-12">
               
                        <iframe id="pdf-viewer" src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://researchvaultlocaldev.blob.core.windows.net/public/demo.pdf" type="application/pdf" />

                </div>
                    <div className="col-lg-3 col-sm-12">
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

export default PdfViewer;