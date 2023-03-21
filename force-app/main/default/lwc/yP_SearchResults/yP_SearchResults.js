import { LightningElement, track, wire } from 'lwc';
import getApartments from '@salesforce/apex/YP_ProductSearchController.getApartments';
import getAllApartments from '@salesforce/apex/YP_ProductSearchController.getAllApartments';
//import getBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getBusinessPremises';
import SMC from '@salesforce/messageChannel/YP_SearchMessageChannel__c';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

export default class YP_SearchResults extends LightningElement {

    @track results = [];
    @track displayResultCount;
    @wire(MessageContext)
    messageContext;

    subscription = null;
    connectedCallback(){
        this.subscribeMC();
        getAllApartments().then(result => {
            console.log("Apartments " + JSON.stringify(result));
            this.results = result;
            this.displayResultCount = '(' + result.length + ')';
        })
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            SMC,
            (message) => { 
                console.log('get message results ' + JSON.stringify(message))
                this.search(message);
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    search(message){
        getApartments({name: message.name, areaMin: message.areaMin, areaMax: message.areaMax,
             bedrooms: message.bedrooms, bathrooms: message.bathrooms, attic: message.attic, basement: message.basement}).then(result => {
            //console.log("Apartments " + JSON.stringify(result));
            this.results = result;
            this.displayResultCount = '(' + result.length + ')';
        })
    }
}