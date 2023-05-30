public with sharing class AE_CurrencyXMLParser {

    public static Map<String, Double> parseXMLToMap(String body){
        Map<String, Double> currencyMap = new Map<String, Double>();
        Dom.Document doc = new Dom.Document();
        doc.load(body);
        currencyMap.put('EUR', 1);
        Dom.XMLNode rootElement = doc.getRootElement();
        for ( Dom.XMLNode childElement : rootElement.getChildElements() ) {
            for (Dom.XMLNode detailElement : childElement.getChildElements()){
                for (Dom.XMLNode detailElement1 : detailElement.getChildElements()){
                    currencyMap.put(detailElement1.getAttributeValue('currency', null),
                           (Double) Decimal.valueOf(detailElement1.getAttributeValue('rate', null)));
                }
            }
        }
        return currencyMap;
    }

    public static String getDateFromXML(String body){
        String result = '';
        Dom.Document doc = new Dom.Document();
        doc.load(body);
        Dom.XMLNode rootElement = doc.getRootElement();
        for ( Dom.XMLNode childElement : rootElement.getChildElements() ) {
            for (Dom.XMLNode detailElement : childElement.getChildElements()){
                if(detailElement.getName() == 'Cube'){
                    result = detailElement.getAttributeValue('time', null);
                }
            }
        }
        return result;
    }
}