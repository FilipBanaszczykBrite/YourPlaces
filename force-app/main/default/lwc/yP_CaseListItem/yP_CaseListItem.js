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
    @track description = '';


    connectedCallback(){
        if(this.item.Description != null){
            let words = this.item.Description.split(' ');
             this.description = words[0];
             let descLength = words.length > 10 ? 10 : words.length;
             for(let i = 1; i < descLength; i++){
                 this.description += ' ' + words[i];
             } 
             this.description += '...';
         }
    }

    renderedCallback(){ 
        this.createdDateLabel = this.item.CreatedDate.toString().slice(0, 10);
        if(this.item.ClosedDate != null){
            this.closedDateLabel = CLOS + ': ' + this.item.ClosedDate.toString().slice(0, 10);
        }
        if(this.item.Status == 'New'){
            this.statusClass = 'status new';
        }
        else if(this.item.Status == 'Working'){
            this.statusClass = 'status working';
        }
        else if(this.item.Status == 'Escalated'){
            this.statusClass = 'status escalated';
        }
        else if(this.item.Status == 'Closed'){
            this.statusClass = 'status closed';
        }
        
    }

    goToCaseDetails(){
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