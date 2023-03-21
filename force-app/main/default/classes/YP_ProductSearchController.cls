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
    public static List<Product2> getApartments(String name, Double areaMin, Double areaMax, Integer floors, Integer bedrooms, Integer bathrooms, Boolean attic, Boolean basement){
        String baseQuery = 'SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c, Bedrooms__c, Bathrooms__c, Attic__c, Basement__c FROM Product2 WHERE RecordType.Name = \'Apartments\' ';
        if(name != null){
            baseQuery += 'AND Name LIKE \'' + String.escapeSingleQuotes(name) + '%\'';
        }
        if(areaMin != null){
            baseQuery += 'AND Area__c >= ' + areaMin;
        }
        if(areaMax != null){
            baseQuery += 'AND Area__c <= ' + areaMax;
        }
        if(floors != null){
            baseQuery += 'AND Floors__c = ' + floors;
        }
        if(bedrooms != null){
            baseQuery += 'AND Bedrooms__c >= ' + bedrooms;
        }
        if(bathrooms != null){
            baseQuery += 'AND Bathrooms__c >= ' + bathrooms;
        }
        if(attic != null){
            baseQuery += 'AND Attic__c = ' + attic;
        }
        if(basement != null){
            baseQuery += 'AND Basement__c = ' + basement;
        }
        try {
            List<Product2> products = Database.query(baseQuery);

            return products;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<Product2> getAllApartments(){
        try {
            List<Product2> products = [SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c, Bedrooms__c, Bathrooms__c, Attic__c, Basement__c FROM Product2 WHERE RecordType.Name = 'Apartments'];

            return products;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}