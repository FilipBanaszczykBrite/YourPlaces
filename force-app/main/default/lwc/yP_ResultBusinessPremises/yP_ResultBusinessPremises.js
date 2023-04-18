import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class YP_ResultBusinessPremises extends NavigationMixin(LightningElement) {
    @api item;
    @track imageSrc;

    connectedCallback(){
        this.imageSrc =  this.item.DisplayUrl;
    }

    navigateToRecordPage() {
        if(this.isCommunity) {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'BusinessPremisesProductPage'
                },
                state: {
                    recordId: this.product.Id
                }
            });
        }
        else{
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.item.Id,
                    objectApiName: 'Product2',
                    actionName: 'view'
                }
            });
        }
        
    }
}
