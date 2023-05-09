import { LightningElement, track, api } from 'lwc';
import getCases from '@salesforce/apex/YP_CaseController.getUserCases';
import id from '@salesforce/user/Id';

export default class YP_CaseList extends LightningElement {

    @track cases;
    @track isLoading;
    
    connectedCallback(){
       this.loadCases();
    }

    @api
    loadCases(){
        this.isLoading = true;
        getCases({userId: id}).then(result => {
            this.cases = result;
            this.isLoading = false;
        });
    }
}