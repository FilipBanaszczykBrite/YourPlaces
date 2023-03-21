import { LightningElement, api, wire } from "lwc";
import PPMC from '@salesforce/messageChannel/YP_ProfilePhotoChoiceMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
import PhotoPreview from 'c/yP_PhotoPreview';

export default class YP_PhotoTile extends LightningElement {
    @api file;
    @api recordId;
    @api thumbnail;

    @wire (MessageContext)
    messageContext;

    get iconName() {
        return "doctype:image";
    }

    sendMessageService() { 
        publish(this.messageContext, PPMC, { versionId: this.file.Id, docId: this.file.ContentDocumentId });
    }

    chooseProfilePhoto(){
        let product = { 'sobjectType': 'Product2' };
        product.Id = this.recordId;
        product.DisplayUrl = this.file.Id;
        this.sendMessageService();
    }

    deletePhoto(){
        this.dispatchEvent(new CustomEvent('delete', { detail: {title: this.file.Title, id: this.file.ContentDocumentId } }));
    }

    async openPreview(){
        const result = await PhotoPreview.open({ 
            size: 'small',
            thumbnail: this.thumbnail
        });
    }
}