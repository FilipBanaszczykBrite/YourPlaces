public with sharing class YP_PriceBookActivityBatch implements Database.Batchable<SObject>, Database.Stateful{

    private final String query = 'SELECT Id, Name, IsStandard, IsActive, StartDate__c, EndDate__c, Target_Product__c FROM Pricebook2 WHERE IsActive = true AND IsStandard = false';

    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator(query);
    }


    public void execute(Database.BatchableContext context, List<Pricebook2> pricebooks) {
        Date now = date.today();
        for(Pricebook2 pb : pricebooks){
            if(pb.EndDate__c < now || pb.StartDate__c > now){
                pb.IsActive = false;
            }
            if(pb.StartDate__c < now && pb.EndDate__c > now){
                pb.IsActive = true;
            }
        }
    }


    public void finish(Database.BatchableContext param1) {
        
    }


}