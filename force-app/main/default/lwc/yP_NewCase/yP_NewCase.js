import { LightningElement } from 'lwc';
import createCase from '@salesforce/apex/YP_CaseController.createCase';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import TYPE_FIELD from '@salesforce/schema/Case.Type';
import DESC_FIELD from '@salesforce/schema/Case.Description';
import id from '@salesforce/user/Id';
export default class YP_NewCase extends LightningElement {

    fields = [SUBJECT_FIELD, TYPE_FIELD, DESC_FIELD];


    sendSubmitted(){
        const submittedEvent = new CustomEvent('submitted');
        this.dispatchEvent(submittedEvent);
    }
}