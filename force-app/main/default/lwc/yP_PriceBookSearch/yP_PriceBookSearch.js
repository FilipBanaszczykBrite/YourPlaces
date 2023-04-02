import { LightningElement, wire, track } from 'lwc';
import PBSMC from '@salesforce/messageChannel/YP_PriceBookSearchMessageChannel__c';
import { publish, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
export default class YP_PriceBookSearch extends LightningElement {

    @wire (MessageContext)
    messageContext;
    @track query;

    search() { 
        publish(this.messageContext, PBSMC, { name: this.query });
    }

    handleChange(event){
        this.query = event.detail.value;
        this.search();
    }
}