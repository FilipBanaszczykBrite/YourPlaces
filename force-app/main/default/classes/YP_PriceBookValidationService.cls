public with sharing class YP_PriceBookValidationService {
    public List<Pricebook2> newPriceBooks = new List<Pricebook2>();
    public List<Pricebook2> allPriceBooks = new List<Pricebook2>();
    public Set<Id> doctorsIds = new Set<Id>();
    public Boolean validation;

    private List<DJ_PriceBookValidationResponse> responses = new List<YP_PriceBookValidationService.DJ_PriceBookValidationResponse>();
    public YP_PriceBookValidationService(List<Pricebook2> newPriceBooks, Boolean validation){
        this.newPriceBooks = newPriceBooks;
        this.validation = validation;
    }


    public List<DJ_PriceBookValidationResponse> validate(){
        System.debug('validate PBS ' + newPriceBooks);
        getPriceBooks();
        System.debug('old PBS ' + allPriceBooks);
        for(Pricebook2 pb : newPriceBooks){
            validatePriceBooks(pb, getPriceBooksForTarget(pb.RecordTypeId));
            
        }
        return  responses;
    }
    
    private void getPriceBooks(){
        allPriceBooks = [SELECT Id, Name, IsStandard, IsActive, StartDate__c, EndDate__c, RecordTypeId FROM Pricebook2 WHERE IsStandard = false];
    }

    private List<Pricebook2> getPriceBooksForTarget(String target){
        List<Pricebook2> targetPBs = new List<Pricebook2>();
        for(Pricebook2 pb : allPriceBooks){
            if(pb.RecordTypeId == target){
                targetPBs.add(pb);
            }
        }
        System.debug(targetPBs);
        return targetPBs;

    }

    private Boolean validatePriceBooks(Pricebook2 newPB, List<Pricebook2> others){
        for(Pricebook2 pb : others){
            
            if(datesOverlap(newPB, pb) && newPB.Id != pb.Id){
                System.debug('overlap');
                System.debug(newPB);
                System.debug(pb);
                String params = 'Overlapping Price book: ' + pb.Name + ' ' +
                pb.StartDate__c.format() + ' - ' + pb.EndDate__c.format();
                if(validation){
                    newPB.addError('Price book has overlapping dates with ' + params);
                }
                return true;
            }
        }
        return false;
    }

   


    @TestVisible
    private Boolean datesOverlap(Pricebook2 newCon, Pricebook2 con){
        if(newCon.StartDate__c >= con.StartDate__c
                && con.EndDate__c >= newCon.StartDate__c){
            return true;
        }
        if(newCon.StartDate__c <= con.StartDate__c
                && newCon.EndDate__c >= con.StartDate__c){
            return true;
        }
        return false;
    }

    public class DJ_PriceBookValidationResponse{
        public Boolean areOverlapping;
        public Pricebook2 first;
        public Pricebook2 second;

        public DJ_PriceBookValidationResponse(Boolean areOverlapping, Pricebook2 first, Pricebook2 second){
            this.areOverlapping = areOverlapping;
            this.first = first;
            this.second = second;
        }
    }
}