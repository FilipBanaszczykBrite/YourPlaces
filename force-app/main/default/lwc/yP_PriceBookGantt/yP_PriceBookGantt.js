import { LightningElement, wire } from 'lwc';
import {  loadScript, loadStyle } from 'lightning/platformResourceLoader';
import getPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.getCustomPriceBooks';
import D3 from '@salesforce/resourceUrl/d3';
import APART from '@salesforce/label/c.YP_PBApartaments';
import BUSINESS from '@salesforce/label/c.YP_PBBusiness';
import NPBMC from '@salesforce/messageChannel/YP_NewPBMessageChannel__c';
import EPBMC from '@salesforce/messageChannel/YP_EditPBMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext, publish } from 'lightning/messageService';

export default class YP_PriceBookGantt extends LightningElement {
    labels = {
        APART,
        BUSINESS
    }
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
        this.apartaments = [];
        this.b2b = [];
        getPriceBooks().then(result =>{
            result.sort( this.compare );
            this.priceBooks = result;
            for(let i = 0; i < this.priceBooks.length; i++){
                this.priceBooks[i].StartDate__c = Date.parse(this.priceBooks[i].StartDate__c);
                this.priceBooks[i].EndDate__c = Date.parse(this.priceBooks[i].EndDate__c);
                this.priceBooks[i].GanttStartDate = this.priceBooks[0].StartDate__c;
                if(this.priceBooks[i].RecordType.Name == 'Apartments'){
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
            this.isLoading = false;
            if(this.apartaments.length > 0){
                this.svgHeight = this.apartaments.length * 70 + 50;
                this.drawGantt(this.apartaments, 'b2c');
            }
            if(this.b2b.length > 0){
                this.svgHeight = this.b2b.length * 70 + 50;
                this.drawGantt(this.b2b, 'b2b');
            }
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
        return dates;
    }


    drawGantt(products, tag){
        let svg = d3.select(this.template.querySelector('svg.' + tag));
        
        const render = data => {
            const margin = { top: 50, right: 40, bottom: 77, left: 170 };
            this.svgHeight = data.length * 30 + margin.top + margin.bottom;
            const innerWidth = this.svgWidth - margin.left - margin.right;
            const innerHeight = this.svgHeight - margin.top - margin.bottom;

            
            var timeScale = d3.scaleTime()
                .domain([d3.min(data, function(d) {return d.GanttStartDate;}) ,
                d3.max(data, function(d) {return d.EndDate__c;})])
                .range([0, innerWidth]);
            
            var ticks = timeScale.ticks();
     
            const xAxis = d3.axisTop(timeScale)
            
            const yScale = d3.scaleBand()
            .domain(data.map(d => d.Name))
            .range([0, innerHeight])
            .padding(0.3);

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

            var today = new Date();

            g.selectAll('rect').data(products)
            .enter()
            .append('rect')
            .attr('y', d=> yScale(d.Name))
            .attr('x', d => {
                const diffTime = Math.abs(d.StartDate__c);
                return timeScale(diffTime)})
            .attr('width', d => {
                const diffTime = Math.abs(d.EndDate__c - d.StartDate__c + d.GanttStartDate);
                return timeScale(diffTime)})
            .attr('height', yScale.bandwidth())
            .attr('rx', 7)
            .on("click", d => {
                publish(this.messageContext, EPBMC, { record: d });
            })
            .on("mouseover", function(d, i) {
                d3.select(this)
                  .style("fill", d => { 
                    return (d.RecordType.Name == 'Apartaments' ? '#66a2d4' : '#3070a4')});
            })
            .on("mouseout", function() {
                d3.select(this)
                  .style("fill", d => { 
                    return (d.RecordType.Name == 'Apartaments' ? '#4682b4' : '#105084')});
            })
            .style('fill', d => { 
                return (d.RecordType.Name == 'Apartaments' ? '#4682b4' : '#105084')});
                
            g.append("line")
            .attr("x1", timeScale(today))  
            .attr("y1", -10)
            .attr("x2", timeScale(today))  
            .attr("y2", this.svgHeight - margin.top - margin.bottom)
            .style("stroke-width", 2)
            .style("stroke", "#EECC22")
            .style("fill", "none");
        };

        render(products);
    
    }

}