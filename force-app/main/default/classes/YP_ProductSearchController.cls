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
    public static Decimal getDiscountPrice(String recordId){
        try {
            PriceBook2 pb = [SELECT RecordType.Name, IsActive FROM PriceBook2 WHERE RecordType.Name = 'Business premises' AND IsActive = true LIMIT 1];
            List<PriceBookEntry> entry = [SELECT Product2Id, UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: pb.Id AND Product2Id =: recordId];
            if(entry.isEmpty()){
                return null;
            }
            return entry[0].UnitPrice;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<YP_BusinessPremisesWrapper> getAllBusinessPremisesCommunity(){
        try {
            PriceBook2 pb = [SELECT IsStandard FROM PriceBook2 WHERE IsStandard = true LIMIT 1];
            List<PriceBookEntry> entries = [SELECT Product2Id, Product2.Name, Product2.RecordTypeId, Product2.DisplayUrl, Product2.Area__c, Product2.Floors__c,
                Product2.Meeting_Rooms__c, Product2.Restrooms__c, Product2.Utility_Rooms__c, Product2.Address__c, Product2.AgentId__c,
                UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: pb.Id AND Product2.RecordTypeId = '01268000000ote0AAA'];
            List<YP_BusinessPremisesWrapper> wrappers = new List<YP_BusinessPremisesWrapper>();
            for(Integer i = 0; i< entries.size(); i++){
                YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                    entries[i].Product2.Id,
                    entries[i].Product2.Name,
                    '',
                    entries[i].Product2.DisplayUrl,
                    entries[i].Product2.Address__c,
                    entries[i].Product2.AgentId__c,
                    entries[i].UnitPrice,
                    entries[i].Product2.Area__c,
                    entries[i].Product2.Floors__c,
                    entries[i].Product2.Restrooms__c,
                    entries[i].Product2.Meeting_Rooms__c,
                    entries[i].Product2.Utility_Rooms__c );
                wrappers.add(wrapper);
            }
            return wrappers;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<YP_BusinessPremisesWrapper> getBusinessPremisesCommunity(String name, Double areaMin, Double areaMax, Double priceMin,
     Double priceMax, Integer floors, Integer meetingRooms, Integer restrooms, Integer utilityRooms){
        try {
            PriceBook2 pb = [SELECT IsStandard FROM PriceBook2 WHERE IsStandard = true LIMIT 1];
            String priceQuery = 'SELECT Product2Id, Product2.Name, Product2.DisplayUrl, Product2.Area__c, Product2.Floors__c,'+
            ' Product2.Meeting_Rooms__c, Product2.Restrooms__c, Product2.Utility_Rooms__c, Product2.Address__c, Product2.AgentId__c,'+
            ' UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id = \'' + pb.Id  + '\' AND Product2.RecordTypeId = \'01268000000ote0AAA\'';
            if(priceMin != null){
                priceQuery += ' AND UnitPrice >= ' + priceMin;
            }
            if(priceMax != null){
                priceQuery += ' AND UnitPrice <= ' + priceMax;
            }
            if(name != null){
                priceQuery += 'AND Product2.Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'';
            }
            if(areaMin != null){
                priceQuery += ' AND Product2.Area__c >= ' + areaMin;
            }
            if(areaMax != null){
                priceQuery += ' AND Product2.Area__c <= ' + areaMax;
            }
            
            if(floors != null){
                priceQuery += ' AND Product2.Floors__c = ' + floors;
            }
            if(meetingRooms != null){
                priceQuery += ' AND Product2.Meeting_Rooms__c >= ' + meetingRooms;
            }
            if(restrooms != null){
                priceQuery += ' AND Product2.Restrooms__c >= ' + restrooms;
            }
            if(utilityRooms != null){
                priceQuery += ' AND Product2.Utility_Rooms__c >= ' + utilityRooms;
            }
            List<PriceBookEntry> entries = Database.query(priceQuery);
            List<String> productIds = new List<String>();
    
            List<YP_BusinessPremisesWrapper> wrappers = new List<YP_BusinessPremisesWrapper>();
            for(Integer i = 0; i< entries.size(); i++){
                YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                    entries[i].Product2.Id,
                    entries[i].Product2.Name,
                    '',
                    entries[i].Product2.DisplayUrl,
                    entries[i].Product2.Address__c,
                    entries[i].Product2.AgentId__c,
                    entries[i].UnitPrice,
                    entries[i].Product2.Area__c,
                    entries[i].Product2.Floors__c,
                    entries[i].Product2.Restrooms__c,
                    entries[i].Product2.Meeting_Rooms__c,
                    entries[i].Product2.Utility_Rooms__c );
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

   
}