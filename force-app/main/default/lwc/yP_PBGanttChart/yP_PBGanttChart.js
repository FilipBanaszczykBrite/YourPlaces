import { LightningElement} from 'lwc';
import {  loadScript, loadStyle } from 'lightning/platformResourceLoader';
import getPriceBooks from '@salesforce/apex/YP_PriceBookManagerController.getPriceBooks';

export default class YP_PBGanttChart extends LightningElement {
    
    static renderMode = 'light'; // the default is 'shadow'
    svgWidth = 400;
    svgHeight = 400;
    priceBooks;
    d3Initialized = false;

    getAllPB(){
        getPriceBooks().then(result =>{
          
            this.priceBooks = result;
            console.log(result);
            this.isLoading = false;
            this.drawGantt()
            console.log('przed')
            d3.timeline();
            console.log('po')
        }).catch(() => {
            this.isLoading = false;
        })
    }

    draw(){
        var testData = [
            {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var rectAndCircleTestData = [
            {times: [{"starting_time": 1355752800000,
                        "display": "circle"}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000,
            "display":"circle"}, ]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var labelTestData = [
            {label: "person a", times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {label: "person b", times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {label: "person c", times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var iconTestData = [
            {class:"jackie", icon: "jackie.png", times: [
                {"starting_time": 1355752800000, "ending_time": 1355759900000}, 
                {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {class:"troll", icon: "troll.png", times: [
                {"starting_time": 1355759910000, "ending_time": 1355761900000,
                "display":"circle"}, ]},
            {class:"wat", icon: "wat.png", times: [
                {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var labelColorTestData = [
            {label: "person a", times: [{"color":"green", "label":"Weeee", "starting_time": 1355752800000, "ending_time": 1355759900000}, {"color":"blue", "label":"Weeee", "starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {label: "person b", times: [{"color":"pink", "label":"Weeee", "starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {label: "person c", times: [{"color":"yellow", "label":"Weeee", "starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var testDataWithColor = [
            {label: "fruit 1", fruit: "orange", times: [
                {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
            {label: "fruit 2", fruit: "apple", times: [
                {"starting_time": 1355752800000, "ending_time": 1355759900000},
                {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {label: "fruit3", fruit: "lemon", times: [
                {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var testDataWithColorPerTime = [
            {label: "fruit 2", fruit: "apple", times: [
                {fruit: "orange", "starting_time": 1355752800000, "ending_time": 1355759900000},
                {"starting_time": 1355767900000, "ending_time": 1355774400000},
                {fruit: "lemon", "starting_time": 1355774400000, "ending_time": 1355775500000}]}
            ];

            var testDataRelative = [
            {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
            ];

            var width = 500;
            function timelineRect() {
            var chart = d3.timeline();

            var svg = d3.select("#timeline1").append("svg").attr("width", width)
                .datum(testData).call(chart);
            }
            
            function timelineRectNoAxis() {
            var chart = d3.timeline().showTimeAxis();

            var svg = d3.select("#timeline1_noaxis").append("svg").attr("width", width)
                .datum(testData).call(chart);
            }

            function timelineCircle() {
            var chart = d3.timeline()
                .tickFormat( //
                {format: d3.time.format("%I %p"),
                tickTime: d3.time.hours,
                tickInterval: 1,
                tickSize: 30})
                .display("circle"); // toggle between rectangles and circles

            var svg = d3.select("#timeline2").append("svg").attr("width", width)
                .datum(testData).call(chart);
            }

            function timelineRectAndCircle() {
            var chart = d3.timeline();

            var svg = d3.select("#timeline2_combine").append("svg").attr("width", width)
                .datum(rectAndCircleTestData).call(chart);
            }

            function timelineHover() {
            var chart = d3.timeline()
                .width(width*4)
                .stack()
                .margin({left:70, right:30, top:0, bottom:0})
                .hover(function (d, i, datum) {
                // d is the current rendering object
                // i is the index during d3 rendering
                // datum is the id object
                var div = $('#hoverRes');
                var colors = chart.colors();
                div.find('.coloredDiv').css('background-color', colors(i))
                div.find('#name').text(datum.label);
                })
                .click(function (d, i, datum) {
                alert(datum.label);
                })
                .scroll(function (x, scale) {
                $("#scrolled_date").text(scale.invert(x) + " to " + scale.invert(x+width));
                });

            var svg = d3.select("#timeline3").append("svg").attr("width", width)
                .datum(labelTestData).call(chart);
            }

            function timelineStackedIcons() {
            var chart = d3.timeline()
                .beginning(1355752800000) // we can optionally add beginning and ending times to speed up rendering a little
                .ending(1355774400000)
                .showTimeAxisTick() // toggles tick marks
                .stack() // toggles graph stacking
                .margin({left:70, right:30, top:0, bottom:0})
                ;
            var svg = d3.select("#timeline5").append("svg").attr("width", width)
                .datum(iconTestData).call(chart);
            }

            function timelineLabelColor() {
            var chart = d3.timeline()
                .beginning(1355752800000) // we can optionally add beginning and ending times to speed up rendering a little
                .ending(1355774400000)
                .stack() // toggles graph stacking
                .margin({left:70, right:30, top:0, bottom:0})
                ;
            var svg = d3.select("#timeline6").append("svg").attr("width", width)
                .datum(labelColorTestData).call(chart);
            }

            function timelineRotatedTicks() {
                var chart = d3.timeline()
                    .rotateTicks(45);

                var svg = d3.select("#timeline7").append("svg").attr("width", width)
                    .datum(testData).call(chart);
            }

            function timelineRectColors() {

            var colorScale = d3.scale.ordinal().range(['#6b0000','#ef9b0f','#ffee00'])
                .domain(['apple','orange','lemon']);

            var chart = d3.timeline()
                .colors( colorScale )
                .colorProperty('fruit');

            var svg = d3.select("#timelineColors").append("svg").attr("width", width)
                .datum(testDataWithColor).call(chart);
            }

            function timelineRectColorsPerTime() {
            var colorScale = d3.scale.ordinal().range(['#6b0000','#ef9b0f','#ffee00'])
                .domain(['apple','orange','lemon']);
            var chart = d3.timeline()
                .colors( colorScale )
                .colorProperty('fruit');      
            var svg = d3.select("#timelineColorsPerTime").append("svg").attr("width", width)
                .datum(testDataWithColorPerTime).call(chart);  
            }

            function timelineRelativeTime() {
            //This solution is for relative time is from
            //http://stackoverflow.com/questions/11286872/how-do-i-make-a-custom-axis-formatter-for-hours-minutes-in-d3-js
            var chart = d3.timeline()
                .relativeTime()
                .tickFormat({
                format: function(d) { return d3.time.format("%H:%M")(d) },
                tickTime: d3.time.minutes,
                tickInterval: 30,
                tickSize: 15,
                });

            var svg = d3.select("#timelineRelativeTime").append("svg").attr("width", width)
                .datum(testDataRelative).call(chart);
                console.log(testDataRelative);
            }

            function timelineAxisTop() {
            var chart = d3.timeline().showAxisTop().stack();

            var svg = d3.select("#timelineAxisTop").append("svg").attr("width", width)
                .datum(testData).call(chart);
            }

            function timelineBgndTick() {
            var chart = d3.timeline().stack().showTimeAxisTick().background('grey');

            var svg = d3.select("#timelineBgndTick").append("svg").attr("width", width)
                .datum(testData).call(chart);
            }

            function timelineBgnd() {
            var chart = d3.timeline().stack().background('grey');

            var svg = d3.select("#timelineBgnd").append("svg").attr("width", width)
                .datum(testData).call(chart);
            }

        function timelineComplex() {
            var chart = d3.timeline();
            chart.stack();
            chart.showTimeAxisTick();
    //     chart.showAxisTop();
    //     chart.showToday();
    //     chart.itemHeight(50);
            chart.margin({left: 250, right: 0, top: 20, bottom: 0});
            chart.itemMargin(0);
            chart.labelMargin(25);

            var backgroundColor = "#FCFCFD";
            var altBackgroundColor = "red";
            chart.background(function (datum, i) {
            var odd = (i % 2) === 0;
            return odd ? altBackgroundColor : backgroundColor;
            });
            chart.fullLengthBackgrounds();
            var svg = d3.select("#timelineComplex").append("svg").attr("width", width)
                .datum(labelTestData).call(chart);
            }

            timelineRect();
            timelineRectNoAxis();
            timelineCircle();
            timelineRectAndCircle();
            timelineHover();
            timelineStackedIcons();
            timelineLabelColor();
            timelineRotatedTicks();
            timelineRectColors();
            timelineRectColorsPerTime();
            timelineRelativeTime();
            timelineAxisTop();
            timelineBgndTick();
            timelineBgnd();
            timelineComplex();
    }


    renderedCallback(){
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;
        
        Promise.all([
            
            loadScript(this, D3 + '/d3.v3.min.js'),
            loadScript(this, D3 + '/d3-timeline.js'),
            //loadStyle(this, D3 + '/style.css')
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

    drawGantt(){
        //let svg = d3.select(this.template.querySelector('svg.d3'));
        const width = this.svgWidth;
        const height = this.svgHeight;
        // var timeScale = d3.scaleTime()
        //         .domain([d3.min(this.priceBooks, function(d) {return d.StartDate__c;}),
        //         d3.max(this.priceBooks, function(d) {return d.EndDate__c;})])
        //         .range([0,width-150]);
        // const render = data => {
        //     svg.selectAll('rect').data(data)
        //     .enter().append('rect')
        //     .attr('width', 100)
        //     .attr('height', 30)
        // };
        // render(this.priceBooks);
        // console.log('recnder ', render);
        var chart = d3.timeline().showAxisTop().stack();
        var testData = [
            {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
          ];
        console.log('data', testData)
        console.log('chart', JSON.stringify(chart))
        var svg = d3.select(this.template.querySelector('svg.d3')).append("svg").attr("width", 500)
            .datum(testData);
            console.log('svg', JSON.stringify(svg))
   
        console.log('dziala')
    }

   

    initializeD3() {
        console.log('init');
        let svg = d3.select(this.template.querySelector('svg.d3'));
        const width = this.svgWidth;
        const height = this.svgHeight;
        console.log('min ', d3.min(this.priceBooks, function(d) {return d.StartDate__c;}));
        console.log('max ', d3.max(this.priceBooks, function(d) {return d.EndDate__c;}));
        var timeScale = d3.scaleTime()
                .domain([d3.min(this.priceBooks, function(d) {return d.StartDate__c;}),
                d3.max(this.priceBooks, function(d) {return d.EndDate__c;})])
                .range([0,width-150]);
        console.log('TIME ', JSON.stringify(timeScale));
        var topPadding = 75;
        var sidePadding = 75;   
        svg = d3.selectAll(".svg")
        //.selectAll("svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "svg");
        console.log('svg ' + d3.svg());
        console.log('svg ' + svg);
        var xAxis = d3.axisBottom()
            .scale(timeScale)
            .ticks(d3.timeDays, 1)
            .tickSize(-height+topPadding+20, 0, 0)
            .tickFormat(d3.timeFormat('%d %b'));
        //console.log('x axis ' + xAxis);
        var grid = svg.append('g')
            .attr('class', 'grid')
            .attr('transform', 'translate(' +sidePadding + ', ' + (width - 50) + ')')
            .selectAll("text")  
                    .style("text-anchor", "middle")
                    .attr("fill", "#000")
                    .attr("stroke", "none")
                    .attr("font-size", 10)
                    .attr("dy", "1em");
        console.log('grid ' + grid);

        var bigRects = svg.append("g")
        .selectAll("rect")
        .data(this.priceBooks)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i){
            return i*25 + topPadding - 2;
        })
        .attr("width", function(d){
            return width-sidePadding/2;
        })
        .attr("height", 25)
        .attr("stroke", "none")
        .attr("opacity", 0.2);
        
        console.log('big rects ' + bigRects);

        var rectangles = svg.append('g')
        .selectAll("rect")
        .data(this.priceBooks)
        .enter();
        console.log('rects ' + rectangles);
        var innerRects = rectangles.append("rect")
             .attr("rx", 3)
             .attr("ry", 3)
             .attr("x", function(d){
              return timeScale(d.StartDate__c) + sidePadding;
              })
             .attr("y", function(d, i){
                return i*25 + topPadding;
            })
             .attr("width", function(d){
                return (timeScale(d.EndDate__c)-timeScale(d.StartDate__c));
             })
             .attr("height", 20)
             .attr("stroke", "none")
             
   
        console.log('inner ' + innerRects);
        var rectText = rectangles.append("text")
            .text(function(d){
            return d.Name;
            })
            .attr("x", function(d){
            return (timeScale(d.EndDate__c)-timeScale(d.StartDate__c))/2 + timeScale(d.StartDate__c) + sidePadding;
            })
            .attr("y", function(d, i){
                return i*25 + 14+ topPadding;
            })
            .attr("font-size", 11)
            .attr("text-anchor", "middle")
            .attr("text-height", 20)
            .attr("fill", "#fff");
        console.log('text ' + rectText);
   
    }

    
}