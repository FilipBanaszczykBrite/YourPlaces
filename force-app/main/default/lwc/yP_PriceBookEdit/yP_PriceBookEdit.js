import { LightningElement, track, wire } from 'lwc';
import PB_OBJECT from '@salesforce/schema/Pricebook2';
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';
import EPBMC from '@salesforce/messageChannel/YP_EditPBMessageChannel__c';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import APMC from '@salesforce/messageChannel/YP_AddProductsMessageChannel__c';
import AddModal from 'c/yP_AddProductsModal';
import { subscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';
import getProducts from '@salesforce/apex/YP_PriceBookManagerController.getProducts';
import changePrices from '@salesforce/apex/YP_PriceBookManagerController.changePrices';
import deleteProduct from '@salesforce/apex/YP_PriceBookManagerController.changePrices';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class YP_PriceBookEdit extends LightningElement {
    objectApiName = PB_OBJECT;
    nameField = NAME_FIELD;
    activeField = ACTIVE_FIELD;
    startField = START_FIELD;
    endField = END_FIELD;
    @track gotRecord = false;
    subscriptionEdit = null;
    subscriptionAdd = null;
    @wire(MessageContext)
    messageContext;
    recordId;
    @track products = [];
    selectedRows = [];
    @track discount;
    @track flat;

    columns = [
        { label: 'Product Name', fieldName: 'Name' },
        { label: 'Standard Price', fieldName: 'Price', type: 'currency'},
       
    ]

    connectedCallback(){
        this.subscribeMCEdit();
        this.subscribeMCAdd();
        //console.log('open edit ', this.recordId);
        
    }

    getProductsForPB(){
        getProducts({pbId: this.recordId}).then(result =>{
            this.products = [];
            //console.log('get prods ' + JSON.stringify(result));
            for(let i = 0; i < result.length; i++) {
                let productsPrice = {
                    Id: result[i].Id,
                    ProductId: result[i].Product2Id,
                    Name: result[i].Product2.Name,
                    Price: result[i].UnitPrice,
                   
                    }


                this.products.push(productsPrice);
            }
            
           // console.log('prods ' + JSON.stringify(this.products))
        });
    }

    subscribeMCEdit(){
        if (this.subscriptionEdit) {
            return;
        }
        this.subscriptionEdit = subscribe(
            this.messageContext,
            EPBMC,
            (message) => { 
                this.gotRecord = true;
                this.recordId = message.record.Id;
                //console.log('got message edit ' + JSON.stringify(message))
                this.getProductsForPB();
            
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    subscribeMCAdd(){
        if (this.subscriptionAdd) {
            return;
        }
        this.subscriptionAdd = subscribe(
            this.messageContext,
            APMC,
            () => { 
                this.gotRecord = true;
                
                //console.log('added ')
                this.getProductsForPB();
            
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    handleSubmit(){
        setTimeout(() => {
            publish(this.messageContext, NPBMC);
          }, "500");
        
    }

    handleError(){
        this.showToast('Error', 'error', 'Error ocurred during submitting changes. Make sure dates for active Pricebooks are not overlapping.');
    }

    showToast(tit, vari, mess) {
        const event = new ShowToastEvent({
            title: tit,
            variant: vari,
            message:
                mess,
        });
        this.dispatchEvent(event);
    }

    handleAdd(){
        this.openModal();
    }

    async openModal() {
        //console.log('open add modal')
        const result = await AddModal.open({
            size: 'medium',
            pbId : this.recordId

        });
        console.log(result);
        this.showToast('Success', 'success', 'New products added.');
    }
    changePercent(event){
        this.discount = event.detail.value;
    }

    changeFlat(event){
        this.flat = event.detail.value;
    }

    addDiscount(){
        this.getSelectedRows();
        let ids = [];
        let newPrices = [];
        console.log('add flat')
        for(let i = 0; i< this.selectedRows.length; i++){
            console.log('ids', ids);
            ids.push(this.selectedRows[i].Id);
            newPrices.push(Number(this.selectedRows[i].Price) * (1 + Number(this.discount)/100));

        }
        changePrices({ids: ids, newPrices: newPrices}).then(() => {
            this.getProductsForPB();
        })
    }

    addFlat(){
        this.getSelectedRows();
        let ids = [];
        let newPrices = [];
        console.log('add flat')
        for(let i = 0; i< this.selectedRows.length; i++){
            console.log('ids', ids);
            ids.push(this.selectedRows[i].Id);
            newPrices.push(Number(this.selectedRows[i].Price) + Number(this.flat))

        }
        changePrices({ids: ids, newPrices: newPrices}).then(() => {
            this.getProductsForPB();
        })
    
    }

    subDiscount(){
        this.getSelectedRows();
        let ids = [];
        let newPrices = [];
        console.log('add flat')
        for(let i = 0; i< this.selectedRows.length; i++){
            console.log('ids', ids);
            ids.push(this.selectedRows[i].Id);
            newPrices.push(Number(this.selectedRows[i].Price) * (1 - Number(this.discount)/100));

        }
        changePrices({ids: ids, newPrices: newPrices}).then(() => {
            this.getProductsForPB();
        })
    }

    subFlat(){
        this.getSelectedRows();
        let ids = [];
        let newPrices = [];
        console.log('add flat')
        for(let i = 0; i< this.selectedRows.length; i++){
            console.log('ids', ids);
            ids.push(this.selectedRows[i].Id);
            newPrices.push(Number(this.selectedRows[i].Price) - Number(this.flat))

        }
        changePrices({ids: ids, newPrices: newPrices}).then(() => {
            this.getProductsForPB();
        })
    }

    getSelectedRows(){
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
            this.selectedRows = selectedRecords;
            
        }   
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteProduct(row);
                break; 
            default:
        }
    }

    deleteProduct(row){

    }

}