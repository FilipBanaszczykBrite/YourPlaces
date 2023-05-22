import { LightningElement, track, wire } from 'lwc';
import getApartments from '@salesforce/apex/YP_ProductSearchController.getApartments';
import getAllApartments from '@salesforce/apex/YP_ProductSearchController.getAllApartments';
import getBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getBusinessPremisesCommunity';
import getAllBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getAllBusinessPremisesCommunity';
import ASMC from '@salesforce/messageChannel/YP_ApartamentsSearchMessageChannel__c';
import BPSMC from '@salesforce/messageChannel/YP_BusinessPremisesSearchMessageChannel__c';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import getRole from '@salesforce/apex/YP_ProductSearchController.getUserRole';
import Id from '@salesforce/user/Id';

export default class YP_SearchResults extends LightningElement {

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
        console.log(Id);
        getRole({userId: Id}).then(result => {
            console.log(result);
            if(result === 'Housing Management' || result === 'Housing Sales'){
                this.business = false;
                this.subscribeAMC();
                getAllApartments().then(result => {
                    this.results = result;
                    
                    this.pageCount = Math.ceil(result.length/this.pageSize);
                    this.updateRecords();
                    
                    this.displayResultCount = '(' + result.length + ')';
                    this.isLoading = false;
                })
            }
            else if(result === 'Business Premises Management' || result === 'Business Premises Sales'){
                this.business = true;
                this.subscribeBPMC();
                getAllBusinessPremises().then(result => {
                    this.results = result;
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'EUR' });
                    this.results.forEach(element => 
                        element.price = formatter.format(element.price));
                    this.pageCount = Math.ceil(result.length/this.pageSize);
                    this.updateRecords();
                    
                    this.displayResultCount = '(' + result.length + ')';
                    this.isLoading = false;
                })
            }
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

    subscribeAMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            ASMC,
            (message) => { 
             
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
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR' });
                this.results.forEach(element => 
                    element.price = formatter.format(element.price));
            this.results = result;
            this.displayResultCount = '(' + result.length + ')';
            this.pageCount = Math.ceil(result.length/this.pageSize);
            this.updateRecords();
        })
    }
}