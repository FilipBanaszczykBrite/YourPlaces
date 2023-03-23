import LightningModal from 'lightning/modal';
import { wire } from 'lwc';
import PB_OBJECT from '@salesforce/schema/Pricebook2';
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';
import TARGET_FIELD from '@salesforce/schema/Pricebook2.Target_Product__c';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
export default class YP_NewPriceBookModal extends LightningModal {

    object = PB_OBJECT;
    myFields = [NAME_FIELD, ACTIVE_FIELD, START_FIELD, END_FIELD, TARGET_FIELD];
    @wire (MessageContext)
    messageContext;

    handleAccountCreated(){
        console.log('created')
        publish(this.messageContext, NPBMC);
        this.close({result: 'created'});
    }
}