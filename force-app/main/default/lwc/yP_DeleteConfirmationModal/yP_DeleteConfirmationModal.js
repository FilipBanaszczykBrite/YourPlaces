import LightningModal from 'lightning/modal';
import { api } from 'lwc';
export default class YP_DeleteConfirmationModal extends LightningModal {
    @api title;

    confirmClick(){
        this.close('deleted');
    }
}