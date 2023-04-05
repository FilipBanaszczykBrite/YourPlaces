public with sharing class YP_QuoteMailController {

    public String recordId {get; set;}

    public List<QuoteLineItem> quoteProducts = new List<QuoteLineItem>();
    public List<Product2> products = new List<Product2>();
    public List<YP_QuoteMailProductRow> rows = new List<YP_QuoteMailProductRow>();

    public List<QuoteLineItem> getQuoteProducts(){
        quoteProducts = [SELECT Product2Id, QuoteId, Quantity, TotalPrice FROM QuoteLineItem WHERE QuoteId =: recordId];
        return quoteProducts;
    }

    public List<Product2> getProducts(){
        List<ID> productIds = new List<ID>(); 
        for(QuoteLineItem item : quoteProducts){
            productIds.add(item.Product2Id);
        }
        
        products = [SELECT Id, Name,  DisplayUrl FROM Product2 WHERE Id IN :productIds];
        return products;
    }
 
    public List<YP_QuoteMailProductRow> getRows(){
        getQuoteProducts();
        getProducts();
        for(Integer i = 0 ; i < products.size(); i ++){
            rows.add(new YP_QuoteMailProductRow(products[i].Name, quoteProducts[i].TotalPrice, quoteProducts[i].Quantity,
            products[i].DisplayUrl));
            
        }
        return rows;
    }

    @AuraEnabled
    public static List<String> sendMail(String recordId){
        List<String> resultData = new List<String>();
        try {
            Quote quote = [SELECT Id, ContactId, Email FROM Quote WHERE Id =: recordId LIMIT 1];
            List<QuoteDocument> quoteDocuments = [SELECT Name, Document, ContentVersionDocumentId
             FROM QuoteDocument
             WHERE QuoteId = :recordId
             WITH SECURITY_ENFORCED
            ];
            resultData.add(quote.Email);
            EmailTemplate emailTemplate =[SELECT Id, Subject, Description,
                                 HtmlValue,DeveloperName,Body
                                 FROM EmailTemplate
                                 WHERE name = 'Quote with images template'];
            Messaging.SingleEmailMessage email = Messaging.renderStoredEmailTemplate(emailTemplate.Id, quote.ContactId, quote.Id);
            List<Messaging.EmailFileAttachment> attachments = new List<Messaging.EmailFileAttachment>();
            for (QuoteDocument qd: quoteDocuments) {
                Messaging.EmailFileAttachment emailFileAttachment = new Messaging.EmailFileAttachment();
                emailFileAttachment.setFileName(qd.Name);
                resultData.add(qd.Name);
                emailFileAttachment.setBody(qd.Document);
                attachments.add(emailFileAttachment);
            }
            
            email.setFileAttachments(attachments); 
            Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {email};
            //Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return resultData;
    }
}