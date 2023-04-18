import { LightningElement, wire, track } from 'lwc';


export default class YP_BusinessPremisesFilters extends LightningElement {

    @track areaMin;
    @track areaMax;
    @track floors;
    @track meetingRooms;
    @track restrooms;
    @track utilityRooms;



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
        const searchEvent = new CustomEvent('search', { detail: { areaMin: this.areaMin, areaMax: this.areaMax, floors: this.floors, meetingRooms: this.meetingRooms, restrooms: this.restrooms, utilityRooms: this.utilityRooms }});
        this.dispatchEvent(searchEvent);
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