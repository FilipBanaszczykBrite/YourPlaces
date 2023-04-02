import { LightningElement, track, wire } from 'lwc';
import PB_OBJECT from '@salesforce/schema/Pricebook2';
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';
import TARGET_FIELD from '@salesforce/schema/Pricebook2.Target_Product__c';
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
    targetField = TARGET_FIELD;
    @track gotRecord = false;
    subscriptionEdit = null;
    subscriptionAdd = null;
    @wire(MessageContext)
    messageContext;
    recordId;
    @track products = [];
    @track selectedRows = [];
    @track discount;
    @track flat;
    @track newPrice;
    @track noSelected = true;

    columns = [
        { label: 'Product Name', fieldName: 'Name' },
        { label: 'Standard Price', fieldName: 'Price', type: 'currency'},
       
    ];

    options = [
        { label: 'New price', value: 'set' },
        { label: 'Percent', value: 'percent' },
        { label: 'Flat amount', value: 'flat' },
        
    ]
    @track optionSelected;
    @track flatChosen = false;
    @track setChosen = true;
    @track percentChosen = false;

    connectedCallback(){
        this.subscribeMCEdit();
        this.subscribeMCAdd();
        this.optionSelected = this.options[0].value;
    }

    changeModifier(event){
        this.optionSelected = event.detail.value;
        switch (this.optionSelected){
            case 'set':
                this.setChosen = true;
                this.flatChosen = false;
                this.percentChosen = false;
                break;
            case 'flat':
                this.setChosen = false;
                this.flatChosen = true;
                this.percentChosen = false;
                break;
            case 'percent':
                this.setChosen = false;
                this.flatChosen = false;
                this.percentChosen = true;
                break;
            default:
                this.setChosen = true;
                this.flatChosen = false;
                this.percentChosen = false;
        }
    }

    refreshButtons(){
        this.getSelectedRows();
        this.noSelected = (this.selectedRows.length == 0);
    }

    getProductsForPB(){
        getProducts({pbId: this.recordId}).then(result =>{
            this.products = [];
            for(let i = 0; i < result.length; i++) {
                let productsPrice = {
                    Id: result[i].Id,
                    ProductId: result[i].Product2Id,
                    Name: result[i].Product2.Name,
                    Price: result[i].UnitPrice,
                   
                    }
                this.products.push(productsPrice);
            }

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
        const result = await AddModal.open({
            size: 'medium',
            pbId : this.recordId

        });
        if(result.result == 'created'){
            this.showToast('Success', 'success', 'New products added.');
        }
    }
    changePercent(event){
        this.discount = event.detail.value;
    }

    changeFlat(event){
        this.flat = event.detail.value;
    }

    changeSet(event){
        this.newPrice = event.detail.value;
    }

    setNewPrice(){
        this.getSelectedRows();
        let ids = [];
        let newPrices = [];
        for(let i = 0; i< this.selectedRows.length; i++){
            ids.push(this.selectedRows[i].Id);
            newPrices.push(this.newPrice);

        }
        changePrices({ids: ids, newPrices: newPrices}).then(() => {
            this.getProductsForPB();
        })
    }

    addDiscount(){
        this.getSelectedRows();
        let ids = [];
        let newPrices = [];
        for(let i = 0; i< this.selectedRows.length; i++){
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
        for(let i = 0; i< this.selectedRows.length; i++){
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
        for(let i = 0; i< this.selectedRows.length; i++){
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
        for(let i = 0; i< this.selectedRows.length; i++){
            ids.push(this.selectedRows[i].Id);
            newPrices.push(Number(this.selectedRows[i].Price) - Number(this.flat))

        }
        changePrices({ids: ids, newPrices: newPrices}).then(() => {
            this.getProductsForPB();
        })
    }

    getSelectedRows(){
        this.selectedRows = [];
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
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