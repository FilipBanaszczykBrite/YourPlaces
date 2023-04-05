import LightningModal from 'lightning/modal';
import { wire, track } from 'lwc';
import PB_OBJECT from '@salesforce/schema/Pricebook2';
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';
import CANCELBUTTON from '@salesforce/label/c.YP_CancelButton';
import NEXTBTN from '@salesforce/label/c.YP_NextBtn';
import NEWPB from '@salesforce/label/c.YP_NewPriceBook';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
import getRecordTypes from '@salesforce/apex/YP_PriceBookManagerController.getPBRecordTypes';

export default class YP_NewPriceBookModal extends LightningModal {
    labels = {
        NEWPB,
        CANCELBUTTON,
        NEXTBTN
    };
    object = PB_OBJECT;
    myFields = [NAME_FIELD, START_FIELD, END_FIELD];
    @wire (MessageContext)
    messageContext;
    @track value;
    @track typeSelected = false;
    recordTypes;
    @track options;

   
    connectedCallback(){
        getRecordTypes().then(result => {
            this.options = [];
            this.recordTypes = result;
            for(let i = 0; i < this.recordTypes.length; i++){
                this.options.push({ label: this.recordTypes[i].Name, value: this.recordTypes[i].Id });
            }
            if(this.options.length > 0){
                this.value = this.options[0].value;
            }
        }) 
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.RecordTypeId = this.value;

        this.template.querySelector('lightning-record-form').submit(fields);
       
    }

    handleSuccess(){
        publish(this.messageContext, NPBMC);
        this.close({result: 'created'});
    }

    handleChange(event){
        this.value = event.detail.value;
    }

    selectType(event){
        this.typeSelected = true;
    }
}