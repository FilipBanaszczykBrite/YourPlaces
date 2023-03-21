import { LightningElement, track } from 'lwc';
import getApartments from '@salesforce/apex/YP_ProductSearchController.getApartments';
//import getBusinessPremises from '@salesforce/apex/YP_ProductSearchController.getBusinessPremises';
export default class YP_SearchResults extends LightningElement {

    @track results = [];
    connectedCallback(){
        getApartments().then(result => {
            console.log("Apartments " + JSON.stringify(result));
            this.results = result;
        })
    }
}