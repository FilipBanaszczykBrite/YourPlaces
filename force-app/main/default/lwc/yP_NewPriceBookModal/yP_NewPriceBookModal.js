import LightningModal from 'lightning/modal';
import { wire, track } from 'lwc';
import PB_OBJECT from '@salesforce/schema/Pricebook2';
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';
import TARGET_FIELD from '@salesforce/schema/Pricebook2.Target_Product__c';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
import getRecordTypes from '@salesforce/apex/YP_PriceBookManagerController.getPBRecordTypes';

export default class YP_NewPriceBookModal extends LightningModal {

    object = PB_OBJECT;
    myFields = [NAME_FIELD, ACTIVE_FIELD, START_FIELD, END_FIELD];
    @wire (MessageContext)
    messageContext;
    @track value;

    recordTypes;
    @track options;

   
    connectedCallback(){
        getRecordTypes().then(result => {
            this.options = [];
            this.recordTypes = result;
            console.log('types ' + JSON.stringify(result));
            console.log('types ' + JSON.stringify(this.recordTypes));
            console.log('types ' + this.recordTypes.length);
            for(let i = 0; i < this.recordTypes.length; i++){
                this.options.push({ label: this.recordTypes[i].Name, value: this.recordTypes[i].Id });
            }
            if(this.options.length > 0){
                this.value = this.options[0].value;
            }
            console.log('types ' + JSON.stringify(this.options));
        }) 
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        console.log(this.template.querySelector('lightning-combobox').value);
        fields.RecordTypeId = this.template.querySelector('lightning-combobox').value;

        this.template.querySelector('lightning-record-form').submit(fields);
       
    }

    handleSuccess(){
        publish(this.messageContext, NPBMC);
        this.close({result: 'created'});
    }

    handleChange(event){
        this.value = event.detail.value;
    }
}