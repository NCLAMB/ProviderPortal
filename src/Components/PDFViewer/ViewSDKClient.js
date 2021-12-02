import axios from 'axios';
class ViewSDKClient {
    constructor() {
        this.readyPromise = new Promise((resolve) => {
            if (window.AdobeDC) {
                resolve();
            } else {
                /* Wait for Adobe Document Services PDF Embed API to be ready */
                document.addEventListener("adobe_dc_view_sdk.ready", () => {
                    resolve();
                });
            }
        });
        this.adobeDCView = undefined;
        this.IsWaitingRecordPdf = false;
        this.currentPage = 1;
        this.currentResearchNote = "";
    }

    ready() {
        return this.readyPromise;
    }
    RecordPdfEndView(token, researchNoteId, email) {
        if (this.IsWaitingRecordPdf === true) {

            return;
        }
        window.parent.postMessage("[hasStoppedViewingPdf]", "*");
        this.IsWaitingRecordPdf = true

        const url = document.getElementById('function-server-url').value + "/api/ProviderPortal/RecordPdfPageEndView";
        axios.get(url,
            {
                params: {
                    token: token,
                    researchnoteid: researchNoteId,
                    email: email

                }
            }).then((response) => {
                //console.log("Recorded pdf end view");
                this.IsWaitingRecordPdf = false;
            });
    }
    RecordPdfView(token, researchNoteId, pageNumber, ignoreSamePage, email) {

        if (this.IsWaitingRecordPdf === true
        ) {
            //console.log("Cancelled recording pdf view - " + researchNoteId + " - " + pageNumber + " - IsWaitingRecordPdf" );
            return;
        }
        if (!ignoreSamePage && (this.currentPage === pageNumber && this.currentResearchNote === researchNoteId)) {
           // console.log("Cancelled recording pdf view - " + researchNoteId + " - " + pageNumber + " - SamePage");

            return;
        }
       // console.log("recording pdf view - " + researchNoteId + " - " + pageNumber);
       // window.parent.postMessage("[isViewingPdfId]" + researchNoteId, "*");
        window.parent.postMessage("[isViewingPdfPage]" + pageNumber, "*");

       // console.log(`Detected page change ${pageNumber}`);
        this.IsWaitingRecordPdf = true
        this.currentPage = pageNumber;
        this.currentResearchNote = researchNoteId;
        const url = document.getElementById('function-server-url').value + "/api/ProviderPortal/RecordPdfPageView";
        axios.get(url,
            {
                params: {
                    token: token,
                    researchnoteid: researchNoteId,
                    pageNumber: pageNumber,
                    email: email

                }
            }).then((response) => {

                this.IsWaitingRecordPdf = false;
            });
    }
    previewFile(divId, url, fileName, token, researchNoteId, email, resizerIsDisabled,viewerConfig) {

        window.parent.postMessage("[isViewingPdfId]" + researchNoteId, "*");
        var clientId = document.getElementById('pdf-key').value
        const config = {

            clientId: clientId,
        };
        if (divId) {
            config.divId = divId;
        }

        this.adobeDCView = new window.AdobeDC.View(config);

        /* Invoke the file preview API on Adobe DC View object */
        const previewFilePromise = this.adobeDCView.previewFile({

            content: {

                location: {
                    url: url,

                },
            },
            /* Pass meta data of file */
            metaData: {
                /* file name */
                fileName: fileName,
                /* file ID */
                id: researchNoteId,
            }
        }, viewerConfig);
        const eventOptions = {
            //listenOn: [AdobeDC.View.Enum.Events.PAGE_VIEW, AdobeDC.View.Enum.Events.APP_RENDERING_DONE, AdobeDC.View.Enum.Events.APP_RENDERING_START],
            enableFilePreviewEvents: true,
            enablePDFAnalytics: true
        }


        this.adobeDCView.registerCallback(
            //var intervalId = window.setInterval(function () {
            //    console.log( adobeDCView)
            //}, 5000);
            AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            function (event) {
                //console.log(event.type);


                //this event prompts to host code to manual resize the portal iframe
                //this is necessary as some hosts have bot finished drawing when the pdf is being retrieved
                if (resizerIsDisabled === 'true') {
                    window.parent.postMessage("[resizerIsDisabled]" + resizerIsDisabled, "*");
                }
                if (event.data.pageNumber == null || event.data.pageNumber == undefined) {

                }
                else {

                    let pageNumber = event.data.pageNumber;
                   // console.log("detecting pdf view - " + researchNoteId + " - " + pageNumber);
                    ViewSDKClient.prototype.RecordPdfView(token, researchNoteId, pageNumber, false, email);

                }
            }, eventOptions
        );


        return previewFilePromise;
    }




}

export default ViewSDKClient;