import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class YP_CaseListItem extends LightningElement {

    @api item;
    @track createdDateLabel;
    @track closedDateLabel;
    @track statusClass;

    connectedCallback(){
        this.createdDateLabel = this.item.CreatedDate.toString().slice(0, 10);
        if(this.item.ClosedDate != null){
            this.closedDateLabel = 'Closed on: ' + this.item.ClosedDate.toString().slice(0, 10);
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

    navigateToCasePage(){
        console.log('go to case page', this.item.Id)
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Case_Page__c'
            },
            
        });
    }
}