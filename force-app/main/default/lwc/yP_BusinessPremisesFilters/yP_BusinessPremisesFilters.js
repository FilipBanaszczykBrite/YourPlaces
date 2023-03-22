import { LightningElement, wire, track } from 'lwc';
import FMC from '@salesforce/messageChannel/YP_BusinessPremisesFiltersMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class YP_BusinessPremisesFilters extends LightningElement {

    @track areaMin;
    @track areaMax;
    @track floors;
    @track meetingRooms;
    @track restrooms;
    @track utilityRooms;

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
    changeMeetingRooms(event){
        this.meetingRooms = event.detail.value;
    }
    changeRestrooms(event){
        this.restrooms = event.detail.value;
    }
    changeUtilityRooms(event){
        this.utilityRooms = event.detail.value;
    }


    sendMessageService() { 
        console.log('params ' + this.utilityRooms )
        publish(this.messageContext, FMC, { areaMin: this.areaMin, areaMax: this.areaMax, floors: this.floors, meetingRooms: this.meetingRooms,
            restrooms: this.restrooms, utilityRooms: this.utilityRooms });
    }

    clear(){
        this.areaMin = undefined;
        this.areaMax = undefined;
        this.floors = undefined;
        this.meetingRooms = undefined;
        this.restrooms = undefined;
        this.utilityRooms = undefined;
        this.search();
    
    }

    search(){
        console.log('click search')
        this.sendMessageService();
    }
}