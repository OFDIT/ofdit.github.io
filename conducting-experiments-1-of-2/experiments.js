$(document).ready(function(){

	var container = "#applet",
		children = 48,
		minAge = 4,
		maxAge = 13,
		data = [4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6,
				6, 7, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9,
				9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 11,
				11, 11, 11, 12, 12, 12, 12, 13, 13];

	var button = $("<button>Random Assignment</button>")
					.css("float", "left")
					.css("clear", "both")
					.on("click", function(){
						randomize();
					});

	$(container).append(button);


	var totalPlot 		= 	init("Total", "black"),
		treatment1Plot	=	init("Treatment 1", "red"),
		treatment2Plot	=	init("Treatment 2", "blue");

	totalPlot.update(data);
	randomize();

	function init(title, color){
		var plot = d3.dotplot().plot(container, minAge, maxAge);
		plot.color(color);
		plot.showMean();
		plot.title(title);
		return plot;
	}

	function randomize(){
		rData = d3.shuffle(data);
		treatment1Plot.update(rData.slice(0, 24+1));
		treatment2Plot.update(rData.slice(24+1));
	}
});
