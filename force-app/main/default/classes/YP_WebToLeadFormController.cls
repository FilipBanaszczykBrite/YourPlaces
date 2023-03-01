public with sharing class YP_WebToLeadFormController {

    public static Boolean successValue {get;set;}
     
    public YP_WebToLeadFormController() {
        Boolean successValue = showPage();
    }


    public static Boolean showPage(){
        try{
            return successValue = Boolean.valueOf(ApexPages.currentPage().getParameters().get('success'));
        }catch(Exception e){
            return false;
        }
    }
}