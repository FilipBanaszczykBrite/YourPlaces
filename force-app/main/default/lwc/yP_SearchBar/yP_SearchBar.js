import { LightningElement, wire, track } from 'lwc';
import ASMC from '@salesforce/messageChannel/YP_ApartamentsSearchMessageChannel__c';
import AFMC from '@salesforce/messageChannel/YP_ApartamentsFiltersMessageChannel__c';
import BPSMC from '@salesforce/messageChannel/YP_BusinessPremisesSearchMessageChannel__c';
import BPFMC from '@salesforce/messageChannel/YP_BusinessPremisesFiltersMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, publish, MessageContext } from 'lightning/messageService';
import getRole from '@salesforce/apex/YP_ProductSearchController.getUserRole';
import Id from '@salesforce/user/Id';

export default class YP_SearchBar extends LightningElement {

    @wire (MessageContext)
    messageContext;
    @track query;
    filters;
    subscription = null;
    business;

    connectedCallback(){
        getRole({userId: Id}).then(result => {
            if(result === 'Housing Management' || result === 'Housing Sales'){
                this.business = false;
                this.subscribeAMC();
            }
            else if(result === 'Business Premises Management' || result === 'Business Premises Sales'){
                this.business = true;
                this.subscribeBPMC();
            }
        })
    }
    sendMessageServiceA() { 
        console.log('filter search ' + this.message);
        publish(this.messageContext, ASMC, { name: this.query, areaMin: this.filters.areaMin, areaMax: this.filters.areaMax, floors: this.filters.floors,
             bedrooms: this.filters.bedrooms, bathrooms: this.filters.bathrooms, attic: this.filters.attic, basement: this.filters.basement });
    }

    searchA() { 
        console.log('search ' + this.query);
        publish(this.messageContext, ASMC, { name: this.query});
    }

    sendMessageServiceBP() { 
        console.log('filter search ' + this.message);
        publish(this.messageContext, BPSMC, { name: this.query, areaMin: this.filters.areaMin, areaMax: this.filters.areaMax, floors: this.filters.floors,
             meetingRooms: this.filters.meetingRooms, restrooms: this.filters.restrooms, utilityRooms: this.filters.utilityRooms });
    }

    searchBP() { 
        console.log('search ' + this.query);
        publish(this.messageContext, BPSMC, { name: this.query });
    }

    subscribeAMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            AFMC,
            (message) => { 
                console.log('get message bar A' + JSON.stringify(message))
                this.filters = message;
                this.sendMessageServiceA();
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    subscribeBPMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            BPFMC,
            (message) => { 
                console.log('get message bar BP' + JSON.stringify(message))
                this.filters = message;
                this.sendMessageServiceBP();
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    handleChange(event){
        this.query = event.detail.value;
        if(this.filters){
            if(this.business){
                this.sendMessageServiceBP();
            }
            else{
                this.sendMessageServiceA();
            } 
        }
        else{
            if(this.business){
                this.searchBP();
            }
            else{
                this.searchA();
            }
        }
    }
}