window.onload = init;

myCanva = document.getElementById('myCanva');
canvaPos = $(myCanva).offset();
ctx = myCanva.getContext("2d");

tableHeight = 500;
tableWidth = 500;

mouseX = -1;
mouseY = -1;
vref = new Vector(-10,0);
vrefmag = vref.magnitude();
physicsUpdateRate = 16;

// Ajouter une table qui penche AWW YEAH (possibilite de flipper)
// wtf xD, a quoi on pensait ??!
ballz = [];
moving = [];

wallz = [];

// Prochaine étape : Calculer la force de frappe ! Avec une jauge qui se remplie quand on clique. Le bâton recule quand on clique.
preparingShot = false;
shotPower = -1;
maxPower = 60;
distWBall = 30;

// Code emprunte pour obtenir la fonction RequestAnimationFrame pour tous les browsers
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
// Fin (source: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)

function init()
{
    ballz[0] = new Ball(250, 250, 0);
    for(var x = 1; x <= 15; x++)
    {
        var randX = (Math.random() * 460) + 20;
        var randY = (Math.random() * 460) + 20;

    	ballz[x] = new Ball(randX, randY, x);
    }

    // Pour l'instant on a 4 murs hard coded
    wallz.push([20,0,460,20]); // Horizontal, up
    wallz.push([20,480,460,20]); // Horizontal, down
    wallz.push([0,20,20,460]); // Vertical, left
    wallz.push([480,20,20,460]); // Vertical, right

    myCanva.addEventListener('mousemove', updateMousePos, false);

    myCanva.addEventListener('mousedown', startHit, false);
    myCanva.addEventListener('mouseup', stopHit, false);

    // TODO: Separer la logique de mise a jour physique vs. redessiner le canvas
    redraw();

    updatePhysics();
    setInterval(updatePhysics, physicsUpdateRate);
}

function updateMousePos(e)
{
    mouseX = e.pageX - canvaPos.left;
    mouseY = e.pageY - canvaPos.top;
}

function startHit(e)
{
    shotPower = 1;
    preparingShot = true;
}

function stopHit(e)
{
    preparingShot = false;

    // This needs to be modified depending on shotPower var
    moving.push([0, [60,60]]);
    shotPower = -1;
}

function redraw()
{
    // Faire une requete pour le prochain appel de mise a jour de l'ecran
    requestAnimFrame(redraw);

    drawTable();
    drawBallz();
    drawStick();
}

function updatePhysics()
{
    // Loop a travers de larray moving, et faire bouger les boules qui ont une vitesse
    // On doit aussi determiner les balles qui terminent leur mouvement
    // Principe simple en ce moment ...
    for (b in moving)
    {
        ballIdx = moving[b][0]
        speed = moving[b][1]
        moving.splice(ballIdx, 1);

        speed = [speed[0] - 1, speed[1] - 1];
        if (speed[0] != 0 || speed[1] != 0)
        {
            moving.push([ballIdx, speed]);
        }
    }

    if (preparingShot)
    {
        updatePower();
    }
}

function updatePower()
{
    if (shotPower < maxPower)
    {
        shotPower++;
    }
}

function drawTable()
{
    ctx.beginPath();
    ctx.rect(0, 0, 500, 500);
    ctx.fillStyle = '#008833'
    ctx.fill();

    for (w in wallz)
    {
        ctx.beginPath();
        ctx.rect(wallz[w][0], wallz[w][1], wallz[w][2], wallz[w][3]);
        ctx.fillStyle = '#800000'
        ctx.fill();
    }
}

function drawBallz()
{
    ballz[0].draw(ctx);
}

function drawStick()
{
    if (mouseX == -1 || mouseY == -1)
        return
    if (moving.length != 0)
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

    // MAGIC NUMBER. 30 correspond à la distance entre la balle et le bâton
    // Temporaire seulement
    ctx.translate(distWBall + shotPower, (-0.5 * stickWidth));

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
