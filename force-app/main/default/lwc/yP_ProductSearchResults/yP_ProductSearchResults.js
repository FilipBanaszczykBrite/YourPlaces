import { LightningElement, track, wire } from 'lwc';
import getApartments from '@salesforce/apex/YP_ProductSearchController.getApartments';
import getAllApartments from '@salesforce/apex/YP_ProductSearchController.getAllApartments';
import getBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getBusinessPremises';
import getAllBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getAllBusinessPremises';
import ASMC from '@salesforce/messageChannel/YP_ApartamentsSearchMessageChannel__c';
import BPSMC from '@salesforce/messageChannel/YP_BusinessPremisesSearchMessageChannel__c';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';


export default class YP_ProductSearchResults extends LightningElement {

    @track results = [];
    @track resultsShown = [];
    pageSize = 4;
    @track pageCount;
    @track currentPage = 1;
    @track displayResultCount;
    @wire(MessageContext)
    messageContext;
    @track business;
    @track isLoading;

    subscription = null;
    connectedCallback(){
        getAllBusinessPremises().then(result => {
            this.results = result;
            console.log("Business Premises " + JSON.stringify(result));
            this.pageCount = Math.ceil(result.length/this.pageSize);
            this.updateRecords();
            
            this.displayResultCount = '(' + result.length + ')';
            this.isLoading = false;
        })
    }

    get disablePrevious(){ 
        return this.currentPage<=1;
    }
    get disableNext(){ 
        return this.currentPage>=this.pageCount;
    }
    previousHandler(){ 
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1
            this.updateRecords()
        }
    }
    nextHandler(){
        if(this.currentPage < this.pageCount){
            this.currentPage = this.currentPage+1
            this.updateRecords()
        }
    }
    updateRecords(){ 
        const start = (this.currentPage-1)*this.pageSize;
        const end = this.pageSize*this.currentPage;
        this.resultsShown = this.results.slice(start, end);
        console.log('SHOWN ' + start)
        console.log('SHOWN ' + end)
        console.log('SHOWN ' + this.results)
        console.log('SHOWN ' + this.resultsShown)
    }

    subscribeAMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            ASMC,
            (message) => { 
                console.log('get message results ' + JSON.stringify(message))
                this.searchA(message);
            
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
            BPSMC,
            (message) => { 
                console.log('get message results ' + JSON.stringify(message))
                this.searchBP(message);
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    searchA(message){
        this.resultsShown = []
        this.results = []
        getApartments({name: message.name, areaMin: message.areaMin, areaMax: message.areaMax,
             bedrooms: message.bedrooms, bathrooms: message.bathrooms, attic: message.attic, basement: message.basement}).then(result => {
            console.log("Apartments " + JSON.stringify(result));
            this.results = result;
            this.displayResultCount = '(' + result.length + ')';
            this.pageCount = Math.ceil(result.length/this.pageSize);
            this.updateRecords();
        })
    }

    searchBP(message){
        this.resultsShown = []
        this.results = []
        getBusinessPremises({name: message.name, areaMin: message.areaMin, areaMax: message.areaMax,
             meetingRooms: message.meetingRooms, restrooms: message.restrooms, utilityRooms: message.utilityRooms }).then(result => {
            console.log("Apartments " + JSON.stringify(result));
            this.results = result;
            this.displayResultCount = '(' + result.length + ')';
            this.pageCount = Math.ceil(result.length/this.pageSize);
            this.updateRecords();
        })
    }
}