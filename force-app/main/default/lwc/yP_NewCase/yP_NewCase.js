import { LightningElement } from 'lwc';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import TYPE_FIELD from '@salesforce/schema/Case.Type';
import DESC_FIELD from '@salesforce/schema/Case.Description';
export default class YP_NewCase extends LightningElement {

    fields = [SUBJECT_FIELD, TYPE_FIELD, DESC_FIELD];

    changeDescription(event){
        console.log(event);
        console.log(event.detail.value);
        console.log(event.explicitOriginalTarget.name);
    }

    sendSubmitted(){

        const submittedEvent = new CustomEvent('submitted');
        this.dispatchEvent(submittedEvent);
    }
}