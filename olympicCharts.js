var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom

d3.json("OlympicRecords.json", function(data) {
    String.prototype.toSeconds = function () { 
        if (!this) {
            return null
        }
        var hms = this.split(':')
        var seconds = 0
        for (var iTime = 0; iTime < hms.length; iTime++) {
            seconds += +hms[iTime] * Math.pow(60, hms.length - iTime - 1)
        }
        return seconds
    }
    var selectedEvent = data["speed-skating"]["1000m-men"] //default
    
    d3.select(".sport-pane").selectAll("li")
        .data(Object.keys(data)).enter()
        .append("li")
            .attr("id", function(sport) {return sport})
            .attr("class", "sport-list")
            .attr("data-toggle", "collapse")
            .attr("data-target", function(sport) {return "#" + sport + "Menu"})
            .text(function(sport) {return sport})
    d3.selectAll(".sport-pane > li").each(function () {
        var sport = this.id
        var newNode = document.createElement('div')
        d3.select(newNode)
            .attr("class", "collapse")
            .attr("id", function() {return sport + "Menu"})
            .selectAll("li")
                .data(function(){
                    return Object.keys(data[sport])
                }).enter()
                .append("li")
                    .attr("class", "event-list")
                    .text(function(event) {return event})
                    .on("click", function(event) {
                        d3.select(".svg").remove()
                        var parentId = this.parentElement.id
                        var locMenu = parentId.lastIndexOf("Menu")
                        var keyId = parentId.substring(0, locMenu)
                        clickedEvent = data[keyId][event]
                        clickedEvent = generateData(clickedEvent)
                        createChart(clickedEvent)
                    })
        this.parentNode.insertBefore(newNode, this.nextSibling);
    })
//    d3.select(".sport-pane").selectAll("div")
//        .data(Object.keys(data)).enter()
//        .insert("div", "#athletics+*")//function(sport) {return "#" + sport + " + *"})
//            .attr("class", "collapse")
//            .attr("id", function(sport) {return sport + "Menu"})
//            .selectAll("li")
//                .data(function(sport){
//                    return Object.keys(data[sport])
//                }).enter()
//                .append("li")
//                    .attr("class", "event-list")
//                    .text(function(event) {return event})
//                    .on("click", function(event) {
//                        d3.select(".svg").remove()
//                        var parentId = this.parentElement.id
//                        var locMenu = parentId.lastIndexOf("Menu")
//                        var keyId = parentId.substring(0, locMenu)
//                        clickedEvent = data[keyId][event]
//                        clickedEvent = generateData(clickedEvent)
//                        createChart(clickedEvent)
//                    })
//            .append("img")
//                .attr("class", "sport-img")
//                .attr("src", "https://openclipart.org/image/2400px/svg_to_png/194077/Placeholder.png")
//    
    generateData(selectedEvent)
    createChart(selectedEvent)
    
})

function createChart(selectedEvent) {
    console.log("CreateChart accessed")
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
                  "translate(" + -margin.right + "," + margin.top + ")")
    var radius = 15
    //ranges
    var max = d3.max(selectedEvent, function(d) {return d.inverseRecord})
    var min = d3.min(selectedEvent, function(d) {return d.inverseRecord})
    var x = d3.scaleLinear().domain([min, max]).range([margin.left, width]);
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
            return d.record
        })
        .attr("r", radius)
        .attr("cx", function(d) {
            if (!x(d.inverseRecord)){
                return width-radius
            }
            return x(d.inverseRecord)
        })
        .attr("cy", function(d) {
            splitNames = d.Olympic.split(" ")
            return yLoc(parseInt(splitNames[splitNames.length-1]))
        })
//    var circle = svg.selectAll("dot")
//        .data(selectedEvent)
//        .enter().append("img")
//        .attr("class", "players")
//        .attr("src", function(d) {
//                return d.pic
//            })
//        .attr("val", function(d) {
//            if (!d.record){
//                return "false"
//            }
//            return d.record
//        })
//        .style("position", "absolute")
//        .style("left", function(d) {
//            if (!x(d.inverseRecord)){
//                return width-radius
//            }
//            return x(d.inverseRecord)
//        })
//        .style("top", function(d) {
//            splitNames = d.Olympic.split(" ")
//            return yLoc(parseInt(splitNames[splitNames.length-1]))
//        })
//        .attr("height", 40)
//        .attr("width", 40)
    
}

function generateData(selectedEvent) {
    selectedEvent.sort(function(a, b) {
        splitNames_a = a.Olympic.split(" ")
        splitNames_b = b.Olympic.split(" ")
        return d3.descending(parseInt(splitNames_a[splitNames_a.length-1]), parseInt(splitNames_b[splitNames_b.length-1]))
    })
    selectedEvent.forEach(function(sportEvent){sportEvent["inverseRecord"]=1/sportEvent.record.toSeconds()})
    return selectedEvent
}
