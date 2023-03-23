trigger DJ_ContractsOverlappingTrigger on Contract__c (before insert, before update,  before delete, after insert, after update, after delete, after undelete) {
    DJ_ContractsValidationTriggerHandler triggerHandler = new DJ_ContractsValidationTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            triggerHandler.beforeInsert(Trigger.new);
        }
        when BEFORE_UPDATE {
            triggerHandler.beforeUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
        }
        when BEFORE_DELETE {

        }
        when AFTER_INSERT {

        }
        when AFTER_UPDATE {

        }
        when AFTER_DELETE {

        }
        when AFTER_UNDELETE {

        }
    }

}