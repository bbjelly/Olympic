selectedEvent = []
d3.json("OlympicRecords.json", function(data) {
        sports = d3.select("body").append("select")
            .attr("id", "sports")
        sports.selectAll("option")
            .data(Object.keys(data)).enter()
            .append("option")
            .text(function(sport) {return sport})
        sports.append("option")
            .text("-- select a sport --")
            .attr("selected", "selected")
            .attr("disabled", true)
            .style("display", "none")

    //    d3.select("body").append("br")
        d3.select("#sports").on("change", function(){
            d3.select("#events").remove()
            d3.select("#submit").remove()
            sport_name = sports.node().value
            selectedEvent = data[sport_name]
            events = d3.select("body").append("select")
                .attr("id", "events")
            events.selectAll("option")
                .data(Object.keys(data[sport_name])).enter()
                .append("option")
                .text(function(event) {return event})
            events.append("option")
                .text("-- select an event --")
                .attr("selected", "selected")
                .attr("disabled", true)
                .style("display", "none")

            d3.select("#events").on("change", function(){
                submitButton = d3.select("body").append("button")
                                .attr("id", "submit")
                                .text("Submit")

                submitButton.on("click", function() {
                    window.location.href = "display.html"
                })
                event_name = events.node().value
                selectedEvent = selectedEvent[event_name]
                localStorage.clear()
                localStorage.setItem("selectedEvent", sport_name + ":" + event_name)
            })
        })

        d3.select("body").append("br")
    
})
