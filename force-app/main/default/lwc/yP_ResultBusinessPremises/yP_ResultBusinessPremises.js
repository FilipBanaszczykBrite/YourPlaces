import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class YP_ResultBusinessPremises extends NavigationMixin(LightningElement) {
    @api item;
    @api community;
    @track imageSrc;
    @track recordPrice;

    connectedCallback(){
        this.imageSrc =  this.item.DisplayUrl;
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR' });
        if(typeof this.item.price == 'string'){
            this.recordPrice = this.item.price
        }
        else if(typeof this.item.price == 'number'){
            this.recordPrice = formatter.format((Number)(this.item.price));
        }
    }

    navigateToRecordPage() {
        console.log(this.community, typeof console.log(this.community))
        if(this.community == 'true'){
            console.log('community')
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
            console.log('org')
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