import LightningModal from 'lightning/modal';
import { track, api } from 'lwc';
import createReservation from '@salesforce/apex/YP_BusinessPremisesController.createReservation';
import getReservations from '@salesforce/apex/YP_BusinessPremisesController.getReservations';
import getAgentInfo from '@salesforce/apex/YP_BusinessPremisesController.getAgentInfo';
import hasAgent from '@salesforce/apex/YP_BusinessPremisesController.hasAgent';
import Id from '@salesforce/user/Id';

export default class YP_AgentReservationModal extends LightningModal {

    userId = Id;
    startHour = 9;
    endHour = 15;
    @api productId;
    @track daySlots;
    @track days = [
        'MON',
        'TUE',
        'WEN',
        'THU',
        'FRI'
    ]
    @track isSelected = true;
    @track selectedDate;
    dateRange;
    @track dateRangeLabels;
    dateRangeIndex = 0;
    @track firstDateRange = true;
    @track selectedDateLabel;
    @track selectedTimeLabel;
    @track agentInfo;
    @track agentContact;
    reservations;
    @track isLoading;

    connectedCallback(){
        this.isLoading = true;
        let start = new Date();
        let end = new Date();
        start.setDate(start.getDate() - start.getDay() + 1 + (start.getDay() == 5 ? 7 : 0));
        end.setDate(end.getDate() + (5 - end.getDay()) + (end.getDay() == 5 ? 7 : 0))
        this.dateRange = {
            start: start,
            end: end
        }
        this.dateRangeLabels = {
            start: this.dateRange.start.toString().slice(4, 15),
            end: this.dateRange.end.toString().slice(4, 15),
        }
        hasAgent({recordId: this.productId}).then(agentAssigned => {
            if(agentAssigned){
                getAgentInfo({recordId: this.productId}).then(result => {
                    this.agentInfo = result;
                    getReservations({recordId: this.agentInfo.Id}).then(result => {
                        
                        this.reservations = [];
                        for(let i = 0; i < result.length; i++){
                            let date = new Date(result[i].StartDateTime)
                            this.reservations.push({
                                'year': date.getYear(),
                                'month': date.getMonth(),
                                'day': date.getDay(),
                                'date': date.getDate(),
                                'hour': date.getUTCHours(),
                                'minute': date.getMinutes()
                            });
                        }
                        this.fillSlots();  
                        this.isLoading = false;
                    });
                })
            }
        }) 
    }

    fillSlots(){
        this.daySlots = [];
        for(let j = 0; j < this.days.length; j++){
            let timeSlots = [];
            let s = new Date(this.dateRange.start);
            s.setDate(s.getDate() + j)
            for(let i = this.startHour; i < this.endHour; i++){
                timeSlots.push({value : i.toString() + ':00',
                                range: i.toString() + ':00 - ' + i.toString() + ':30',
                                class: this.getSlotClass(s, j, i, 0)});
                timeSlots.push({value: i.toString() + ':30',
                                range: i.toString() + ':30 - ' + (i + 1).toString() + ':00',
                                class: this.getSlotClass(s, j, i, 30)});
            }
            this.daySlots.push(timeSlots);
        }
    }

    getSlotClass(date, day, hour, minute){
        let dateTime = {
            'year': date.getYear(),
            'month': date.getMonth(),
            'day': day + 1,
            'date': date.getDate(),
            'hour': hour,
            'minute': minute
        }
        let now = new Date();
        if(date <= now){
            return 'slot unavailable'
        }
        if (this.reservations.find(e => 
            e.year == dateTime.year &&
            e.month == dateTime.month &&
            e.day == dateTime.day &&
            e.date == dateTime.date &&
            e.hour == dateTime.hour &&
            e.minute == dateTime.minute )) {
            return 'slot unavailable'
        }
        else{
            return 'slot available'
        }
    }

    selectTime(event){
        this.selectedDate = new Date(this.dateRange.start);
        this.selectedDate.setDate(this.selectedDate.getDate() + this.selectedDate.getDay());
        let time = event.target.dataset.time.split(':');
        let hour = time[0];
        let minutes = time[1].slice(0, 2);
        let day = Number(event.target.dataset.day) + 1;
        let timeIndex = 2 * (Number(hour) - this.startHour) + (minutes == 0 ? 0 : 1);
        if(this.daySlots[day - 1][timeIndex].class == 'slot available' || this.daySlots[day - 1][timeIndex].class == 'selected'){
            for(let i = 0; i < this.daySlots.length; i++){
                for(let j = 0; j< this.daySlots[i].length; j++){
                    if(this.daySlots[i][j].class == 'selected'){
                        this.daySlots[i][j].class = 'slot available';
                    }
                }
            }
            this.daySlots[day - 1][timeIndex].class = 'selected';
            this.selectedDate.setDate(this.selectedDate.getDate() + (day - this.selectedDate.getDay()));
            this.selectedDate.setHours(Number(hour), Number(minutes), 0);
            this.selectedDateLabel = this.selectedDate.toString().slice(0, 15);
            this.selectedTimeLabel = this.daySlots[day - 1][timeIndex].range;
            
            this.isSelected = false;
        }
    }

    confirmReservation(){
        createReservation({reservationDate: this.selectedDate, userId: this.userId, ownerId: this.agentInfo.Id, productId: this.productId}).then(result =>{
            if(result.Id == null){
                this.close({isSuccess: false, selectedDate: this.selectedDateLabel, selectedTime: this.selectedTimeLabel});
            }
            else{
                this.close({isSuccess: true, selectedDate: this.selectedDateLabel, selectedTime: this.selectedTimeLabel});
            }
            
        });
        
        
    }

    nextRange(){
        this.dateRangeIndex += 1;
        this.firstDateRange =  (this.dateRangeIndex == 0)
        this.dateRange.start.setDate(this.dateRange.start.getDate() + 7)
        this.dateRange.end.setDate(this.dateRange.end.getDate() + 7)
        this.dateRangeLabels = {
            start: this.dateRange.start.toString().slice(4, 15),
            end: this.dateRange.end.toString().slice(4, 15),
        }
        for(let i = 0; i < this.daySlots.length; i++){
            for(let j = 0; j< this.daySlots[i].length; j++){
                if(this.daySlots[i][j].class == 'selected'){
                    this.daySlots[i][j].class = 'slot available';
                }
            }
        }
        this.fillSlots();
        this.isSelected = true;
    }

    prevRange(){
        this.dateRangeIndex -= 1;
        this.firstDateRange =  (this.dateRangeIndex == 0)
        this.dateRange.start.setDate(this.dateRange.start.getDate() - 7)
        this.dateRange.end.setDate(this.dateRange.end.getDate() - 7)
        this.dateRangeLabels = {
            start: this.dateRange.start.toString().slice(4, 15),
            end: this.dateRange.end.toString().slice(4, 15),
        }
        for(let i = 0; i < this.daySlots.length; i++){
            for(let j = 0; j< this.daySlots[i].length; j++){
                if(this.daySlots[i][j].class == 'selected'){
                    this.daySlots[i][j].class = 'slot available';
                }
            }
        }
        this.fillSlots();
        this.isSelected = true;
    }
}