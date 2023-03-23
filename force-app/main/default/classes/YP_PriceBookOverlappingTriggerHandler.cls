public with sharing class YP_PriceBookOverlappingTriggerHandler implements YP_TriggerHandler {

    private YP_PriceBookValidationService pbValService;

    public void beforeInsert(List<SObject> newRecords) {
        pbValService = new YP_PriceBookValidationService(newRecords, true);
        pbValService.validate();
    }

    
    public void beforeUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<Id, SObject> oldRecordMap, Map<Id, SObject> newRecordMap) {
        pbValService = new YP_PriceBookValidationService(newRecords, true);
        pbValService.validate();
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