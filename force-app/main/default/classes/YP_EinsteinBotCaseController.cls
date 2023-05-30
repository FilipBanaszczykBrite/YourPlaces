public with sharing class YP_EinsteinBotCaseController {
    public class CaseOutput { 
        @InvocableVariable( required=true ) 
        public String caseId; 
    } 
     
    public class CaseInput { 
     
        @InvocableVariable( required=true ) 
        public String caseSubject; 

        @InvocableVariable( required=true ) 
        public String caseType; 

        @InvocableVariable( required=true ) 
        public String caseDescription; 

        @InvocableVariable( required=true ) 
        public String caseContact; 
         
        @InvocableVariable( required=true ) 
        public Boolean positiveFeedback; 
    } 
 
    @InvocableMethod(label='Submit a Case') 
    public static List <CaseOutput> submitCase( List <CaseInput> listCaseInputs ) { 
        Case nCase = new Case(Subject=listCaseInputs[0].caseSubject, Type=listCaseInputs[0].caseType,
         Description=listCaseInputs[0].caseDescription, ContactId=listCaseInputs[0].caseContact);
        if(listCaseInputs[0].positiveFeedback){
            nCase.Status = 'Closed';
        }
        insert nCase;
        CaseOutput output = new CaseOutput();
        output.caseId = nCase.Id;
        List < CaseOutput > objOutputs = new List < CaseOutput >{output}; 
        return objOutputs; 
     
    } 
}