public with sharing class YP_QuoteMailProductRow {

    public String name {get; set;}
    public Decimal price {get; set;}
    public Decimal quantity {get; set;}
    public String imageSrc {get; set;}
    
    public YP_QuoteMailProductRow(String name, Decimal price, Decimal quantity, String conVerId, String conDocId) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        // this.imageSrc = '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=' +
        // conVerId +
        // '&operationContext=CHATTER&contentId=' +
        // conDocId;
        this.imageSrc = 'https://yourplaces-dev-ed--c.documentforce.com/sfc/servlet.shepherd/document/download/' + conDocId;
        
    }
}