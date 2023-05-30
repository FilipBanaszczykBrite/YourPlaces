public with sharing class AE_CurrencyCalculatorController {

    private static final String url = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

    @AuraEnabled
    public static List<String> getCurrencyRatios(){
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setTimeout(60000);
        req.setMethod('GET');
        HttpResponse res = h.send(req);
        String body = res.getBody();
        return new List<String>{JSON.serialize(getMatrixFromMap(AE_CurrencyXMLParser.parseXMLToMap(body))),  AE_CurrencyXMLParser.getDateFromXML(body)};
    }

    private static Map<String, Map<String, Double>> getMatrixFromMap(Map<String, Double> currencyMap){
        Map<String, Map<String, Double>> currencyMatrix = new Map<String, Map<String, Double>>();
        for(String curr : currencyMap.keySet()){
            Map<String, Double> newMap = new Map<String, Double>();
            for(String target : currencyMap.keySet()){
                newMap.put(target, currencyMap.get(target) / currencyMap.get(curr));
            }
            currencyMatrix.put(curr, newMap);
        }
        return currencyMatrix;
    }
}