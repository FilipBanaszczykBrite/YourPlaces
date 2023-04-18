import { LightningElement, track, wire } from 'lwc';
;
import getBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getBusinessPremisesCommunity';
import getAllBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getAllBusinessPremisesCommunity';

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
        this.isLoading = true;
        getAllBusinessPremises().then(result => {
            this.results = result;
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
    }



    subscribeBPMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            BPSMC,
            (message) => { 
                this.searchBP(message);
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }



    searchBP(event){
        this.resultsShown = []
        this.results = []
        console.log('event ', JSON.stringify(event.detail));
        getBusinessPremises({name: event.detail.name, areaMin: event.detail.areaMin, areaMax: event.detail.areaMax,
             priceMin: event.detail.priceMin, priceMax: event.detail.priceMax,
             meetingRooms: event.detail.meetingRooms, restrooms: event.detail.restrooms, utilityRooms: event.detail.utilityRooms }).then(result => {
            this.results = result;
            this.displayResultCount = '(' + result.length + ')';
            this.pageCount = Math.ceil(result.length/this.pageSize);
            this.updateRecords();
        })
    }
}