import { LightningElement, track, api } from 'lwc';

export default class YP_ResultApartments extends LightningElement {
    @api item;
    @track imageSrc;
    connectedCallback(){
        console.log('connected')
        this.imageSrc = "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
        this.item.DisplayUrl +
        "&operationContext=CHATTER&contentId=" +
        this.item.ContentDocumentId__c;
    }
}