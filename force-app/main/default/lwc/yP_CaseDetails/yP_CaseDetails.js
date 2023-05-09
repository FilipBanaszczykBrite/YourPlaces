import { LightningElement, api } from 'lwc';

export default class YP_CaseDetails extends LightningElement {

    @api recordId;

    connectedCallback(){
        console.log('details connected')
    }
}