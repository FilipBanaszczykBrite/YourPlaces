public with sharing class YP_ChatTranscriptTriggerHandler {
    private YP_ChatTranscriptEmailSendService service;

    public void afterUpdate(List<SObject> newRecords) {
        service = new YP_ChatTranscriptEmailSendService(newRecords);
        service.send();
    }
}