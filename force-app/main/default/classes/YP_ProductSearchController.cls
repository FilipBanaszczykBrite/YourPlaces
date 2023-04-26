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
            baseQuery += 'AND Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'';
        }
        if(areaMin != null){
            baseQuery += ' AND Area__c >= ' + areaMin;
        }
        if(areaMax != null){
            baseQuery += ' AND Area__c <= ' + areaMax;
        }
        if(floors != null){
            baseQuery += ' AND Floors__c = ' + floors;
        }
        if(bedrooms != null){
            baseQuery += ' AND Bedrooms__c >= ' + bedrooms;
        }
        if(bathrooms != null){
            baseQuery += ' AND Bathrooms__c >= ' + bathrooms;
        }
        if(attic != null){
            baseQuery += ' AND Attic__c = ' + attic;
        }
        if(basement != null){
            baseQuery += ' AND Basement__c = ' + basement;
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

    @AuraEnabled (cacheable=true)
    public static List<Product2> getBusinessPremises(String name, Double areaMin, Double areaMax, Integer floors, Integer meetingRooms, Integer restrooms, Integer utilityRooms){
        System.debug('GET BUSINESS PREMIESES WITH FILTERS');
        String baseQuery = 'SELECT Name, RecordType.Name, DisplayUrl,  ContentDocumentId__c, Area__c, Floors__c, Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c FROM Product2 WHERE RecordType.Name = \'Business Premises\' ';
        if(name != null){
            baseQuery += 'AND Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'';
        }
        if(areaMin != null){
            baseQuery += ' AND Area__c >= ' + areaMin;
        }
        if(areaMax != null){
            baseQuery += ' AND Area__c <= ' + areaMax;
        }
        if(floors != null){
            baseQuery += ' AND Floors__c = ' + floors;
        }
        if(meetingRooms != null){
            baseQuery += ' AND Meeting_Rooms__c >= ' + meetingRooms;
        }
        if(restrooms != null){
            baseQuery += ' AND Restrooms__c >= ' + restrooms;
        }
        if(utilityRooms != null){
            System.System.debug(utilityRooms);
            baseQuery += ' AND Utility_Rooms__c >= ' + utilityRooms;
        }
 
        try {
            List<Product2> products = Database.query(baseQuery);
            System.System.debug(products);
            return products;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<Product2> getAllBusinessPremises(){
        System.debug('get prods ');
        try {
            List<Product2> products = [SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c,
            Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c  FROM Product2 WHERE RecordType.Name = 'Business premises'];
            System.debug('got prods ' + products);
            return products;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<YP_BusinessPremisesWrapper> getAllBusinessPremisesCommunity(){
        try {
            System.debug('get prods');
            PriceBook2 pb = [SELECT RecordType.Name, IsActive FROM PriceBook2 WHERE RecordType.Name = 'Business premises' AND IsActive = true LIMIT 1];
            List<PriceBookEntry> entries = [SELECT Product2Id, 	UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: pb.Id];
            List<String> productIds = new List<String>();
            for(PriceBookEntry entry : entries){
                productIds.add(entry.Product2Id);
            }
            List<Product2> products = [SELECT Id, Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c,
            Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c, Address__c  FROM Product2 WHERE Id IN :productIds];
            List<YP_BusinessPremisesWrapper> wrappers = new List<YP_BusinessPremisesWrapper>();
            for(Integer i = 0; i< products.size(); i++){
                YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                    products[i].Id,
                    products[i].Name,
                    '',
                    products[i].DisplayUrl,
                    products[i].Address__c,
                    entries[i].UnitPrice,
                    products[i].Area__c,
                    products[i].Floors__c,
                    products[i].Restrooms__c,
                    products[i].Meeting_Rooms__c,
                    products[i].Utility_Rooms__c );
                System.debug(wrapper);
                wrappers.add(wrapper);
            }
            System.debug(wrappers);
            return wrappers;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<YP_BusinessPremisesWrapper> getBusinessPremisesCommunity(String name, Double areaMin, Double areaMax, Double priceMin, Double priceMax, Integer floors, Integer meetingRooms, Integer restrooms, Integer utilityRooms){
        String baseQuery = 'SELECT Id, Name, RecordType.Name, DisplayUrl, Area__c, Floors__c, Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c, Address__c FROM Product2 WHERE Id IN: productIds ';
        
        if(name != null){
            baseQuery += 'AND Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'';
        }
        if(areaMin != null){
            baseQuery += ' AND Area__c >= ' + areaMin;
        }
        if(areaMax != null){
            baseQuery += ' AND Area__c <= ' + areaMax;
        }
        
        if(floors != null){
            baseQuery += ' AND Floors__c = ' + floors;
        }
        if(meetingRooms != null){
            baseQuery += ' AND Meeting_Rooms__c >= ' + meetingRooms;
        }
        if(restrooms != null){
            baseQuery += ' AND Restrooms__c >= ' + restrooms;
        }
        if(utilityRooms != null){
            baseQuery += ' AND Utility_Rooms__c >= ' + utilityRooms;
        }
 
        try {
           
            PriceBook2 pb = [SELECT Id, RecordType.Name, IsActive FROM PriceBook2 WHERE RecordType.Name = 'Business premises' AND IsActive = true LIMIT 1];
            String priceQuery = 'SELECT Product2Id, UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id = \'' + pb.Id  + '\' ';
            if(priceMin != null){
                priceQuery += ' AND UnitPrice >= ' + priceMin;
            }
            if(priceMax != null){
                priceQuery += ' AND UnitPrice <= ' + priceMax;
            }
            List<PriceBookEntry> entries = Database.query(priceQuery);
            List<String> productIds = new List<String>();
            for(PriceBookEntry entry : entries){
                productIds.add(entry.Product2Id);
            }
   
            List<Product2> products = Database.query(baseQuery);
            List<YP_BusinessPremisesWrapper> wrappers = new List<YP_BusinessPremisesWrapper>();
            for(Integer i = 0; i< products.size(); i++){
                YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                    products[i].Id,
                    products[i].Name,
                    '',
                    products[i].DisplayUrl,
                    products[i].Address__c,
                    entries[i].UnitPrice,
                    products[i].Area__c,
                    products[i].Floors__c,
                    products[i].Restrooms__c,
                    products[i].Meeting_Rooms__c,
                    products[i].Utility_Rooms__c );
                wrappers.add(wrapper);
                
            }
            return wrappers;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string getCurrency(){
        try {
            ConnectApi.OrganizationSettings  orgSettings = ConnectApi.Organization.getSettings();
            return orgSettings.UserSettings.currencySymbol;
         
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void markProductAsRecentlyViewed(String recordId) {
        Product2 prod = [
            SELECT Id, Name
            FROM Product2
            WHERE Id = :recordId
            FOR VIEW
        ];
    }
}