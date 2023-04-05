import { LightningElement, track, wire } from 'lwc';
import getPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.getPriceBooks';
import searchPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.searchPriceBooks';
import PBSMC from '@salesforce/messageChannel/YP_PriceBookSearchMessageChannel__c';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import EPBMC from '@salesforce/messageChannel/YP_EditPBMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';
import NewPBModal from 'c/yP_NewPriceBookModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NEWBTN from '@salesforce/label/c.YP_NewBtn';
import PBS from '@salesforce/label/c.YP_PriceBooks';
import TIMELINE from '@salesforce/label/c.YP_Timeline';
import EDIT from '@salesforce/label/c.YP_Edit';
import NAME from '@salesforce/label/c.YP_NameLabel';
import ACTIVE from '@salesforce/label/c.YP_ActiveLabel';
import STARTDATE from '@salesforce/label/c.YP_StartDateLabel';
import ENDDATE from '@salesforce/label/c.YP_EndDateLabel';

export default class YP_PriceBookSearchResults extends LightningElement {

    labels= {
        NEWBTN,
        PBS,
        TIMELINE,
        EDIT,
        NAME,
        ACTIVE,
        STARTDATE,
        ENDDATE
    }
    @track priceBooks;
    @track isLoading;
    @wire(MessageContext)
    messageContext;
    subscriptionMC = null;
    subscriptionNPBMC = null;
    actions = [
        { label: EDIT, name: 'edit' },
    ];
    columns = [
        { label: NAME, fieldName: 'Name' },
        { label: ACTIVE, fieldName: 'IsActive'},
        { label: STARTDATE, fieldName: 'StartDate__c'},
        { label: ENDDATE, fieldName: 'EndDate__c' },
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
        if(result.result == 'created'){
            this.showToast('Success', 'success', 'New Pricebook created.');
        }
        
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
        publish(this.messageContext, EPBMC, { record: row });
    }

  
}