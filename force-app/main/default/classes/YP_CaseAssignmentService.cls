public without sharing class YP_CaseAssignmentService {

    private List<Case> casesToAssign;

    public YP_CaseAssignmentService(List<Case> cases) {
        this.casesToAssign = cases;
    }

    public void assign(){
        AssignmentRule rule = [SELECT Id FROM AssignmentRule WHERE SobjectType = 'Case' AND Active = true LIMIT 1];
        Database.DMLOptions dmlOpts = new Database.DMLOptions();
        Set<Id> setCaseIds = new Set<Id>();
        for(Case eachCase : casesToAssign) {
            setCaseIds.add(eachCase.Id);
        }
        List<Case> newCases = new List<Case>();
        dmlOpts.assignmentRuleHeader.assignmentRuleId= rule.id;
        for(Case newCase : [SELECT Id FROM Case WHERE Id IN: setCaseIds]){
            newCase.setOptions(dmlOpts);
            newCases.add(newCase);
        }
        update newCases;
    }
}