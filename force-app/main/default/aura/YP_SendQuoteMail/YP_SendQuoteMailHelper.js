({
    showEmailData : function(component, event) {
        var attachments = component.get("v.attachments");
        for(const prop in event.hp){
            if(prop == '0'){
                component.set("v.email", event.hp[prop]);
            }
            else{
                attachments.push(event.hp[prop]);
            }
        }
        component.set("v.attachments", attachments);
        component.set("v.loaded", true);
    }
})
