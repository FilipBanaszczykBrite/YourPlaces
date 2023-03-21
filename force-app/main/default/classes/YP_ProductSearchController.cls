public with sharing class YP_ProductSearchController {
    
    @AuraEnabled
    public static string getUserRole(String userId){
        try {
            return [SELECT userrole.name FROM User WHERE Id =:userId][0].userrole.name;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<Product2> getApartments(){
        try {
            List<Product2> products = [SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c FROM Product2 WHERE RecordType.Name = 'Apartments'];

            return products;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}