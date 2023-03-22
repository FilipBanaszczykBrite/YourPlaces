import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class YP_ResultApartments extends NavigationMixin(LightningElement) {
    @api item;
    @track imageSrc;
    @track displayAttic;
    @track displayBasement;
    connectedCallback(){
        if(this.item.Attic__c === true){
            this.displayAttic = 'Yes';
        }
        else{
            this.displayAttic = 'No';
        }
        if(this.item.Basement__c === true){
            this.displayBasement = 'Yes';
        }
        else{
            this.displayBasement = 'No';
        }
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