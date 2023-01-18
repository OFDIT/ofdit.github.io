$(document).ready(function(){

	//variables created for axis, sliders, checkboxes, etc.
	var slider1 = d3.select("#slider1");
	var slider2 = d3.select("#slider2");
	var enter1 = d3.select("#enter");
	var line = d3.select("#line");
	var slope = 0;
	var equation = d3.select("#equation");
	var checkbox = document.getElementById('checkbox');
	var checkbox2 = document.getElementById('checkbox2');
	var xaxisScale = d3.scale.linear().domain([0,25]).range([0,500]);
	var xAxis = d3.svg.axis().scale(xaxisScale);
	d3.select("#graph").attr("class","axis").append("g").attr("transform", "translate(50,500)").call(xAxis);
	var yaxisScale = d3.scale.linear().domain([25,0]).range([0,450]);
	var yAxis = d3.svg.axis().scale(yaxisScale).orient("left");
	d3.select("#graph").attr("class","axis").append("g").call(yAxis).attr("transform", "translate(50,50)");


	//creates and positions 5 dots, associated residual lines, and associated squared residuals.
	var dot1x = d3.select("#dot1").attr("cx");
	var dot1y = d3.select("#dot1").attr("cy");
	var square1 = d3.select("#graph").append("rect")
		.attr("x",dot1x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy")))
		.attr("width",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy")))
		.style("stroke-width","1").style("fill","none").style("stroke","black");

	var resid1 = d3.select("#graph").append("rect")
		.attr("x",dot1x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy")))
		.attr("width",1)
		.style("stroke-width","2").style("fill","none").style("stroke","black");

	var dot2x = d3.select("#dot2").attr("cx");
	var dot2y = d3.select("#dot2").attr("cy");
	var square2 = d3.select("#graph").append("rect")
		.attr("x",dot2x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy")))
		.attr("width",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy")))
		.style("stroke-width","1").style("fill","none").style("stroke","black");

	var resid2 = d3.select("#graph").append("rect")
		.attr("x",dot2x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy")))
		.attr("width",1)
		.style("stroke-width","2").style("fill","none").style("stroke","black");

	var dot3x = d3.select("#dot3").attr("cx");
	var dot3y = d3.select("#dot3").attr("cy");
	var square3 = d3.select("#graph").append("rect")
		.attr("x",dot3x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy")))
		.attr("width",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy")))
		.style("stroke-width","1").style("fill","none").style("stroke","black");

	var resid3 = d3.select("#graph").append("rect")
		.attr("x",dot3x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy")))
		.attr("width",1)
		.style("stroke-width","2").style("fill","none").style("stroke","black");

	var dot4x = d3.select("#dot4").attr("cx");
	var dot4y = d3.select("#dot4").attr("cy");
	var square4 = d3.select("#graph").append("rect")
		.attr("x",dot4x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy")))
		.attr("width",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy")))
		.style("stroke-width","1").style("fill","none").style("stroke","black");

	var resid4 = d3.select("#graph").append("rect")
		.attr("x",dot4x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy")))
		.attr("width",1)
		.style("stroke-width","2").style("fill","none").style("stroke","black");

	var dot5x = d3.select("#dot5").attr("cx");
	var dot5y = d3.select("#dot5").attr("cy");
	var square5 = d3.select("#graph").append("rect")
		.attr("x",dot5x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy")))
		.attr("width",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy")))
		.style("stroke-width","1").style("fill","none").style("stroke","black");

	var resid5 = d3.select("#graph").append("rect")
		.attr("x",dot5x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy")))
		.attr("width",1)
		.style("stroke-width","2").style("fill","none").style("stroke","black");

//calculates SSE and stores in variable
	/*var SSE =  -(-square1.attr("height")*square1.attr("height") - square2.attr("height")*square2.attr("height")
	 - square3.attr("height")*square3.attr("height") - square4.attr("height")*square4.attr("height") - square5.attr("height")*square5.attr("height"))/10000;
	SSE = Math.round(SSE*100)/100
	d3.select("#SSE").text("SSE = " + SSE);
*/
	if(checkbox.checked == false){
	   square1.attr("display","none");
	   square2.attr("display","none");
	   square3.attr("display","none");
	   square4.attr("display","none");
	   square5.attr("display","none");
	}

//toggles squared resids when checkbox is checked
checkbox.onchange=function() {
  if(checkbox.checked == false){
	   square1.attr("display","none");
	   square2.attr("display","none");
	   square3.attr("display","none");
	   square4.attr("display","none");
	   square5.attr("display","none");
  }
  else{
	   square1.attr("display","block");
	   square2.attr("display","block");
	   square3.attr("display","block");
	   square4.attr("display","block");
	   square5.attr("display","block");
  }
};

//toggles residuals when second checkbox is checked
checkbox2.onchange=function() {
  if(checkbox2.checked == false){
	   resid1.attr("display","none");
	   resid2.attr("display","none");
	   resid3.attr("display","none");
	   resid4.attr("display","none");
	   resid5.attr("display","none");
  }
  else{
	   resid1.attr("display","block");
	   resid2.attr("display","block");
	   resid3.attr("display","block");
	   resid4.attr("display","block");
	   resid5.attr("display","block");
  }
};

//changes graph when slider changes
function sliderchange(){
	var y1 = 600-document.getElementById("slider1").value;
	line.attr("y1",y1);
	slope = document.getElementById("slider2").value;
	//alert(18*(25*0-(25-(1/18)*(y1-50))-(-25))-(-50) );
	var y2 = y1-(450*slope);
	line.attr("y2",y2);
	//slope = (((25-(1/18)*(line.attr("y2")-50))-(25-(1/18)*(line.attr("y1")-50)))/(25)).toFixed([2]);
}

//toggles when checkbox changes
function textboxchange(){
	var a = (25-document.getElementById("box1").value)*18+50;
	slope = document.getElementById("box2").value;
	var y2 = a-(450*slope);
	line.attr("y1",a);
	line.attr("y2",y2);
}

//used to calculate SSE
function SSEcalc(height){
	return (height/18)*(height/18);
}

//this function is called whenever graph is changed- all squares and residuals are repositioned.
function makechange(){
	equation.text("Y = " + (25-(1/18)*(line.attr("y1")-50)).toFixed([2]) + " + " + slope + "*X");

	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))
		< 0){
	square1.attr("x",dot1x)
		.attr("y",d3.select("#dot1").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))))
		.attr("width",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))));
	}
	else{
	square1.attr("x",dot1x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))))
		.attr("width",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))));
	}

	if(-((line.attr("y1")-line.attr("y2"))*((d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))
		< 0){
	resid1.attr("x",dot1x)
		.attr("y",d3.select("#dot1").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))));
	}
	else{
	resid1.attr("x",dot1x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot1").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot1").attr("cy"))));
	}

	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))
		< 0){
	square2.attr("x",dot2x)
		.attr("y",d3.select("#dot2").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))))
		.attr("width",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))));
	}
	else{
	square2.attr("x",dot2x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))))
		.attr("width",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))));
	}

	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))
		< 0){
	resid2.attr("x",dot2x)
		.attr("y",d3.select("#dot2").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))));
	}
	else{
	resid2.attr("x",dot2x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot2").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot2").attr("cy"))));
	}


	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))
		< 0){
	square3.attr("x",dot3x)
		.attr("y",d3.select("#dot3").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))))
		.attr("width",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))));
	}
	else{
	square3.attr("x",dot3x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))))
		.attr("width",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))));
	}

	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))
		< 0){
	resid3.attr("x",dot3x)
		.attr("y",d3.select("#dot3").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))));
	}
	else{
	resid3.attr("x",dot3x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot3").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot3").attr("cy"))));
	}


	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))
		< 0){
	square4.attr("x",dot4x)
		.attr("y",d3.select("#dot4").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))))
		.attr("width",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))));
	}
	else{
	square4.attr("x",dot4x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))))
		.attr("width",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))));
	}

	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy")) < 0){
	resid4.attr("x",dot4x)
		.attr("y",d3.select("#dot4").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))));
	}
	else{
	resid4.attr("x",dot4x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot4").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot4").attr("cy"))));
	}


	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))
		< 0){
	square5.attr("x",dot5x)
		.attr("y",d3.select("#dot5").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))))
		.attr("width",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))));
	}
	else{
	square5.attr("x",dot5x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))))
		.attr("width",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))));
	}

	if(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))
		< 0){
	resid5.attr("x",dot5x)
		.attr("y",d3.select("#dot5").attr("cy"))
		.attr("height",-(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))));
	}
	else{
	resid5.attr("x",dot5x)
		.attr("y",(line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))
		.attr("height",(-((line.attr("y1")-line.attr("y2"))*(1-(d3.select("#dot5").attr("cx")-50)/500)- (-line.attr("y2")))-(-d3.select("#dot5").attr("cy"))));
	}



	SSE =  (SSEcalc(square1.attr("height")) + SSEcalc(square2.attr("height")) + SSEcalc(square3.attr("height")) + SSEcalc(square4.attr("height"))
		 + SSEcalc(square5.attr("height")));

     /*SSE =  -(-square1.attr("height")*square1.attr("height") - square2.attr("height")*square2.attr("height")
	 - square3.attr("height")*square3.attr("height") - square4.attr("height")*square4.attr("height") - square5.attr("height")*square5.attr("height"))/10000;
*/
	SSE = Math.round(SSE*100)/100
	d3.select("#SSE").text("SSE = " + SSE);


