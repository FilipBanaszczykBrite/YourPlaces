public with sharing class YP_ExchangeRateUpdater implements Schedulable{

    private static final String endpoint = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
    private Map<String, Double> rates;

    private void getCurrencyRatios(){
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setTimeout(60000);
        req.setMethod('GET');
        HttpResponse res = h.send(req);
        String body = res.getBody();
        this.rates = AE_CurrencyXMLParser.parseXMLToMap(body);
        updateRates();
    }

    private void updateRates(){
        List<CurrencyType> oldRates = [SELECT IsoCode, Id FROM CurrencyType WHERE IsoCode IN: this.rates.keySet()];
        for(String isoCode : this.rates.keySet()){
            String rateId;
            for(CurrencyType rate : oldRates){
                if(isoCode == rate.IsoCode){
                    rateId = rate.Id;
                }
            }
            Http h = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndpoint(URL.getSalesforceBaseUrl().toExternalForm() + '/services/data/v51.0/sobjects/CurrencyType/' + rateId + '?_HttpMethod=PATCH');
            req.setBody('{ "ConversionRate" : ' + string.ValueOf(rates.get(isoCode)) + '}');
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