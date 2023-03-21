import { LightningElement, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getRole from '@salesforce/apex/YP_ProductSearchController.getUserRole'
export default class YP_FiltersBar extends LightningElement {

    @track filtersForBusiness;
    connectedCallback(){
        getRole({userId: Id}).then(result => {
            if(result === 'Housing Management' || result === 'Housing Sales'){
                this.filtersForBusiness = false;
            }
            else if(result === 'Business Premises Management' || result === 'Business Premises Sales'){
                this.filtersForBusiness = true;
            }
        })
    }
}