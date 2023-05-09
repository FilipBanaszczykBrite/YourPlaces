import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import markAsViewed from '@salesforce/apex/YP_ProductSearchController.markProductAsRecentlyViewed'
export default class YP_ResultBusinessPremises extends NavigationMixin(LightningElement) {
    @api item;
    @track imageSrc;

    connectedCallback(){
        this.imageSrc =  this.item.DisplayUrl;
    }

    navigateToRecordPage() {
        // markAsViewed().then(() => {
        //     this[NavigationMixin.Navigate]({
        //         type: 'comm__namedPage',
        //         attributes: {
        //             name: 'BusinessPremisesProductPage__c'
        //         },
        //         state: {
        //             recordId: this.item.id
        //         }
        //     });
        // })
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'BusinessPremisesProductPage__c'
            },
            state: {
                recordId: this.item.id
            }
        });
        // else{
        //     this[NavigationMixin.Navigate]({
        //         type: 'standard__recordPage',
        //         attributes: {
        //             recordId: this.item.Id,
        //             objectApiName: 'Product2',
        //             actionName: 'view'
        //         }
        //     });
        // }
        
    }
}
