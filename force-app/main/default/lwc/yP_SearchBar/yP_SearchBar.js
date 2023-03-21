import { LightningElement, wire, track } from 'lwc';
import SMC from '@salesforce/messageChannel/YP_SearchMessageChannel__c';
import FMC from '@salesforce/messageChannel/YP_FiltersMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, publish, MessageContext } from 'lightning/messageService';

export default class YP_SearchBar extends LightningElement {

    @wire (MessageContext)
    messageContext;
    @track query;
    filters;
    subscription = null;

    connectedCallback(){
        this.subscribeMC();
    }
    sendMessageService() { 
        console.log('filter search ' + this.message);
        publish(this.messageContext, SMC, { name: this.query, areaMin: this.filters.areaMin, areaMax: this.filters.areaMax, floors: this.filters.floors,
             bedrooms: this.filters.bedrooms, bathrooms: this.filters.bathrooms, attic: this.filters.attic, basement: this.filters.basement });
    }

    search() { 
        console.log('search ' + this.query);
        publish(this.messageContext, SMC, { name: this.query});
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            FMC,
            (message) => { 
                console.log('get message bar' + JSON.stringify(message))
                this.filters = message;
                this.sendMessageService();
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    handleChange(event){
        this.query = event.detail.value;
        console.log('change aeasdasda' + this.filters);
        if(this.filters){
            console.log('change treu' + this.filters);
            this.sendMessageService();
        }
        else{
            console.log('change ' + this.filters);
            this.search();
        }
        
    }

}