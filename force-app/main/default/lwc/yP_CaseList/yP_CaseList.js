import { LightningElement, track, api, wire } from 'lwc';
import getCases from '@salesforce/apex/YP_CaseController.getUserCases';
import id from '@salesforce/user/Id';
import CasesMCH from '@salesforce/messageChannel/YP_RefreshCasesMessageChannel__c';
import { subscribe, MessageContext } from 'lightning/messageService';
export default class YP_CaseList extends LightningElement {

    @track cases;
    @track isLoading;
    subscription = null;
 
    @wire(MessageContext)
    messageContext;
    
    connectedCallback(){
       this.loadCases();
       this.subscribeMC();
    }

    subscribeMC(){
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, CasesMCH, (message) => {
            console.log('got event')
            this.loadCases();
            
        });
    }

    @api
    loadCases(){
        this.isLoading = true;
        getCases({userId: id}).then(result => {
            this.cases = result;
            this.isLoading = false;
        });
    }
}