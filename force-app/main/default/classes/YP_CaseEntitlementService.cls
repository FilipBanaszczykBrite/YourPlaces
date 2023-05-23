public without sharing class YP_CaseEntitlementService {

    private static final String entitlementName = 'Sample Entitlement';
    private List<Case> casesToAssign;

    public YP_CaseEntitlementService(List<Case> cases) {
        this.casesToAssign = cases;
    }

    public void assign(){
        Entitlement entitlement = [SELECT Id, Name FROM Entitlement WHERE Name =: entitlementName LIMIT 1];
        if(entitlement != null){
            for(Case c : casesToAssign){
                c.EntitlementId = entitlement.Id;
             }
        }
    }
}