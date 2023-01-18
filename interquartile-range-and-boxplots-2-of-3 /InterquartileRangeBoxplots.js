$(document).ready(function(){


	var container = "#applet",
		minAge = 1,
		maxAge = 22;

	var quartiles = [4, 7, 10,13, 19];

	var button = $("<button>Reset</button>")
					.css("float", "left")
					.css("clear", "both")
					.on("click", function(){
						plot.update([]);
					});
	$(container).append(button);


	var plot = d3.dotplot().plot(container, minAge, maxAge);
	plot.targetBoxPlot(quartiles);
	plot.boxPlot();
	plot.slider();
	plot.update([]);
});
