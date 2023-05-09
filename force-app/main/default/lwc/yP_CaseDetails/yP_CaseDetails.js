import { LightningElement, api } from 'lwc';
import getDetails from '@salesforce/apex/YP_CaseController.getCaseDetails'
export default class YP_CaseDetails extends LightningElement {

    @api recordId;

    connectedCallback(){
        console.log('details connected')
        getDetails({caseId: this.recordId}).then(result => {
            console.log(JSON.stringify(result))
        })
    }
}