public without sharing class YP_BusinessPremisesController {
    
    @AuraEnabled
    public static YP_BusinessPremisesWrapper getDetails(String recordId){
        try {
            PriceBook2 pb = [SELECT RecordType.Name, IsActive FROM PriceBook2 WHERE RecordType.Name = 'Business premises' AND IsActive = true LIMIT 1];
            PriceBookEntry entry = [SELECT Product2Id, 	UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: pb.Id AND Product2Id =: recordId LIMIT 1];
            Product2 product = [SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c,
            Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c, Address__c, Description, AgentId__c  FROM Product2 WHERE Id =: recordId LIMIT 1];
            YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                product.Id,
                product.Name,
                product.Description,
                product.DisplayUrl,
                product.Address__c,
                product.AgentId__c,
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

    @AuraEnabled
    public static List<String> getImages(String recordId){
        try {
            List<ContentDistribution> dists = [SELECT ContentDownloadUrl, Name FROM ContentDistribution WHERE Name =: recordId];
            List<String> links = new List<String>();
            for(ContentDistribution dist : dists){
                links.add(dist.ContentDownloadUrl);
            }
            return links;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createReservation(DateTime reservationDate, String userId, String ownerId, String productId){
        try {
            User user = [SELECT ContactId FROM User WHERE Id =: userId];
            Event reservation = new Event();
            reservation.OwnerId = ownerId;
            reservation.WhatId = productId;
            reservation.WhoId = user.ContactId;
            reservation.Subject = 'Business premises demonstration';
            reservation.StartDateTime = reservationDate;
            reservation.EndDateTime = reservationDate.addMinutes(30);
            insert reservation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static boolean hasReservation(String userId, String ownerId){
        try {
            User user = [SELECT ContactId FROM User WHERE Id =: userId];
            System.debug(user);
            System.debug(ownerId);
            return [SELECT OwnerId, Subject, StartDateTime, EndDateTime, WhoId FROM Event 
            WHERE OwnerId =: ownerId AND WhoId =: user.ContactId AND StartDateTime >= TODAY LIMIT 1].size() > 0;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Event> getReservations(String recordId){
        try {
            return [SELECT OwnerId, Subject, StartDateTime, EndDateTime FROM Event 
            WHERE OwnerId =: recordId AND Subject = 'Business premises demonstration' AND StartDateTime > LAST_WEEK];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static boolean hasAgent(String recordId){
        try {
            Product2 prod = [SELECT Id, AgentId__c FROM Product2 WHERE Id =: recordId];
            return [SELECT Id FROM User WHERE Id =: prod.AgentId__c].size() > 0;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static User getAgentInfo(String recordId){
        try {
            Product2 prod = [SELECT Id, AgentId__c FROM Product2 WHERE Id =: recordId];
            return [SELECT Id, FirstName, LastName, Email, Phone, FullPhotoUrl  FROM User WHERE Id =: prod.AgentId__c LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string isLogged(String userId){
        try {
            return [SELECT userrole.name FROM User WHERE Id =:userId][0].userrole.name;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}