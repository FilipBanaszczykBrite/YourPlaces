import { LightningElement, wire, track, api} from 'lwc';
import getProfilePhoto from "@salesforce/apex/YP_ProductImagesController.getProfilePhoto";

import PPMC from '@salesforce/messageChannel/YP_ProfilePhotoChoiceMessageChannel__c';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

export default class YP_ProductProfilePhoto extends LightningElement {
    @api recordId;
    @track imageSrc;
    @track isLoading;
    @track imageLoaded = false;

    @wire(MessageContext)
    messageContext;
    photoId;

    connectedCallback(){
        console.log('connected ' + this.recordId)
        this.subscribeMC();
        this.isLoading = true;
        this.loadMainPhoto();
        
    }

    disconnectedCallback(){
        console.log('disconnected ' + this.recordId);
        unsubscribe(this.subscription);
        this.subscription = null;
    
    }

    subscription = null;
    
    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            PPMC,
            (message) => { 
            console.log('MESSAGE RECEIVED ' + this.recordId)
            this.loadMainPhoto();
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    loadMainPhoto(){
        console.log('load photo')
        getProfilePhoto({recordId: this.recordId}).then(result => {
            console.log('get profile ' + JSON.stringify(result))
            this.imageSrc = result;
            this.imageLoaded = true;
            this.isLoading = false;
        }).catch(() => {
            this.imageLoaded = false
            this.isLoading = false;
        })
    }

}