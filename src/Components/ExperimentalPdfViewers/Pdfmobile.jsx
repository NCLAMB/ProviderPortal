import React from 'react';


class PdfMobileViewer extends React.Component {
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
    
        return (
            <iframe id="pdf-viewer" src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://researchvaultlocaldev.blob.core.windows.net/public/demo.pdf" type="application/pdf" />
        );

    }
}

export default PdfMobileViewer;