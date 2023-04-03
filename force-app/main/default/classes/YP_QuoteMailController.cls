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
}