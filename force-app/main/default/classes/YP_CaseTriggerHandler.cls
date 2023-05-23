public with sharing class YP_CaseTriggerHandler {
    private YP_CaseEntitlementService service;

    public YP_CaseTriggerHandler(){

    }

    public void beforeInsert(List<SObject> newRecords) {
        service = new YP_CaseEntitlementService(newRecords);
        service.assign();
    }

    
    public void beforeUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<Id, SObject> oldRecordMap, Map<Id, SObject> newRecordMap) {
        
    } 

    
    public void beforeDelete(List<SObject> oldRecords, Map<Id, SObject> oldRecordMap) {
        
    }

    
    public void afterInsert(List<SObject> newRecords, Map<Id, SObject> newRecordMap) {
        
    }

    
    public void afterUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<Id, SObject> oldRecordMap, Map<Id, SObject> newRecordMap) {
        
    }

    
    public void afterDelete(List<SObject> oldRecords, Map<Id, SObject> oldRecordMap) {
        
    }

    
    public void afterUndelete(List<SObject> newRecords, Map<Id, SObject> newRecordMap) {
        
    }
}