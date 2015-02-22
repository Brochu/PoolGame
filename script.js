window.onload = init;
myCanva = document.getElementById('myCanva');

// Ajouter une table qui penche AWW YEAH (possibilite de flipper)

function init(){
	console.log(myCanva);
	var context = myCanva.getContext("2d");
	console.log(context);
	
	var test = new Vector(60, 80);
	console.log(test.magnitude());
	
	test.debugDraw(context, 250, 250);
	
	var test2 = new Vector(5, 5);
	console.log(test.add(test2));
}

function Vector(x, y)
{
	this.x = x;
	this.y = y;
	
	this.magnitude = function()
	{
		return Math.sqrt((x*x) + (y*y));
	}
	
	this.add = function(v)
	{
		return new Vector(this.x + v.x, this.y + v.y);
	}
	
	this.debugDraw = function(ctx, posX, posY)
	{	
		// Thanks to http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
		var tox = posX + this.x;
		var toy = posY + this.y;
		
		var headlength = 15;
		var headAngle = Math.PI / 6;
		var angle = Math.atan2(toy - posY, tox - posX);
		
		ctx.beginPath();
		
		ctx.moveTo(posX, posY);
		ctx.lineTo(tox, toy)
		ctx.lineTo(tox - headlength * Math.cos(angle - headAngle), toy - headlength * Math.sin(angle - headAngle));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlength * Math.cos(angle + headAngle), toy - headlength * Math.sin(angle + headAngle));
		
		ctx.stroke();
	}
}