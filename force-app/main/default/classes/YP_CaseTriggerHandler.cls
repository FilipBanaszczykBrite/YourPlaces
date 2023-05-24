public with sharing class YP_CaseTriggerHandler {
    private YP_CaseEntitlementService eService;
    private YP_CaseAssignmentService aService;
    public YP_CaseTriggerHandler(){

    }

    public void beforeInsert(List<SObject> newRecords) {
        eService = new YP_CaseEntitlementService(newRecords);
        eService.assign();
    }

    
    public void beforeUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<Id, SObject> oldRecordMap, Map<Id, SObject> newRecordMap) {
        
    } 

    
    public void beforeDelete(List<SObject> oldRecords, Map<Id, SObject> oldRecordMap) {
        
    }

    
    public void afterInsert(List<SObject> newRecords) {
        aService = new YP_CaseAssignmentService(newRecords);
        aService.assign();
    }

    
    public void afterUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<Id, SObject> oldRecordMap, Map<Id, SObject> newRecordMap) {
        
    }

    
    public void afterDelete(List<SObject> oldRecords, Map<Id, SObject> oldRecordMap) {
        
    }

    
    public void afterUndelete(List<SObject> newRecords, Map<Id, SObject> newRecordMap) {
        
    }
}