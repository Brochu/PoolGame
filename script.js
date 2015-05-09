window.onload = init;
myCanva = document.getElementById('myCanva');
canvaPos = $(myCanva).offset();
console.log(canvaPos);
ctx = myCanva.getContext("2d");
tableHeight = 500;
tableWidth = 500;

mouseX = -1;
mouseY = -1;
vref = new Vector(-10,0);
vrefmag = vref.magnitude();

// Ajouter une table qui penche AWW YEAH (possibilite de flipper)
// wtf xD, a quoi on pensait ??!
ballz = [];
moving = [];


function init()
{
    ballz[0] = new Ball(250, 250, 0);
    for(var x = 1; x <= 15; x++)
    {
	    var randX = (Math.random() * 460) + 20;
	    var randY = (Math.random() * 460) + 20;

    	ballz[x] = new Ball(randX, randY, x);
    }

    myCanva.addEventListener('mousemove', updateMousePos, false);

    // TODO: Separer la logique de mise a jour physique vs. redessiner le canvas
    update();
    setInterval(update, 10);
}

function updateMousePos(e)
{
	// Offset fonctionne pas dans Firefox
    /*mouseX = e.offsetX;
    mouseY = e.offsetY;*/
	mouseX = e.pageX - canvaPos.left;
    mouseY = e.pageY - canvaPos.top;
    // console.log(mouseX + ' , ' + mouseY);
}

function update()
{
    drawTable();

    // To be replaced by function drawBallz
    ballz[0].draw(ctx);
    drawStick();
}

function drawTable()
{
	ctx.beginPath();
	ctx.rect(0, 0, 500, 500);
	ctx.fillStyle = '#008833'
	ctx.fill();
}

function drawStick()
{
    if (mouseX == -1 || mouseY == -1)
        return

    stickWidth = 10;
    stickLength = 200;

    // Trouver l'angle que fait la souris par rapport a la balle du joueur.
    ballx = ballz[0].pos.x;
    bally = ballz[0].pos.y;
	
	// Position de la balle - position de la souris
    v = ballz[0].pos.sub(new Vector(mouseX, mouseY));
	// Trouver l'angle du vecteur à partir d'un vecteur de référence
    theta = Math.acos(v.dotProduct(vref) / (v.magnitude() * vrefmag));
	// Flipper l'angle du vecteur
    if (mouseY < bally)
        theta = -theta;

    // Transformations pour dessiner le baton a la bonne place
    ctx.translate(ballx, bally);
    ctx.rotate(theta);
    ctx.translate(30, (-0.5 * stickWidth));

    ctx.beginPath();
    ctx.rect(0, 0, stickLength, stickWidth);
    ctx.fillStyle = '#333333'
    ctx.fill();
	
	// Remet le canvas à sa position initiale
    ctx.setTransform(1,0,0,1,0,0);
}

function Ball(posX, posY, num)
{
    this.pos = new Vector(posX, posY);
    this.num = num;

    this.draw = function(ctx)
    {
        // Fill ball color
        ctx.beginPath();
        ctx.fillStyle = Ball.colors[this.num][0];
        ctx.arc(this.pos.x, this.pos.y, Ball.RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        if (this.num != 0)
        {
            //Fill stripe
            ctx.beginPath()
            ctx.fillStyle = Ball.colors[this.num][1];
            ctx.arc(this.pos.x, this.pos.y, Ball.RADIUS, Math.PI / 6, 5 * (Math.PI / 6));
            ctx.fill();

            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, Ball.RADIUS, 7 * Math.PI / 6, 11 * (Math.PI / 6));
            ctx.fill();

            // Fill white number highlight
            ctx.beginPath();
            ctx.fillStyle = '#FFF';
            ctx.arc(this.pos.x, this.pos.y, 7, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // Ball number
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText(this.num, this.pos.x, this.pos.y + 2.5);
        }
    }
}
Ball.RADIUS = 18;
Ball.colors = [['#FFF', '#FFF'],
			   ['#F2C103', '#F2C103'],
			   ['#041171', '#041171'],
			   ['#D81501', '#D81501'],
			   ['#090A43', '#090A43'],
			   ['#F67A32', '#F67A32'],
			   ['#066D42', '#066D42'],
			   ['#7F0900', '#7F0900'],
			   ['#000', '#000'],
			   ['#F2C103', '#FFF'],
			   ['#041171', '#FFF'],
			   ['#D81501', '#FFF'],
			   ['#090A43', '#FFF'],
			   ['#F67A32', '#FFF'],
			   ['#066D42', '#FFF'],
			   ['#7F0900', '#FFF']
			  ];
function Vector(x, y)
{
    // changer pour un set de fonctions qui travaillent avec array associatifs 2D
    this.x = x;
    this.y = y;

    this.magnitude = function()
    {
		// Longueur du vecteur
        return Math.sqrt((x*x) + (y*y));
    }

    this.magnitudesqr = function()
    {
		// On s'en fout de la longueur on veut juste savoir si y'a un vecteur plus long que l'autre
		// Calcul moins lourd
        return (x*x) + (y*y);
    }

    this.add = function(v)
    {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    this.sub = function(v)
    {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    this.dotProduct = function(v)
    {
        return this.x * v.x + this.y * v.y;
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

function testVectors(context)
{
    var test = new Vector(-60, -80);
    console.log(test.magnitude());

    test.debugDraw(context, 250, 250);

    var test2 = new Vector(5, 5);
    console.log(test.add(test2));
}
