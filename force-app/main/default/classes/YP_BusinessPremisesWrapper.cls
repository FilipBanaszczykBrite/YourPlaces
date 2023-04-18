public with sharing class YP_BusinessPremisesWrapper {
    @AuraEnabled
    public String name;

    @AuraEnabled
    public String photoUrl;
    @AuraEnabled
    public String address;
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

    public YP_BusinessPremisesWrapper(String name, String photoUrl, String address, Decimal price, Decimal area, Decimal floors, Decimal restrooms, Decimal meetingRooms, Decimal utilityRooms) {
        this.name = name;
        this.photoUrl = photoUrl;
        this.address = address;
        this.price = price;
        this.area = area;
        this.floors = floors;
        this.restrooms = restrooms;
        this.meetingRooms = meetingRooms;
        this.utilityRooms = utilityRooms;

    }
}