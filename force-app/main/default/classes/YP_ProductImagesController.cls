public with sharing class YP_ProductImagesController {
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId){
        try {
            return [
		SELECT
		Id,
        Title,
        ContentDocumentId,
        FileType, 
		ContentSize,
		FileExtension,
		VersionNumber,
		CreatedDate,
		VersionData,
        FirstPublishLocationId
		FROM ContentVersion
		WHERE FirstPublishLocationId =:recordId
		ORDER BY CreatedDate DESC
		];
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String getProfilePhoto(String recordId){
        System.debug('get profile');
       
        try {
            String docId = [SELECT Id, DisplayUrl FROM Product2 WHERE Id =:recordId][0].DisplayUrl;
            System.debug('get profile ' + docId);
            return docId;
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void setProfilePhoto(String recordId, String docVerId, String docId){
        Product2 prod = [SELECT Id, DisplayUrl, ContentDocumentId__c FROM Product2 WHERE Id =:recordId][0];
        ContentDistribution cd = new ContentDistribution();
        cd.Name = recordId + ' profile photo';
        cd.ContentVersionId = docVerId;
        cd.PreferencesAllowViewInBrowser= true;
        cd.PreferencesLinkLatestVersion=true;
        cd.PreferencesNotifyOnVisit=false;
        cd.PreferencesPasswordRequired=false;
        cd.PreferencesAllowOriginalDownload= true;
        insert cd;
        cd = [SELECT ContentVersionId, ContentDownloadUrl FROM ContentDistribution WHERE ContentVersionId =: docVerId][0];
        prod.DisplayUrl = cd.ContentDownloadUrl;
        prod.ContentDocumentId__c = docId;
        try{
            update prod;
        }
        catch(Exception e){
            System.debug('rror set profile');
        }
    }

    @AuraEnabled
    public static void deletePhoto(String docId){
        System.debug('delete ' + docId);
        try {
            ContentDocument doc = [
                SELECT
                Id
                FROM ContentDocument
                WHERE Id =: docId
                ][0];
                delete doc;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}