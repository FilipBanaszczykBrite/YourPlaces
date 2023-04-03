public with sharing class YP_QuoteMailProductRow {

    public String name {get; set;}
    public Decimal price {get; set;}
    public Decimal quantity {get; set;}
    public String imageSrc {get; set;}
    
    public YP_QuoteMailProductRow(String name, Decimal price, Decimal quantity, String url) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageSrc = url;
        
    }
}