//ensures that residuals and squared residuals only display when boxes are checked
	if(checkbox.checked == false){
	   square1.attr("display","none");
	   square2.attr("display","none");
	   square3.attr("display","none");
	   square4.attr("display","none");
	   square5.attr("display","none");
	}
	if(checkbox.checked == true){
	   square1.attr("display","block");
	   square2.attr("display","block");
	   square3.attr("display","block");
	   square4.attr("display","block");
	   square5.attr("display","block");
	}

	if(checkbox2.checked == false){
		resid1.attr("display","none");
	    resid2.attr("display","none");
	    resid3.attr("display","none");
	    resid4.attr("display","none");
	    resid5.attr("display","none");
	}

	if(checkbox2.checked == true){
		resid1.attr("display","block");
	    resid2.attr("display","block");
	    resid3.attr("display","block");
	    resid4.attr("display","block");
	    resid5.attr("display","block");
	}


}

//calls the above functions at beginning and when sliders are changed
textboxchange();
makechange();

slider1.on("change", function(){
	sliderchange();
	makechange();
	var a = (25-(1/18)*(600-document.getElementById("slider1").value-50)).toFixed([2])
	var b = document.getElementById("slider2").value
	a = parseFloat(a)
	b = parseFloat(b)
	SSE = (b*2+a-14)*(b*2+a-14)
	 + (b*8+a-8)*(b*8+a-8) + (b*12+a-12)*(b*12+a-12)
	+(b*18+a-20)*(b*18+a-20)+(b*22+a-16)*(b*22+a-16)
	SSE = Math.round(SSE*1000)/1000
	d3.select("#SSE").text("SSE = " + SSE);

});
slider2.on("change", function(){
	sliderchange();
	makechange();
	var a = (25-(1/18)*(600-document.getElementById("slider1").value-50)).toFixed([2])
	var b = document.getElementById("slider2").value
	a = parseFloat(a)
	b = parseFloat(b)
	SSE = (b*2+a-14)*(b*2+a-14)
	 + (b*8+a-8)*(b*8+a-8) + (b*12+a-12)*(b*12+a-12)
	+(b*18+a-20)*(b*18+a-20)+(b*22+a-16)*(b*22+a-16)
	SSE = Math.round(SSE*1000)/1000
	d3.select("#SSE").text("SSE = " + SSE);

});

enter1.on("click", function(){
	textboxchange();
	makechange();
	var a = document.getElementById("box1").value
	var b = document.getElementById("box2").value

	a = parseFloat(a)
	b = parseFloat(b)
	SSE = (b*2+a-14)*(b*2+a-14)
	 + (b*8+a-8)*(b*8+a-8) + (b*12+a-12)*(b*12+a-12)
	+(b*18+a-20)*(b*18+a-20)+(b*22+a-16)*(b*22+a-16)
	SSE = Math.round(SSE*1000)/1000
	d3.select("#SSE").text("SSE = " + SSE);
});





})
