import LightningModal from 'lightning/modal';
import { wire, track, api } from 'lwc';
import getProducts from '@salesforce/apex/YP_PriceBookManagerController.getProducts';
import addProducts from '@salesforce/apex/YP_PriceBookManagerController.addProductsToPB';
export default class YP_AddProductsModal extends LightningModal {
    columns = [
        { label: 'Name', fieldName: 'Name' }
        
    ];
    @api pbId;
    @track products;
    @track isLoading;
    connectedCallback(){
        this.isLoading = true;
        console.log('connected add modal')
        getProducts().then(result => {
            console.log(JSON.stringify(result))
            this.products = result;
            this.isLoading = false;
        })
    }

    getSelectedRec() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
            let ids = [];
            for(let i = 0; i < selectedRecords.length; i++){
                ids.push(selectedRecords[i].Id);
            }
            console.log(ids);
            console.log(this.pbId);
            addProducts({products: ids, pbId: this.pbId});
            this.close();
        }   
    }

   
}