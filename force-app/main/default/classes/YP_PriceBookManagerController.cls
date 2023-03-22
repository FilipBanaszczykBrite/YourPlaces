public with sharing class YP_PriceBookManagerController {
    
    
    @AuraEnabled
    public static List<Pricebook2> getPriceBooks(){
        try {
            return [SELECT Id, Name, IsActive, StartDate__c, EndDate__c FROM Pricebook2];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Pricebook2> searchPriceBooks(String search){
        try {
            System.debug(search);
            String query = 'SELECT Id, Name, IsActive, StartDate__c, EndDate__c FROM Pricebook2 WHERE Name LIKE \'%' + search + '%\'';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Product2> getProducts(){
        try {
            return [SELECT Id, Name FROM Product2];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void addProductsToPB(List<String> products, String pbId){
        try {
            List<PricebookEntry> entries = new List<PricebookEntry>();
            for(String id : products){
                PricebookEntry entry = new PricebookEntry(Pricebook2Id=pbId, Product2Id=id, UnitPrice=0);
                entries.add(entry);
            }
            insert entries;
            System.debug('entries' + entries);
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}