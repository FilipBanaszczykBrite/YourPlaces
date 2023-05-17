import { LightningElement } from 'lwc';
import BANNER from "@salesforce/resourceUrl/YP_HomePageImage";
import { NavigationMixin } from 'lightning/navigation';
export default class YP_HomePage extends NavigationMixin(LightningElement) {

    imgSrc = BANNER;

    goToProducts(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Product_Search__c'
            }
        });
    }
}