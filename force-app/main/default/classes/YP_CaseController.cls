public with sharing class YP_CaseController {
    
    
    @AuraEnabled
    public static List<Case> getUserCases(String userId){
        try {
            return [SELECT Id, Subject, Description, CreatedDate, ClosedDate, Status FROM Case];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Case getCaseDetails(String caseId){
        try {
            return [SELECT Subject, Description, CreatedDate, ClosedDate, CreatedById, Type, Status FROM Case WHERE Id =: caseId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}