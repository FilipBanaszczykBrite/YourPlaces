import { LightningElement, track, wire } from 'lwc';
import PB_OBJECT from '@salesforce/schema/Pricebook2';
import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';
import EPBMC from '@salesforce/messageChannel/YP_EditPBMessageChannel__c';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import AddModal from 'c/yP_AddProductsModal';
import { subscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';

export default class YP_PriceBookEdit extends LightningElement {
    objectApiName = PB_OBJECT;
    nameField = NAME_FIELD;
    activeField = ACTIVE_FIELD;
    startField = START_FIELD;
    endField = END_FIELD;
    @track gotRecord = false;
    subscription = null;
    @wire(MessageContext)
    messageContext;
    recordId;

    connectedCallback(){
        this.subscribeMC();
    }

    subscribeMC(){
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            EPBMC,
            (message) => { 
                this.gotRecord = true;
                this.recordId = message.record.Id;
                console.log('got message edit ' + JSON.stringify(message))
            
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    handleSubmit(){
        setTimeout(() => {
            publish(this.messageContext, NPBMC);
          }, "500");
        
    }

    handleAdd(){
        this.openModal();
    }

    async openModal() {
        console.log('open add modal')
        const result = await AddModal.open({
            size: 'medium',
            pbId : this.recordId

        });
        console.log(result);
    }

}