import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class YP_ResultBusinessPremises extends NavigationMixin(LightningElement) {
    @api item;
    @track imageSrc;

    connectedCallback(){
        this.imageSrc = "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
        this.item.DisplayUrl +
        "&operationContext=CHATTER&contentId=" +
        this.item.ContentDocumentId__c;
    }

    navigateToRecordPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.item.Id,
                objectApiName: 'Product2',
                actionName: 'view'
            }
        });
}
}