public with sharing class GuestUserEventAuraController {
	
    @AuraEnabled
    public static List<Event> searchEvents(Datetime start_date, Datetime end_date){
        List<Event> results = [SELECT Event.Subject,
                                  Event.StartDateTime,
                                  Event.EndDateTime,
                                  Event.Location
                FROM Event ];
        
        List<Event> filtered_events = new List<Event>();
        for (Event event : results) {
            Event new_event = new Event(Subject = event.Subject, 
                                                              StartDateTime = event.StartDateTime, 
                                                              EndDateTime = event.EndDateTime,
                                                              Location = event.Location);
            filtered_events.add(new_event);
        }
        return filtered_events;
    }
}