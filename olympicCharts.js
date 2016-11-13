var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom

d3.json("OlympicRecords.json", function(data) {
    
    d3.select(".sport-pane").selectAll("li")
        .data(Object.keys(data)).enter()
        .append("li")
            .text(function(sport) {return sport})
            .on("mouseover", function(event_name) {
                d3.select("body").append("div")
                    .attr("class", "event-pane")
                    .attr("width", "200px")
                    .selectAll("li")
                        .data(Object.keys(data[event_name])).enter()
                        .append("li")
                            .attr("class", "event-list")
                            .text(function(event) {return event})
                console.log("hello")
            })
            .on("mousemove", function() {
                d3.selectAll(".event-pane")
                    .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                    .style("left",(d3.mouse(document.body)[0] + 20) + "px");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".event-pane").remove();
            })
            .append("img")
                .attr("class", "sport-img")
                .attr("src", "https://openclipart.org/image/2400px/svg_to_png/194077/Placeholder.png")
    
    sportEvent = localStorage.getItem("selectedEvent").split(":")
    selectedEvent = data[sportEvent[0]][sportEvent[1]]
    
    selectedEvent.sort(function(a, b) {
        splitNames_a = a.Olympic.split(" ")
        splitNames_b = b.Olympic.split(" ")
        return d3.descending(parseInt(splitNames_a[splitNames_a.length-1]), parseInt(splitNames_b[splitNames_b.length-1]))
    })
    selectedEvent.forEach(function(data){data["record"]=((1/data.record))})
    createChart()
    
})

function createChart() {
    var svg = d3.select("#svg_holder")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width)
        .append("svg")
            .attr("class", "svg")
            .attr("width", width)//width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "circleGroup")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");
    var radius = 15
    //ranges
    max = d3.max(selectedEvent, function(d) {return d.record})
    min = d3.min(selectedEvent, function(d) {return d.record})
    var x = d3.scaleLinear().domain([min, max]).range([0, width]);
    var yLoc = d3.scaleLinear()
        .range([height, 0])
        .domain([d3.min(selectedEvent, function(d) {
                splitNames = d.Olympic.split(" ")
                return parseInt(splitNames[splitNames.length-1])
            }), d3.max(selectedEvent, function(d) { 
                splitNames = d.Olympic.split(" ")
                return parseInt(splitNames[splitNames.length-1])
        })])
        
    // Add the scatterplot
    var circle = svg.selectAll("dot")
        .data(selectedEvent)
        .enter().append("circle")
        .attr("class", "players")
        .attr("val", function(d) {
            if (!d.record){
                return "false"
            }
            return (1/d.record)
        })
        .attr("r", radius)
        .attr("cx", function(d) {
            if (!x(d.record)){
                return width-radius
            }
            return x(d.record)
        })
        .attr("cy", function(d) {
            splitNames = d.Olympic.split(" ")
            return yLoc(parseInt(splitNames[splitNames.length-1]))
        })
    
}