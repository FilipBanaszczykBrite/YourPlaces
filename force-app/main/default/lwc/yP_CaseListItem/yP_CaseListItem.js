import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import SUBM from '@salesforce/label/c.YP_SubmittedOn';
import CLOS from '@salesforce/label/c.YP_ClosedOn';

export default class YP_CaseListItem extends NavigationMixin(LightningElement) {

    labels = {
        SUBM,
    }
    @api item;
    @track createdDateLabel;
    @track closedDateLabel;
    @track statusClass;

    renderedCallback(){
        
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
    }

    goToCaseDetails(){
        //window.location.assign('https://your-places-developer-edition.eu42.force.com/businessandliving/s/detail/' + this.item.Id);

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Case_Details__c'
            },
            state: {
                recordId: this.item.Id
            }
        });
    }
}