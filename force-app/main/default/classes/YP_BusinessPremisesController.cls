public without sharing class YP_BusinessPremisesController {
    
    @AuraEnabled
    public static YP_BusinessPremisesWrapper getDetails(String recordId){
        try {
            PriceBook2 pb = [SELECT RecordType.Name, IsActive FROM PriceBook2 WHERE RecordType.Name = 'Business premises' AND IsActive = true LIMIT 1];
            PriceBookEntry entry = [SELECT Product2Id, 	UnitPrice, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: pb.Id AND Product2Id =: recordId LIMIT 1];
            Product2 product = [SELECT Name, RecordType.Name, DisplayUrl, ContentDocumentId__c, Area__c, Floors__c,
            Meeting_Rooms__c, Restrooms__c, Utility_Rooms__c, Address__c, Description  FROM Product2 WHERE Id =: recordId LIMIT 1];
            YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                product.Id,
                product.Name,
                product.Description,
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
    public static void createReservation(DateTime reservationDate){
        try {
            Event reservation = new Event();
            reservation.OwnerId = '005680000038HoWAAU';
            reservation.Subject = 'Business premises demonstration';
            reservation.StartDateTime = reservationDate;
            reservation.EndDateTime = reservationDate.addMinutes(30);
            insert reservation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Event> getReservations(){
        try {
            return [SELECT OwnerId, Subject, StartDateTime, EndDateTime FROM Event 
            WHERE OwnerId = '005680000038HoWAAU' AND Subject = 'Business premises demonstration' AND StartDateTime > LAST_WEEK];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static User getAgentInfo(){
        try {
            return [SELECT Name, ContactId, FullPhotoUrl  FROM User WHERE Id = '005680000038HoWAAU' LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Contact getAgentContact(String contactId){
        try {
            return [SELECT Email, Phone FROM Contact WHERE Id =: contactId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}