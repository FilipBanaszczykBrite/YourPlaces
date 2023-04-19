import { LightningElement, api, track} from 'lwc';
import getDetails from '@salesforce/apex/YP_BusinessPremisesController.getDetails';
import getImages from '@salesforce/apex/YP_BusinessPremisesController.getImages';
export default class YP_BusinessPremisesDetails extends LightningElement {

    @api recordId;
    @track isLoading;
    @track recordName;
    @track recordPrice;
    @track recordArea;
    @track recordPhoto;
    @track recordAddress;
    @track floors;
    @track meetingRooms;
    @track restrooms;
    @track utilityRooms;
    @track images;

    connectedCallback(){
        this.isLoading = true;
        getDetails({recordId: this.recordId}).then(result => {
            this.recordName = result.name;
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR' });
            this.recordPrice = formatter.format(result.price);
            this.recordArea = result.area;
            this.recordPhoto = result.photoUrl;
            this.recordAddress = result.address;
            this.floors = result.floors;
            this.meetingRooms = result.meetingRooms;
            this.restrooms = result.restrooms;
            this.utilityRooms = result.utilityRooms;
            this.images = [];
            this.images.push({image: result.photoUrl})
            getImages({recordId: this.recordId}).then(result => {
                console.log(result.length)
                for(let i = 0 ; i< result.length; i++){
                    this.images.push({image: result[i]})
                }
                this.isLoading = false;
            })
        })

        
    }
}