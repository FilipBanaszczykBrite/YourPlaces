import { LightningElement, track } from 'lwc';
import getRecentProducts from '@salesforce/apex/YP_ProductSearchController.getRecentlyViewed';

export default class YP_RecentlyVIewedProducts extends LightningElement {

    @track items;

    connectedCallback(){
        this.items = [];
        getRecentProducts().then(result => {
            console.table(JSON.stringify(result));
            this.items = result;
        })
    }
}