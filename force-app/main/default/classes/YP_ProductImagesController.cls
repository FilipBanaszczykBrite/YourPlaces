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
    public static ContentVersion getProfilePhoto(String recordId){
        String docId = [SELECT Id, DisplayUrl FROM Product2 WHERE Id =:recordId][0].DisplayUrl;
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
        AND Id =: docId
		][0];
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void setProfilePhoto(String recordId, String docId){
        System.debug(docId);
        Product2 prod = [SELECT Id, DisplayUrl FROM Product2 WHERE Id =:recordId][0];
        prod.DisplayUrl = docId;
        try{
            update prod;
        }
        catch(Exception e){
            System.debug('rror set profile');
        }
    }
}