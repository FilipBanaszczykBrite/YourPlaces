public with sharing class YP_ChatTranscriptEmailSendService {
    private List<LiveChatTranscript> scripts;
    private String orgEmailId;

    public YP_ChatTranscriptEmailSendService(List<LiveChatTranscript> transcripts) {
        this.scripts = transcripts;
        getEmailOrg();
    }

    private void getEmailOrg(){
        this.orgEmailId = [SELECT Id, DisplayName FROM OrgWideEmailAddress WHERE DisplayName = 'YourPlace' LIMIT 1].Id;
    }

    public void send(){
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        Set<String> ids = new Set<String>();
        for(LiveChatTranscript script : this.scripts){
            ids.add(script.Id);
        }
        List<LiveChatTranscript> details = [SELECT Id, Contact.Email, IsChatbotSession, Body, Status FROM LiveChatTranscript
            WHERE Id IN: ids];
        for(LiveChatTranscript script : details){
            if(script.IsChatbotSession && script.Contact.Email != null && script.Status == 'completed'){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setSubject('Conversation with PlaceFinderBot');
                mail.setHtmlBody(script.Body);
                mail.setToAddresses(new List<String>{script.Contact.Email});  
                mail.setOrgWideEmailAddressId(this.orgEmailId);
                mails.add(mail);
            }
        }
        try{
            if(!mails.isEmpty()){
                Messaging.SendEmailResult[] results = Messaging.sendEmail(mails);
            } 
        }
        catch(Exception e){
            
        }

    }
}