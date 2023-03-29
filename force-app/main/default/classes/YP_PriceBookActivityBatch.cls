public with sharing class YP_PriceBookActivityBatch implements Database.Batchable<SObject>, Database.Stateful{

    private final String query = 'SELECT Id, Name, IsActive, StartDate__c, EndDate__c FROM Pricebook2 WHERE StartDate__c != null AND EndDate__c != null';

    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator(query);
    }


    public void execute(Database.BatchableContext context, List<Pricebook2> pricebooks) {
        Date now = date.today();
        for(Pricebook2 pb : pricebooks){
            System.debug(pb);
            if(pb.EndDate__c != null && pb.StartDate__c != null){
                
            }
            if(pb.EndDate__c < now || pb.StartDate__c > now){
                pb.IsActive = false;
            }
            else if(pb.StartDate__c <= now && pb.EndDate__c >= now){
                pb.IsActive = true;
            }
            
        }
        update pricebooks;
    }


    public void finish(Database.BatchableContext param1) {
        
    }


}