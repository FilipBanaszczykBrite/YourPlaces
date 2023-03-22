import { LightningElement, track, wire } from 'lwc';
import getPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.getPriceBooks';
import searchPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.searchPriceBooks';
import PBSMC from '@salesforce/messageChannel/YP_PriceBookSearchMessageChannel__c';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import EPBMC from '@salesforce/messageChannel/YP_EditPBMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';
import NewPBModal from 'c/yP_NewPriceBookModal';


export default class YP_PriceBookSearchResults extends LightningElement {

    @track priceBooks;
    @track isLoading;
    @wire(MessageContext)
    messageContext;
    subscriptionMC = null;
    subscriptionNPBMC = null;
    actions = [
        { label: 'Edit', name: 'edit' },
    ];
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Active', fieldName: 'IsActive'},
        { label: 'Start Date', fieldName: 'StartDate__c'},
        { label: 'End Date', fieldName: 'EndDate__c' },
        {
            type: 'action',
            typeAttributes: { rowActions: this.actions },
        },
    ];

    connectedCallback(){
        this.isLoading = true;
        this.subscribeMC();
        this.subscribeNPBMC();
        this.getAllPB();
        
    }

    getAllPB(){
        getPriceBooks().then(result =>{
          
            this.priceBooks = result;
            this.isLoading = false;
        }).catch(() => {
            this.isLoading = false;
        })
    }

    subscribeMC() {
        if (this.subscriptionMC) {
            return;
        }
        this.subscriptionMC = subscribe(
            this.messageContext,
            PBSMC,
            (message) => { 
                
                this.search(message);
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    subscribeNPBMC() {
        if (this.subscriptionNPBMC) {
            return;
        }
        this.subscriptionNPBMC = subscribe(
            this.messageContext,
            NPBMC,
            () => { 
                console.log('poke')
                this.getAllPB();
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    search(message){
        this.isLoading = true;
    
        searchPriceBooks({search: message.name}).then(result  =>{
            this.priceBooks = result;
            this.isLoading = false;
        }).catch(() => {
            this.isLoading = false;
        })
    }

    async openModal() {
      
        const result = await NewPBModal.open({
            size: 'large',
     
        });
        console.log(result);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'edit':
                this.showEdit(row);
                break; 
            default:
        }
    }

    showEdit(row){
        console.log('edit ' + JSON.stringify(row));
        publish(this.messageContext, EPBMC, { record: row });
    }

  
}