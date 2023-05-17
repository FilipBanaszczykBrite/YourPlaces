
({
    itemsChange : function(component, event, helper) {           
            var appEvent = $A.get("e.selfService:caseCreateFieldChange");
            appEvent.setParams({
                "modifiedField": 'Subject',
                "modifiedFieldValue": event.getSource().get("v.value")
            });
    
            appEvent.fire();
        },

    refreshList: function(cmp, event, helper) {

        cmp.find("refreshCasesChannel").publish();
        cmp.set('v.hideForm', true);
    }
    
})
