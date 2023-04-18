public with sharing class YP_BusinessPremisesController {
    
    @AuraEnabled
    public static YP_BusinessPremisesWrapper getDetails(String recordId){
        try {
            PriceBook2 pb = [SELECT RecordType.Name, IsActive FROM PriceBook2 WHERE RecordType.Name = 'Business premises' AND IsActive = true LIMIT 1];
            PriceBookEntry entry = [SELECT Product2Id, 	UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: pb.Id AND Product2Id =: recordId LIMIT 1];
            Product2 product = [SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c,
            Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c, Address__c  FROM Product2 WHERE Id =: recordId LIMIT 1];
            YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                product.Name,
                product.DisplayUrl,
                product.Address__c,
                entry.UnitPrice,
                product.Area__c,
                product.Floors__c,
                product.Restrooms__c,
                product.Meeting_Rooms__c,
                product.Utility_Rooms__c );
            return wrapper;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled
    // public static List<String> getImages(String recordId){
    //     try {
    //         List<ContentVersion> versions = [SELECT ]
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

}