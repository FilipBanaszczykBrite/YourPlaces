public with sharing class YP_PriceBookBatchSchedule implements Schedulable{

    public void execute(SchedulableContext param1) {
        YP_PriceBookActivityBatch batch = new YP_PriceBookActivityBatch();
        Database.executeBatch(batch);
    }
}