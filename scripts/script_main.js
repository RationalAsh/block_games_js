//Js file for the block games web app.
//Created by rationalAsh :D
//Now live on github.io

var cellSize = 20;

var cont = document.getElementById('container');
var sBox = document.getElementById('SettingsBox');
var posDisp = document.getElementById('mPos');
var scoreBoard = document.getElementById('score');
var mpFlag = 0;
var prevTBase = 0;
var eatFlag = 0;
var score = 0;

//var wHeight = screen.availHeight;
//var wWidth  = screen.availWidth;

var wHeight = window.innerHeight - 3;
var wWidth  = window.innerWidth - 5;
//alert(wHeight);
//alert(wWidth);

var i=0;
var j=0;

var rows = Math.round(wHeight/cellSize);
var cols = Math.round(wWidth/cellSize);
var gridLinesY = new Array();
var gridLinesX = new Array();
var cells = new Array();
var cTemp = new Array();
var celBuf = new Array();
var dotBuf = new Array();
var snakeState = [];
var snakeVel   = [1,0]; //Normal Vector velocities
var dotPos = [5,5];
var swallowed = new Array();

for(i=0; i<rows; i++)
{
  cTemp = new Array();
  for(j=0; j<cols; j++)
  {
    cTemp.push(0);
  }
  celBuf.push(cTemp);
  dotBuf.push(cTemp);
}

function clearBuf(array)
{
  for(i=0; i<rows; i++)
  {
    for(j=0; j<cols; j++)
    {
      array[i][j] = 0;
    }
  }
}

//console.log(String(celBuf));

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

//Make box visible on hover
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


//animLayer.add(cells[0][0]);
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
  var xTime = Math.floor(time/300);

  //update stuff
  //posDisp.innerHTML = "Framerate: "+frameRate;

  //If one second has passed change the snake to move in the 
  //Direction specified by the snakeVel var
  if(xTime>prevTBase)
  {
    snakeState.push([(snakeState[snakeState.length - 1][0]) + snakeVel[0], (snakeState[snakeState.length - 1][1]) + snakeVel[1]]);
    
    var rem = snakeState.shift();
    cells[rem[1]][rem[0]].remove();

    //If head is at a dot add the dot to the list of swallowedstuff and add
    //Dot to end of snake
    if((snakeState[snakeState.length-1][0]==dotPos[1])&&(snakeState[snakeState.length-1][1]==dotPos[0]))
    {
      score += 5;
      swallowed.push(dotPos);
      dotPos = [Math.floor(Math.random() * (rows-30)), Math.floor(Math.random() * (cols-20))];
      console.log('Head: '+String(dotPos));
      snakeState.unshift(swallowed.shift());
      scoreBoard.innerHTML = 'Score: '+String(score);      
    }
    

    //Checking if tail is at a dot
    //This works because if the snake enters a dot then the
    //Whole body has to pass through the dot.
    if((snakeState[0][0]==swallowed[0])&&(snakeState[0][0]==swallowed[1]))
    {
      //Eat the dot and grow longer
      //I'll try adding the new dot at the end of the snake for now.
      //eatFlag = 1;
      //console.log('Tail at dot');
    }

    for(i=0; i<snakeState.length; i++)
    {
      animLayer.add(cells[snakeState[i][1]][snakeState[i][0]]);
    }
    animLayer.add(cells[dotPos[0]][dotPos[1]]);

  }

  prevTBase = xTime;

}, animLayer);

anim.start();
