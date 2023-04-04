import LightningModal from 'lightning/modal';
import { wire, track, api } from 'lwc';
import getProducts from '@salesforce/apex/YP_PriceBookManagerController.getProductsForAdd';
import addProducts from '@salesforce/apex/YP_PriceBookManagerController.addProductsToPB';
import APMC from '@salesforce/messageChannel/YP_AddProductsMessageChannel__c';
import CANCELBUTTON from '@salesforce/label/YP_CancelButton';
import { publish, MessageContext } from 'lightning/messageService';
export default class YP_AddProductsModal extends LightningModal {
    columns = [
        { label: 'Name', fieldName: 'Name' }
        
    ];
    @api pbId;
    @track products;
    @track isLoading;
    connectedCallback(){
        this.isLoading = true;
 
        getProducts({pbId: this.pbId}).then(result => {
            console.log(JSON.stringify(result))
            this.products = result;
            this.isLoading = false;
        })
    }

    @wire (MessageContext)
    messageContext;

    getSelectedRec() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
            let ids = [];
            for(let i = 0; i < selectedRecords.length; i++){
                ids.push(selectedRecords[i].Id);
            }
  
            addProducts({products: ids, pbId: this.pbId});
           
            this.close({result: 'created'});
            setTimeout(() => {
                publish(this.messageContext, APMC);
              }, "500");
            
        }   
    }

   
}