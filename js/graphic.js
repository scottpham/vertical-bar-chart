var pymChild = null;

var colors = {
    'red1': '#6C2315', 'red2': '#A23520', 'red3': '#D8472B', 'red4': '#E27560', 'red5': '#ECA395', 'red6': '#F5D1CA',
    'orange1': '#714616', 'orange2': '#AA6A21', 'orange3': '#E38D2C', 'orange4': '#EAAA61', 'orange5': '#F1C696', 'orange6': '#F8E2CA',
    'yellow1': '#77631B', 'yellow2': '#B39429', 'yellow3': '#EFC637', 'yellow4': '#F3D469', 'yellow5': '#F7E39B', 'yellow6': '#FBF1CD',
    'teal1': '#0B403F', 'teal2': '#11605E', 'teal3': '#17807E', 'teal4': '#51A09E', 'teal5': '#8BC0BF', 'teal6': '#C5DFDF',
    'blue1': '#28556F', 'blue2': '#3D7FA6', 'blue3': '#51AADE', 'blue4': '#7DBFE6', 'blue5': '#A8D5EF', 'blue6': '#D3EAF7'
};

/*
 * Render the graphic
 */
function render(width) {
    // TODO: draw your graphic
    //clears whatever was in here before
    d3.select("svg").remove();

    var margin = {top: 10, right: 0, bottom: 15, left: 10},
        width0 = parseInt(d3.select('#graphic').style('width'), 10)
        width = width0 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom
        mobileThreshold = 350;

    function sizeBottom (w) {
        if(w < mobileThreshold){
            margin.bottom = 45;
        }
    }

    sizeBottom(width);


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.15);

    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .innerTickSize(0);

    var svg = d3.select("#graphic").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var formatAsDollar = d3.format("$,0.1");

    function barColor(d){
            if(d.states == 'California'){
                return 'darkblue';
        }
            else{
                return 'steelblue';
            }
    }

    d3.csv("state-losses.csv", type, function(error, data){
        x.domain(data.map(function(d) { return d.states; }));
        y.domain([0, d3.max(data, function(d) { return d.losses; })]);

        svg.append("g")
              .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        function rotateLabels(){
            if(width < mobileThreshold){
                    return svg.selectAll(".x.axis")
                        .selectAll("text")
                            .attr("text-anchor", "end")
                            .attr("y", 0)
                            .attr("x", -2)
                            .attr("style", "font: 10px sans-serif")
                            .attr("dy", "0.35em")
                            .attr("transform", "rotate(-65)");
                }
        }

        rotateLabels();
        
        svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("fill", function(d){ return barColor(d); })
                .attr("x", function(d) { return x(d.states); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {return y(d.losses); })
                .attr("height", function(d) { return height - y(d.losses); });

        svg.selectAll(".text")
              .data(data)
            .enter()
            .append("text")
                .text(function(d){ return formatAsDollar(d.losses);})
                .attr("text-anchor", "end")
                .attr("class", "text")
                .attr("x", function(d){ return x(d.states) + x.rangeBand()/2; })
                .attr("y", function(d){ return y(d.losses) + (0.20 * x.rangeBand()); })
                .attr("style", function(d, i){
                    if(width < mobileThreshold){
                        return 'font: 8px sans-serif'; //resize text for mobile
                    }
                });
            //end of csv block    
            }); 

        svg.append("text")
            .attr("class", "axis")
                .attr("transform", "rotate(-90)")
                .attr("dy", ".75em")
                .attr("y", 0)
                .attr("x", - height)
                .style("text-anchor", "start")
                .text("Total Losses");
        
    function type(d) {
        d.losses = +d.losses;
        return d;
        } 

    if (pymChild) {
        pymChild.sendHeightToParent();
    }
}


/*
 * NB: Use window.load instead of document.ready
 * to ensure all images have loaded
 */
$(window).load(function() {
    pymChild = new pym.Child({
        renderCallback: render
    });
})
