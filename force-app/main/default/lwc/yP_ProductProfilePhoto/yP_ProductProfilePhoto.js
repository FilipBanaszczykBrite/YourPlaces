import { LightningElement, wire, track, api} from 'lwc';
import ImagePlaceHolder from '@salesforce/resourceUrl/YP_ProductImagePlaceholder';
import getProfilePhoto from "@salesforce/apex/YP_ProductImagesController.getProfilePhoto";
import setProfilePhoto from "@salesforce/apex/YP_ProductImagesController.setProfilePhoto";
import PPMC from '@salesforce/messageChannel/YP_ProfilePhotoChoiceMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

export default class YP_ProductProfilePhoto extends LightningElement {
    @api recordId;
    @track imageSrc = ImagePlaceHolder;

    @wire(MessageContext)
    messageContext;
    photoId;

    connectedCallback(){
        this.subscribeMC();
        this.loadMainPhoto();
        
    }

    subscription = null;
    
    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            PPMC,
            (message) => { this.photoId = message.recordId;
            setProfilePhoto({recordId: this.recordId, docId: this.photoId}).then(result =>{
                this.loadMainPhoto();
            });
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    loadMainPhoto(){
        console.log('load photo')
        getProfilePhoto({recordId: this.recordId}).then(result => {
            console.log('get profile ' + JSON.stringify(result))
            this.imageSrc = "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
            result.Id +
            "&operationContext=CHATTER&contentId=" +
            result.ContentDocumentId;
        })
    }

}