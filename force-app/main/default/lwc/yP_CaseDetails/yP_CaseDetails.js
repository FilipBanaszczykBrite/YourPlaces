import { LightningElement, api, track } from 'lwc';
import getDetails from '@salesforce/apex/YP_CaseController.getCaseDetails';
import SUBM from '@salesforce/label/c.YP_SubmittedOn';
import CLOS from '@salesforce/label/c.YP_ClosedOn';
import CTYPE from '@salesforce/label/c.YP_Type';
import CNUM from '@salesforce/label/c.YP_CaseNumber';
export default class YP_CaseDetails extends LightningElement {

    labels = {
        SUBM,
        CLOS,
        CTYPE,
        CNUM,
    }

    @track item;
    @api recordId;
    @track createdDateLabel;
    @track closedDateLabel;
    @track statusClass;
    @track isLoading;

    connectedCallback(){
        this.isLoading = true;
        getDetails({caseId: this.recordId}).then(result => {
            this.item = result;
            this.isLoading = false;
            this.createdDateLabel = this.item.CreatedDate.toString().slice(0, 10);
            if(this.item.ClosedDate != null){
                this.closedDateLabel = CLOS + ': ' + this.item.ClosedDate.toString().slice(0, 10);
            }
            if(this.item.Status == 'New'){
                this.statusClass = 'new';
            }
            else if(this.item.Status == 'Working'){
                this.statusClass = 'working';
            }
            else if(this.item.Status == 'Escalated'){
                this.statusClass = 'escalated';
            }
            else if(this.item.Status == 'Closed'){
                this.statusClass = 'closed';
            }
        })
    }
}