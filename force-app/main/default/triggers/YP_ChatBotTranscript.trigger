trigger YP_ChatBotTranscript on LiveChatTranscript (before insert, before update,  before delete, after insert, after update, after delete, after undelete) {
    YP_ChatTranscriptTriggerHandler triggerHandler = new YP_ChatTranscriptTriggerHandler();
    switch on Trigger.operationType {
        when BEFORE_INSERT {
           
        }
        when BEFORE_UPDATE {

        }
        when BEFORE_DELETE {

        }
        when AFTER_INSERT {
            
        }
        when AFTER_UPDATE {
            triggerHandler.afterUpdate(Trigger.new);
        }
        when AFTER_DELETE {

        }
        when AFTER_UNDELETE {

        }
    }
}