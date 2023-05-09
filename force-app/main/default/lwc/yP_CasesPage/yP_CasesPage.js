import { LightningElement, track } from 'lwc';

export default class YP_CasesPage extends LightningElement {

    @track hideCaseForm = false;
    hideNewCaseForm(){
        this.hideCaseForm = true;
        this.template.querySelector('c-y-p_-case-list').loadCases();
    }
}