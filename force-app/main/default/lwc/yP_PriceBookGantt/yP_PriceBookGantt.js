import { LightningElement, wire } from 'lwc';
import {  loadScript, loadStyle } from 'lightning/platformResourceLoader';
import getPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.getCustomPriceBooks';
import D3 from '@salesforce/resourceUrl/d3';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';

export default class YP_PriceBookGantt extends LightningElement {

    svgWidth = 800;
    svgHeight;
    priceBooks;
    apartaments = [];
    b2b = [];
    d3Initialized = false;
    @wire(MessageContext)
    messageContext;
    subscription = null;
    renderedCallback(){
        this.subscribeMC();
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;
        
        Promise.all([
            
            loadScript(this, D3 + '/d3.v5.min.js'),
            loadStyle(this, D3 + '/style.css'),
           
        ])
            .then(() => {
      
                this.getAllPB();
               
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading D3',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    clearChart() {
        var svg = d3.select(this.template.querySelector('svg.b2b'));
        svg.selectAll("*").remove();
        svg = d3.select(this.template.querySelector('svg.b2c'));
        svg.selectAll("*").remove();
    }

    subscribeMC() {
        
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            NPBMC,
            () => { 
                console.log('got edit message')
                this.clearChart();
                this.getAllPB();
            
             },
            { scope: APPLICATION_SCOPE }
        );
    }

    compare( a, b ) {
        if ( a.StartDate__c < b.StartDate__c ){
          return -1;
        }
        if ( a.StartDate__c > b.StartDate__c ){
          return 1;
        }
        return 0;
      }
      
      

    getAllPB(){
        console.log('get pbs')
        this.apartaments = [];
        this.b2b = [];
        getPriceBooks().then(result =>{
            result.sort( this.compare );
            this.priceBooks = result;
            for(let i = 0; i < this.priceBooks.length; i++){
                //console.log(JSON.stringify(this.priceBooks[i]));
                this.priceBooks[i].StartDate__c = Date.parse(this.priceBooks[i].StartDate__c);
                this.priceBooks[i].EndDate__c = Date.parse(this.priceBooks[i].EndDate__c);
                this.priceBooks[i].GanttStartDate = this.priceBooks[0].StartDate__c;
                //console.log(this.priceBooks[i].RecordType.Name)
                if(this.priceBooks[i].RecordType.Name == 'Apartaments'){
                    this.apartaments.push(this.priceBooks[i]);
                }
                else if(this.priceBooks[i].RecordType.Name == 'Business premises'){
                    this.b2b.push(this.priceBooks[i]);
                }
                
            }
            this.apartaments.sort(this.compare);
            this.b2b.sort(this.compare);
            for(let i = 0; i < this.apartaments.length; i++){
                this.apartaments[i].GanttStartDate = this.apartaments[0].StartDate__c - 20000000;                   
            }
            for(let i = 0; i < this.b2b.length; i++){
                this.b2b[i].GanttStartDate = this.b2b[0].StartDate__c - 20000000;                   
            }
            //console.log(this.apartaments.length, this.b2b.length)
            
            
            this.isLoading = false;
            //this.test();
            if(this.apartaments.length > 0){
                this.svgHeight = this.apartaments.length * 70 + 50;
                this.drawGantt(this.apartaments, 'b2c');
            }
            console.log('height ' + this.svgHeight)
            if(this.b2b.length > 0){
                this.svgHeight = this.b2b.length * 70 + 50;
                this.drawGantt(this.b2b, 'b2b');
            }
            //console.log('height ' + this.svgHeight)
        }).catch(() => {
            this.isLoading = false;
        })
    }

    getTicks(data){
        const dates = [];
        for(let i = 0;i < data.length ; i++){
            dates.push(data[i].StartDate__c - 20000000);
            dates.push(data[i].EndDate__c - 20000000);
        }
        console.log('dates ' + dates);
        return dates;
    }


    drawGantt(products, tag){
        console.log('height gantt' + this.svgHeight)
        let svg = d3.select(this.template.querySelector('svg.' + tag));
        
        const render = data => {
            const margin = { top: 50, right: 40, bottom: 77, left: 150 };
            this.svgHeight = data.length * 30 + margin.top + margin.bottom;
            const innerWidth = this.svgWidth - margin.left - margin.right;
            const innerHeight = this.svgHeight - margin.top - margin.bottom;

            
            var timeScale = d3.scaleTime()
                .domain([d3.min(data, function(d) {return d.GanttStartDate;}) ,
                d3.max(data, function(d) {return d.EndDate__c;})])
                .range([0, innerWidth]);
            const xAxis = d3.axisTop(timeScale)
            //.tickValues(this.getTicks(data));
            const yScale = d3.scaleBand()
            .domain(data.map(d => d.Name))
            .range([0, innerHeight])
            .padding(0.3);
            //console.log(JSON.stringify(timeScale.domain()))

            const yAxis = d3.axisLeft(yScale);
            const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
            yAxis(g.append('g')
            .style('font-size', "13px"));
            g.append('g')
            .style('font-size', "13px")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(35)");


            g.selectAll('rect').data(products)
            .enter()
            .append('rect')
            .attr('y', d=> yScale(d.Name))
            .attr('x', d => {
             
                const diffTime = Math.abs(d.StartDate__c);
                //console.log(JSON.stringify(d))
                //console.log(timeScale(diffTime));
                return timeScale(diffTime)})
            .attr('width', d => {
             
                const diffTime = Math.abs(d.EndDate__c - d.StartDate__c + d.GanttStartDate);
              
                return timeScale(diffTime)})
            .attr('height', yScale.bandwidth())
            .attr('rx', 7)
            .style('fill', d => { 
                //console.log(d.RecordType.Name)
                return (d.RecordType.Name == 'Apartaments' ? '#4682b4' : '#105084')});
     

        };

        render(products);
    
    }
}