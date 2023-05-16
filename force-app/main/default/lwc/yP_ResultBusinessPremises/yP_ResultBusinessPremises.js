import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class YP_ResultBusinessPremises extends NavigationMixin(LightningElement) {
    @api item;
    @api community;
    @track imageSrc;

    connectedCallback(){
        this.imageSrc =  this.item.DisplayUrl;
    }

    navigateToRecordPage() {
        console.log(this.item.id, this.community)
        if(this.community == true){
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Business_Premise_Details__c'
                },
                state: {
                    recordId: this.item.id
                }
            });
        }
        
        else{
           
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.item.id,
                    objectApiName: 'Product2',
                    actionName: 'view'
                }
            });
        }
        
    }
}