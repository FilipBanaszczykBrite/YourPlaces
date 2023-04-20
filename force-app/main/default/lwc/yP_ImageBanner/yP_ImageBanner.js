import { LightningElement } from 'lwc';
import BANNER from "@salesforce/resourceUrl/YP_CommunityBanner";
import { NavigationMixin } from 'lightning/navigation';
export default class YP_ImageBanner extends LightningElement {

    imgSrc = BANNER;

    goHome(){
        console.log('go home')
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                pageName: 'Search_Results__c'
            }
        });
    }
}