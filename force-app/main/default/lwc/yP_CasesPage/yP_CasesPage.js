import { LightningElement, track } from 'lwc';
import NCASE from '@salesforce/label/c.YP_NewCase';
import MYCASES from '@salesforce/label/c.YP_MyCases';
import THANK from '@salesforce/label/c.YP_ThankSubmission';
import EWILLC from '@salesforce/label/c.YP_EmployeeWillContact';
export default class YP_CasesPage extends LightningElement {

    labels = {
        NCASE,
        MYCASES,
        THANK,
        EWILLC,
    }

    @track hideCaseForm = false;
    hideNewCaseForm(){
        this.hideCaseForm = true;
        this.template.querySelector('c-y-p_-case-list').loadCases();
    }
}