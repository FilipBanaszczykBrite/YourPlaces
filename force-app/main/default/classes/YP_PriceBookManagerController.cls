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
    public static List<Pricebook2> getCustomPriceBooks(){
        try {
            return [SELECT Id, Name, IsActive, IsStandard, RecordType.Name, StartDate__c, EndDate__c FROM Pricebook2 WHERE IsStandard = false];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Pricebook2> searchPriceBooks(String search){
        try {
            String query = 'SELECT Id, Name, IsActive, StartDate__c, EndDate__c FROM Pricebook2 WHERE Name LIKE \'%' + String.escapeSingleQuotes(search) + '%\'';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Product2> getProductsForAdd(String pbId){
        try {
            Pricebook2 pb = [SELECT Id, IsStandard, RecordType.Name FROM Pricebook2 WHERE Id =: pbId LIMIT 1];
            Pricebook2 standard = [SELECT Id, IsStandard FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
            List<PricebookEntry> entriesStandard = [SELECT Id, Product2Id, Pricebook2Id FROM PricebookEntry WHERE Pricebook2Id =: standard.Id];
            List<String> standardIds = new List<String>();
            for(PricebookEntry entry : entriesStandard){
               
                standardIds.add(entry.Product2Id);
            }
            if(pb.IsStandard){
                return [SELECT Id, Name FROM Product2 WHERE Id NOT IN :standardIds];
            }
            else{ 
                String type = pb.RecordType.Name;
                List<Product2> prods = [SELECT RecordType.Name FROM Product2 WHERE RecordType.Name =: type AND Id IN :standardIds];
                List<String> prodIds = new List<String>();
                for(Product2 prod : prods){
                    prodIds.add(prod.Id);
                }
                entriesStandard = [SELECT Id, Product2Id, Pricebook2Id FROM PricebookEntry WHERE Product2Id IN : prodIds];
        
                List<PricebookEntry> entriesChosen = [SELECT Id, Product2Id, Pricebook2Id FROM PricebookEntry WHERE Pricebook2Id =: pbId];
                List<String> productIdsStandard = new List<String>();
                for(PricebookEntry entry : entriesStandard){
                    productIdsStandard.add(entry.Product2Id);
                }
                List<String> productIdsChosen = new List<String>();
                for(PricebookEntry entry : entriesChosen){
                    productIdsChosen.add(entry.Product2Id);
                }
                
                List<Product2> products = [SELECT Id, Name FROM Product2 WHERE Id IN :productIdsStandard AND Id NOT IN :productIdsChosen];
                return products;
            }
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<PricebookEntry> getProducts(String pbId){
        try {
            List<PricebookEntry> entries = [SELECT Id, Product2.Name, Pricebook2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: pbId];
            return entries;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void addProductsToPB(List<String> products, String pbId){
        try {
            Pricebook2 pb = [SELECT Id, IsStandard FROM Pricebook2 WHERE Id =: pbId LIMIT 1];
            if(pb.IsStandard){
                List<PricebookEntry> entries = new List<PricebookEntry>();
                for(String id : products){
                    PricebookEntry newEntry = new PricebookEntry(Pricebook2Id=pbId, Product2Id=id, UnitPrice=0);
                    entries.add(newEntry);
                }
                insert entries;
            }
            else{
                List<PricebookEntry> entries = new List<PricebookEntry>();
                List<PricebookEntry> entriesStandard = [SELECT Product2Id, Pricebook2.IsStandard, UnitPrice FROM PricebookEntry WHERE Product2Id IN : products AND Pricebook2.IsStandard = true];
                for(PricebookEntry entry : entriesStandard){
                    PricebookEntry newEntry = new PricebookEntry(Pricebook2Id=pbId, Product2Id=entry.Product2Id, UnitPrice=entry.UnitPrice);
                    entries.add(newEntry);
                }
                insert entries;
            }            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void changePrices(List<String> ids, List<Double> newPrices){
        try {
            List<PricebookEntry> entries = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Id IN :ids];
            Integer idx = 0;
            for(PricebookEntry entry : entries){
                if(newPrices[idx] > 0){
                    entry.UnitPrice = newPrices[idx];
                }
                else{
                    entry.UnitPrice = 0;
                }
                idx++;
            }
            update entries;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteProduct(String id){
        try {
            PricebookEntry entry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Id = :id LIMIT 1];
            delete entry;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<RecordType> getPBRecordTypes(){
        try {
            return [SELECT Id, Name FROM RecordType WHERE sObjectType='Pricebook2'];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}