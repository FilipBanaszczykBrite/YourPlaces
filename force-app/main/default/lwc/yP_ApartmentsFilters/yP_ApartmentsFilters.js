import { LightningElement, wire, track } from 'lwc';
import FMC from '@salesforce/messageChannel/YP_FiltersMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class YP_ApartmentsFilters extends LightningElement {

    @track areaMin;
    @track areaMax;
    @track floors;
    @track bedrooms;
    @track bathrooms;
    @track attic;
    @track basement;
    @wire (MessageContext)
    messageContext;

    changeAreaMin(event){
        this.areaMin = event.detail.value;
    }
    changeAreaMax(event){
        this.areaMax = event.detail.value;
    }
    changeFloors(event){
        this.floors = event.detail.value;
    }
    changeBedrooms(event){
        this.bedrooms = event.detail.value;
    }
    changeBathrooms(event){
        this.bathrooms = event.detail.value;
    }
    changeAttic(event){
        this.attic = event.detail.value;
    }
    changeBasement(event){
        this.basement = event.detail.value;
    }

    sendMessageService() { 
        publish(this.messageContext, FMC, { areaMin: this.areaMin, areaMax: this.areaMax, floors: this.floors, bedrooms: this.bedrooms,
        bathrooms: this.bathrooms, attic: this.attic, basement: this.basement });
    }

    clear(){
        this.areaMin = '';
        this.areaMax = '';
        this.floors = '';
        this.bedrooms = '';
        this.bathrooms = '';
        this.attic = '';
        this.basement = '';
    }

    search(){
        console.log('click search')
        this.sendMessageService();
    }
}