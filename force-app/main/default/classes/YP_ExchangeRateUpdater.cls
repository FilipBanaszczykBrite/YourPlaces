public with sharing class YP_ExchangeRateUpdater implements Schedulable{

    private static Map<String, Double> rates;

    @future(callout=true)
    private static void getCurrencyRatios(){
        String endpoint = YP_CurrencyEndopoint__c.getInstance(UserInfo.getUserId()).endpoint__c;
        System.debug(endpoint);
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setTimeout(60000);
        req.setMethod('GET');
        HttpResponse res = h.send(req);
        String body = res.getBody();
        rates = AE_CurrencyXMLParser.parseXMLToMap(body);
        updateRates();
    }

    private static void updateRates(){
        List<CurrencyType> oldRates = [SELECT IsoCode, Id FROM CurrencyType WHERE IsoCode IN: rates.keySet()];
        for(CurrencyType rate : oldRates){
            Http h = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndpoint(URL.getSalesforceBaseUrl().toExternalForm() + '/services/data/v51.0/sobjects/CurrencyType/' + rate.Id + '?_HttpMethod=PATCH');
            req.setBody('{ "ConversionRate" : ' + string.ValueOf(rates.get(rate.IsoCode)) + '}');
            req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
            req.setHeader('Content-Type', 'application/json');
            req.setMethod('POST');
            HttpResponse res = h.send(req);
            
        }
    }


    public void execute(SchedulableContext param1) {
        getCurrencyRatios();
    }
}