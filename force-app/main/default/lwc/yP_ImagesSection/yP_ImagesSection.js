import { LightningElement, wire, api, track } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getFileVersions from "@salesforce/apex/YP_ProductImagesController.getVersionFiles";
import deleteDocument from "@salesforce/apex/YP_ProductImagesController.deletePhoto";
import PPMC from '@salesforce/messageChannel/YP_ProfilePhotoChoiceMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
import DeleteModal from 'c/yP_DeleteConfirmationModal';

export default class YP_ImagesSection extends LightningElement {
    loaded = false;
    @track fileList;
    @api recordId;
    @track files = [];
    @track isLoading;
    
    @wire (MessageContext)
    messageContext;

    get acceptedFormats() {
        return [".png", ".jpg", ".jpeg"];
    }

  
    @wire(getFileVersions, { recordId: "$recordId" })
    fileResponse(value) {
        this.isLoading = true;
        this.wiredActivities = value;
        const { data, error } = value;
        this.fileList = "";
        this.files = [];
        if (data) {
        this.fileList = data;
        for (let i = 0; i < this.fileList.length; i++) {
            let file = {
            Id: this.fileList[i].Id,
            Title: this.fileList[i].Title,
            Extension: this.fileList[i].FileExtension,
            ContentDocumentId: this.fileList[i].ContentDocumentId,
            ContentDocument: this.fileList[i].ContentDocument,
            CreatedDate: this.fileList[i].CreatedDate,
            thumbnailFileCard:
                "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                this.fileList[i].Id +
                "&operationContext=CHATTER&contentId=" +
                this.fileList[i].ContentDocumentId
            };
            this.files.push(file);
        }
        this.loaded = true;
        this.isLoading = false;
        } else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        
        this.dispatchEvent(
        new ShowToastEvent({
            title: "Success!",
            message: uploadedFiles.length + " Files Uploaded Successfully.",
            variant: "success"
        })
        );
    }

    handleDelete(event){
        console.log("handle delete  " + JSON.stringify(event.detail));
        this.openPopup(event);
    }

    deleteImage(event){
        deleteDocument({docId: event.detail.id}).then(() => {
            refreshApex(this.wiredActivities);
            this.dispatchEvent(
            new ShowToastEvent({
                title: "Success!",
                message: "File " + event.detail.title + " deleted",
                variant: "success"
            })
            );
            publish(this.messageContext, PPMC, {recordId: ''});
        });
    }

    async openPopup(event){
        console.log('open popup')
        const result = await DeleteModal.open({ 
            size: 'small',
            title: event.detail.title
        });
        if(result == 'deleted'){
            this.deleteImage(event);
        }
    }
}