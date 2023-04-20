import { LightningElement, api, track} from 'lwc';
import getDetails from '@salesforce/apex/YP_BusinessPremisesController.getDetails';
import getImages from '@salesforce/apex/YP_BusinessPremisesController.getImages';
import AREA from '@salesforce/label/c.YP_Area';
import FLOORS from '@salesforce/label/c.YP_Floors';
import MROOMS from '@salesforce/label/c.YP_MeetingRooms';
import RROOMS from '@salesforce/label/c.YP_Restrooms';
import UROOMS from '@salesforce/label/c.YP_UtilityRooms';
import PRGAL from '@salesforce/label/c.YP_ProductGallery';
export default class YP_BusinessPremisesDetails extends LightningElement {

    labels = {
        AREA,
        FLOORS,
        MROOMS,
        RROOMS,
        UROOMS,
        PRGAL
    }

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

    connectedCallback(){
        this.isLoading = true;
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
            this.images.push({image: result.photoUrl})
            
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
}