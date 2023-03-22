import { LightningElement, wire, track } from 'lwc';
import FMC from '@salesforce/messageChannel/YP_ApartamentsFiltersMessageChannel__c';
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
        console.log('change attic ' + this.attic)
        if(event.detail.checked){
            this.attic = event.detail.checked;
        }
        else{
            this.attic = undefined;
        }
        
    }
    changeBasement(event){
        console.log('change basement ' + this.basement)
        if(event.detail.checked){
            this.basement = event.detail.checked;
        }
        else{
            this.basement = undefined;
        }
    }

    sendMessageService() { 
        publish(this.messageContext, FMC, { areaMin: this.areaMin, areaMax: this.areaMax, floors: this.floors, bedrooms: this.bedrooms,
        bathrooms: this.bathrooms, attic: this.attic, basement: this.basement });
    }

    clear(){
        this.areaMin = undefined;
        this.areaMax = undefined;
        this.floors = undefined;
        this.bedrooms = undefined;
        this.bathrooms = undefined;
        this.attic = undefined;
        this.basement = undefined;
        this.search();
    }

    search(){
        console.log('click search')
        this.sendMessageService();
    }
}