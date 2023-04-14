({
	doSearch : function(component, event, helper) {
		var start_date = component.find("StartDate").get("v.value");
		var end_date = component.find("EndDate").get("v.value");
		var action = component.get("c.searchEvents");
		action.setParams({
			"start_date": start_date,
			"end_date": end_date
		});
		action.setCallback(this, function(response){
			console.log('response ' + JSON.stringify(response.getReturnValue()));
			component.set("v.events", response.getReturnValue());
		});
		$A.enqueueAction(action);
	}
})