public with sharing class YP_BusinessPremisesWrapper {

    @AuraEnabled
    public String id;
    @AuraEnabled
    public String name;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public String photoUrl;
    @AuraEnabled
    public String address;
    @AuraEnabled
    public String agentId;
    @AuraEnabled
    public Decimal price;
    @AuraEnabled
    public Decimal area;
    @AuraEnabled
    public Decimal floors;
    @AuraEnabled
    public Decimal restrooms;
    @AuraEnabled
    public Decimal meetingRooms;
    @AuraEnabled
    public Decimal utilityRooms;

    public YP_BusinessPremisesWrapper(String id, String name, String description, String photoUrl, String address, String agentId, Decimal price, Decimal area, Decimal floors, Decimal restrooms, Decimal meetingRooms, Decimal utilityRooms) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.photoUrl = photoUrl;
        this.address = address;
        this.agentId = agentId;
        this.price = price;
        this.area = area;
        this.floors = floors;
        this.restrooms = restrooms;
        this.meetingRooms = meetingRooms;
        this.utilityRooms = utilityRooms;

    }

    public static YP_BusinessPremisesWrapper productListToWrapperCommuni(List<Product2> products, Decimal price){
        YP_BusinessPremisesWrapper wrapper = new YP_BusinessPremisesWrapper(
                    products[i].Id,
                    products[i].Name,
                    '',
                    products[i].DisplayUrl,
                    products[i].Address__c,
                    products[i].AgentId__c,
                    entries[i].UnitPrice,
                    products[i].Area__c,
                    products[i].Floors__c,
                    products[i].Restrooms__c,
                    products[i].Meeting_Rooms__c,
                    products[i].Utility_Rooms__c );
    }
}