import { LightningElement, api, wire } from "lwc";
import setProfilePhoto from "@salesforce/apex/YP_ProductImagesController.setProfilePhoto";
import PPMC from '@salesforce/messageChannel/YP_ProfilePhotoChoiceMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

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
        publish(this.messageContext, PPMC, { recordId: this.file.Id });
    }

    chooseProfilePhoto(){
        let product = { 'sobjectType': 'Product2' };
        product.Id = this.recordId;
        product.DisplayUrl = this.file.Id;
        this.sendMessageService();
        // setProfilePhoto({recordId: this.recordId, docId: this.file.Id}).then(result =>{
        //     
        // });
    }
}