import { LightningElement, api, track} from 'lwc';
import getDetails from '@salesforce/apex/YP_BusinessPremisesController.getDetails';
export default class YP_BusinessPremisesDetails extends LightningElement {

    @api recordId;

    @track record;

    connectedCallback(){
        console.log('id ' + this.recordId);
        getDetails({recordId: this.recordId}).then(result => {
            console.log('product details' + JSON.stringify(result));
            this.record = result;
        })
    }
}