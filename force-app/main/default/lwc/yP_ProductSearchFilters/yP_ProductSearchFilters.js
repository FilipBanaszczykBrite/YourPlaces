import { LightningElement, track, wire, api } from 'lwc';
import FMC from '@salesforce/messageChannel/YP_BusinessPremisesFiltersMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
export default class YP_ProductSearchFilters extends LightningElement {
    @track areaMin;
    @track areaMax;
    @track floors;
    @track meetingRooms;
    @track restrooms;
    @track utilityRooms;
    @track priceMin;
    @track priceMax;
    @track invalidFilters = false;
    @track invalidPrice = false;
    @track invalidArea = false;


    @wire (MessageContext)
    messageContext;

    changeAreaMin(event){
        this.areaMin = event.target.value;
        if( this.areaMin > this.areaMax){
            this.invalidFilters = true;
            this.invalidArea = true;
        }
        else{
            this.invalidFilters = false;
            this.invalidArea = false;
        }
    }
    changeAreaMax(event){
        this.areaMax = event.target.value;
        if( this.areaMin > this.areaMax){
            this.invalidFilters = true;
            this.invalidArea = true;
        }
        else{
            this.invalidFilters = false;
            this.invalidArea = false;
        }
    }

    changePriceMin(event){
        this.priceMin = event.target.value;
        if( this.priceMin > this.priceMax){
            this.invalidFilters = true;
            this.invalidPrice = true;
        }
        else{
            this.invalidFilters = false;
            this.invalidPrice = false;
        }
    }
    changePriceMax(event){
        this.priceMax = event.target.value;
        if( this.priceMin > this.priceMax){
            this.invalidFilters = true;
            this.invalidPrice = true;
        }
        else{
            this.invalidFilters = false;
            this.invalidPrice = false;
        }
    }
    changeFloors(event){
        this.floors = event.target.value;
    }
    changeMeetingRooms(event){
        this.meetingRooms = event.target.value;
    }
    changeRestrooms(event){
        this.restrooms = event.target.value;
    }
    changeUtilityRooms(event){
        this.utilityRooms = event.target.value;
    }


    sendMessageService() { 
        const searchEvent = new CustomEvent('search', { detail: { areaMin: this.areaMin, areaMax: this.areaMax,
            priceMin: this.priceMin, priceMax: this.priceMax, floors: this.floors, meetingRooms: this.meetingRooms,
            restrooms: this.restrooms, utilityRooms: this.utilityRooms }});
        console.log('dispatch', JSON.stringify(searchEvent.detail))
        this.dispatchEvent(searchEvent);
    }

    clear(){
        this.invalidFilters = false;
        this.invalidArea = false;
        this.invalidPrice = false;
        this.areaMin = undefined;
        this.areaMax = undefined;
        this.priceMin = undefined;
        this.priceMax = undefined;
        this.floors = undefined;
        this.meetingRooms = undefined;
        this.restrooms = undefined;
        this.utilityRooms = undefined;
        this.search();
    
    }

    search(){
        this.sendMessageService();
    }
}