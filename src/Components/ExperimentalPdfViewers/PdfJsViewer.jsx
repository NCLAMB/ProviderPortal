import React from 'react';


class PdfJsViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sending message");

        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
        this.state = {
            isLoading: true
        };
    }



    componentDidMount() {

    }
    render() {
        // header on that server.
        var url = 'https://researchvaultlocaldev.blob.core.windows.net/public/demo.pdf';

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        var pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        // Asynchronous download of PDF
        var loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function (pdf) {
            console.log('PDF loaded');

            // Fetch the first page
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function (page) {
                console.log('Page loaded');

                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById('the-canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                    console.log('Page rendered');
                });
            });
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
        return (

            <div >
                <div className="row">
                    <div className="col-sm-12 col-md-9">
                        <canvas id="the-canvas"></canvas>
                </div>
                    <div className="col-sm-12 col-md-3">
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

export default PdfJsViewer;