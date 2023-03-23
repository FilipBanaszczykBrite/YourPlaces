trigger YP_PriceBookOverlappingTrigger on Pricebook2 (before insert, before update,  before delete, after insert, after update, after delete, after undelete) {
    YP_PriceBookOverlappingTriggerHandler triggerHandler = new YP_PriceBookOverlappingTriggerHandler();
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