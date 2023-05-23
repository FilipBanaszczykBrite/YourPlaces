import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getDiscountPrice from '@salesforce/apex/YP_ProductSearchController.getDiscountPrice';

export default class YP_ResultBusinessPremises extends NavigationMixin(LightningElement) {
    @api item;
    @api community;
    @track imageSrc;
    @track recordStandardPrice;
    @track recordNewPrice;

    connectedCallback(){
        this.imageSrc =  this.item.DisplayUrl;
        this.recordStandardPrice = {value: '', class: 'price'};
        this.recordNewPrice = {value: '', class: 'price'};
        getDiscountPrice({recordId: this.item.id}).then(result =>{
            console.log(JSON.stringify(result))
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR' });
            if(typeof this.item.price == 'string'){
                this.recordStandardPrice = {value: this.item.price, class: (result == null ? 'slds-hidden' : 'price')};
            }
            else if(typeof this.item.price == 'number'){
                this.recordStandardPrice = {value: formatter.format((Number)(this.item.price)), class: (result == null ? 'slds-hidden' : 'price')};
                
            }
            this.recordNewPrice = {value: (result == null ? this.item.price : formatter.format((Number)(result))), class:  'price-new'};
        });
       
    }

    navigateToRecordPage() {
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