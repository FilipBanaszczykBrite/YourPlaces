import { LightningElement, api } from 'lwc';
import sendMail from '@salesforce/apex/YP_QuoteMailController.sendMail';
export default class YP_QuoteMailAction extends LightningElement {

    @api recordId;

    connectedCallback(){
        sendMail({recordId: this.recordId}).then(result => {
            this.dispatchEvent(new CustomEvent('send', { detail : result  }));
        });
        
    }
}