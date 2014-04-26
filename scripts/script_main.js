//Js file for the block games web app.
//Created by rationalAsh :D
//Now live on github.io

var cellSize = 20;

var cont = document.getElementById('container');
var sBox = document.getElementById('SettingsBox');
var posDisp = document.getElementById('mPos');
var mpFlag = 0;
var prevTBase = 0;

var wHeight = screen.availHeight;
var wWidth  = screen.availWidth;

var i=0;
var j=0;

var rows = Math.round(wHeight/cellSize);
var cols = Math.round(wWidth/cellSize);
var gridLinesY = new Array();
var gridLinesX = new Array();
var cells = new Array();
var cTemp = new Array();
var celBuf = new Array();
var snakeState = [];
var snakeVel   = [1,0]; //Normal Vector velocities

for(i=0; i<rows; i++)
{
  cTemp = new Array();
  for(j=0; j<cols; j++)
  {
    cTemp.push(0);
  }
  celBuf.push(cTemp);
}

console.log(String(celBuf));

function fillCell(X,Y)
{
  var gridX = Math.floor(X/cellSize);
  var gridY = Math.floor(Y/cellSize);
  animLayer.add(cells[gridY][gridX]);
  console.log(String([gridX, gridY]))
}


//console.log(snakeState);
//posDisp.innerHTML = "Hello!"
//cont.onmousemove = function(e){

//if((e.pageX > 1500) && (e.pageY < 410))
//    {
//	sBox.style.opacity = 0.8;
//	sBox.style.zIndex = 1;
//	sBox.style.visibility = "visible";
//    }
//    else
//    {
//	//sBox.style.opacity = 0.1;
//	sBox.style.zIndex  = -1;
//	sBox.style.visibility = "hidden";
//    }
//
//}

sBox.style.opacity = 0.8;
sBox.style.zIndex = 1;
sBox.style.visibility = "visible";


cont.onclick = function(e){
  //alert("Click at: "+ e.pageX + "," + e.pageY);
  //fillCell(e.pageX, e.pageY);
  //celBuf[Math.floor(e.pageY/cellSize)][Math.floor(e.pageX/cellSize)] ^= 1;
}

document.onkeydown = function(e){
  code = e.keyCode;

  switch(code)
  {
    case 38:
      console.log('UP');
      snakeVel = [0, -1];
      break;
    case 40:
      console.log('Down');
      snakeVel = [0, 1];
      break;
    case 39:
      console.log('Right');
      snakeVel = [1, 0];
      break;
    case 37:
      console.log('Left');
      snakeVel = [-1, 0];
      break;
  }
}

var stage = new Kinetic.Stage({
  container: 'container',
  width: wWidth,
  height: wHeight
});

var animLayer = new Kinetic.Layer();
var statLayer = new Kinetic.Layer();



//Loop to make Y gridlines
for(i=0; i<rows; i++)
{
  gridLinesY.push(
    new Kinetic.Line(
      {
        points: [0, i*cellSize, wWidth, i*cellSize],
		    stroke: 'black',
		    strokeWidth: 0.8,
		    lineCap: 'round',
        lineJoin: 'round'
      }
    )
  )
}
//Loop to make X gridlines
for(j=0; j<cols; j++)
{
  gridLinesX.push(
    new Kinetic.Line(
      {
        points: [j*cellSize, 0, j*cellSize, wHeight],
        stroke: 'black',
		    strokeWidth: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      }
    )
  )
}

//Adding Y lines to static layer so it doesn't have to update
for(i=0; i<rows; i++)
{
  statLayer.add(gridLinesY[i]);
}

//Adding X lines to static layer so that it doesn't have to update
for(j=0; j<cols; j++)
{
  statLayer.add(gridLinesX[j]);
}

//Making the cells
for(i=0; i<rows; i++)
{
  cTemp = new Array();
  for(j=0; j<cols; j++)
  {
    cTemp.push(
      new Kinetic.Rect(
        {
          x: j*cellSize + 1,
          y: i*cellSize + 1,
          width: cellSize - 2,
          height: cellSize - 2,
          fill: '#554a8c',
          stroke: '#554a8c',
          strokeWidth: 0
        }
      )
    )
  }
  cells.push(cTemp);
}


animLayer.add(cells[0][0]);
animLayer.draw();
statLayer.draw();

// add the layer to the stage
stage.add(animLayer).add(statLayer);


//Initialize the snake with an initial position
snakeState.push([10,10]);
snakeState.push([11,10]);
snakeState.push([12,10]);
console.log(String(snakeState));

//This is the code where all the stuff that updates
//in the next animation frame happens.
var anim = new Kinetic.Animation(function(frame){
  var time = frame.time,
      timeDIff = frame.timeDiff,
      frameRate = frame.frameRate;
  var xTime = Math.floor(time/1000);

  //update stuff
  //posDisp.innerHTML = "Framerate: "+frameRate;
  if(xTime>prevTBase)
  {
    snakeState.push([(snakeState[snakeState.length - 1][0]) + snakeVel[0], (snakeState[snakeState.length - 1][1]) + snakeVel[1]]);
    var rem = snakeState.shift();
    cells[rem[1]][rem[0]].remove();
  }

  for(i=0; i<snakeState.length; i++)
  {
    animLayer.add(cells[snakeState[i][1]][snakeState[i][0]]);
  }

  prevTBase = xTime;

}, animLayer);

anim.start();

//var tween = new Kinetic.Tween(
//    {
//	node: rect,
//	duration: 0.3,
//	x: 500,
//	y: 200,
//	rotation: 0,
//	opacity: 0.9,
//	scaleX: 0,
//	scaleY: 0,
//	easing: Kinetic.Easings.StrongEaseOut,
  //  }
//);
//
//tween.play();
