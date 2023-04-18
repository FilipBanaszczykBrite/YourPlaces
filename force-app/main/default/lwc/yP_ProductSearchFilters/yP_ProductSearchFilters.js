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


    @wire (MessageContext)
    messageContext;

    changeAreaMin(event){
        this.areaMin = event.target.value;
    }
    changeAreaMax(event){
        this.areaMax = event.target.value;
    }

    changePriceMin(event){
        this.priceMin = event.target.value;
    }
    changePriceMax(event){
        this.priceMax = event.target.value;
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