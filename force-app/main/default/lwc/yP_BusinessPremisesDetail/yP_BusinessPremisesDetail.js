import { LightningElement, api, track} from 'lwc';
import getDetails from '@salesforce/apex/YP_BusinessPremisesController.getDetails';
import getImages from '@salesforce/apex/YP_BusinessPremisesController.getImages';
import hasReservation from '@salesforce/apex/YP_BusinessPremisesController.hasReservation';
import cancelReservation from '@salesforce/apex/YP_BusinessPremisesController.cancelReservation';
import AREA from '@salesforce/label/c.YP_Area';
import FLOORS from '@salesforce/label/c.YP_Floors';
import MROOMS from '@salesforce/label/c.YP_MeetingRooms';
import RROOMS from '@salesforce/label/c.YP_Restrooms';
import UROOMS from '@salesforce/label/c.YP_UtilityRooms';
import PRGAL from '@salesforce/label/c.YP_ProductGallery';
import CNCBT from '@salesforce/label/c.YP_CancelBtn';
import RESLB from '@salesforce/label/c.YP_DemoLabel';
// import DEMOSUCCESS from '@salesforce/label/c.YP_DemoAgentSuccess';
// import DEMOFAIL from '@salesforce/label/c.YP_DemoAgentFail';
import ReservationModal from 'c/yP_AgentReservationModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';

export default class YP_BusinessPremisesDetails extends LightningElement {

    userId = Id;
    labels = {
        AREA,
        FLOORS,
        MROOMS,
        RROOMS,
        UROOMS,
        PRGAL,
        CNCBT,
        RESLB
    }
    @track loggedUser = false;
    @track demoReserved = false;

    @api recordId;
    @track isLoading;
    @track recordName;
    @track recordDescription;
    @track recordPrice;
    @track recordArea;
    @track recordPhoto;
    @track recordAddress;
    @track floors;
    @track meetingRooms;
    @track restrooms;
    @track utilityRooms;
    @track images;
    @track bottomImage;
    @track midImage;
    @track reservationLabel;
    agentId;
    reservationId;

    connectedCallback(){
        this.isLoading = true;
        console.log('conncted')
        getDetails({recordId: this.recordId}).then(result => {
            this.recordName = result.name;
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR' });
            this.recordPrice = formatter.format(result.price);
            this.recordDescription = result.description;
            this.recordArea = result.area;
            this.recordPhoto = result.photoUrl;
            this.recordAddress = result.address;
            this.floors = result.floors;
            this.meetingRooms = result.meetingRooms;
            this.restrooms = result.restrooms;
            this.utilityRooms = result.utilityRooms;
            this.images = [];
            this.agentId = result.agentId
            this.images.push({image: result.photoUrl})
            this.loggedUser = (this.userId != undefined);
            if(this.loggedUser){
                hasReservation({userId: this.userId, ownerId: this.agentId}).then(result => {
                    this.demoReserved = (result != []);
                    this.reservationId = result.Id;
                    this.reservationLabel = result.StartDateTime.slice(0,10) + ' ' + result.StartDateTime.slice(11,16);
                })
            }
            getImages({recordId: this.recordId}).then(result => {
                for(let i = 0 ; i< result.length; i++){
                    if(this.recordPhoto.slice(-120) != result[i].slice(-120)){
                        this.images.push({image: result[i]})
                    }
                }
                if(this.images.length > 2){
                    this.midImage = this.images[1].image;
                }
                else{
                    this.images[this.images.length - 1].image
                }
                this.bottomImage = this.images[this.images.length - 1].image;
                this.isLoading = false;
            })
        })  
    }

    async openReservation(event){
        const result = await ReservationModal.open({ 
            size: 'large',
            productId: this.recordId
        });
        if (result.isSuccess){
            const event = new ShowToastEvent({
                title: 'Success',
                variant: 'success',
                message: 'DEMOSUCCESS' + ' ' + result.selectedDate + ' ' + result.selectedTime
            });
            this.dispatchEvent(event);
            hasReservation({userId: this.userId, ownerId: this.agentId}).then(result => {
                this.demoReserved = (result != []);
                this.reservationId = result.Id;
                this.reservationLabel = result.StartDateTime.slice(0,10) + ' ' + result.StartDateTime.slice(11,16);
            })
        }
        else{
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: 'DEMOFAIL'
            });
            this.dispatchEvent(event);
        }
    }

    cancel(){
        cancelReservation({recordId: this.reservationId});
        this.demoReserved = false;
    }
}