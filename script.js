const square = 30
const fieldHeight = 20
const fieldWidth = 10;
const ys = [...Array(20).keys()];
const colors = ["#feeb03","#f98f15","#f30845","#4614ff","#26ea20",
                "#25f4e3","#63ddbb","#50caf8","#26fbdc","#69d5ef",
                "#9332ff","#cd85f5","#d6318c","#9684ff","#bc97f2",
                "#ac3bdf","#1450b6","#6dfd77","#59fe95","#e859fe",
                "#FFFF00","#FF0000","#00FF00","#00FFFF","#FF00FF",
                "#9D00FF","#CC00FF","#6E0DD0","#9900FF","#CC00FF",
                "#f3bf10","#1a1a1a","#2d9fd7","#eeba74","#7499be",
                "#d81b60","#9575cd","#283593","#006064","#1b5e20",
                "#d50000","#c51162","#aa00ff","#6200ea","#00b8d4",
                "#76ff03","#ffea00","#ff6d00","#ff3d00","#aeea00",
                "#ef9a9a","#ce93d8","#9fa8da","#80cbc4","#4caf50",
                "#4e342e","#a1887f","#757575","#90a4ae","#37474f",
                "#ff3d00","#bf360c","#f57f17","#ff5722","#ffca28",
                "#00bcd4","#4fc3f7","#00695c","#039be5","#00b8d4"]

const nextShapeYOffset = 2
const nextShapeXOffset = 15
const DELAY = 500


const tetraminos = [
  [{'x' : -1 , 'y' : -1,  color : undefined  },
   {'x' :  0 , 'y' : -1,  color : undefined  },
   {'x' : -1 , 'y' :  0,  color : undefined  },
   {'x' :  0 , 'y' :  0,  color : undefined  }],
 
  [{'x' :  0 , 'y' : -1,  color : undefined  },
   {'x' :  0 , 'y' :  0,  color : undefined  },
   {'x' :  0 , 'y' :  1,  color : undefined  },
   {'x' :  0 , 'y' :  2,  color : undefined  }],

  [{'x' :  0 , 'y' : -1,  color : undefined  },
   {'x' :  0 , 'y' :  0,  color : undefined  },
   {'x' :  1 , 'y' :  0,  color : undefined  },
   {'x' :  1 , 'y' :  1,  color : undefined  }],

  [{'x' : -1 , 'y' : -1,  color : undefined  },
   {'x' : -1 , 'y' :  0,  color : undefined  },
   {'x' : -1 , 'y' :  1,  color : undefined  },
   {'x' :  0 , 'y' :  1,  color : undefined  }],

  [{'x' : -1 , 'y' : -1,  color : undefined  },
   {'x' : -1 , 'y' :  0,  color : undefined  },
   {'x' :  0 , 'y' :  0,  color : undefined  },
   {'x' : -1 , 'y' :  1,  color : undefined  }]
 ]

 const border = [{'x':0,'y':0},{'x':0,'y':1},{'x':0,'y':2},{'x':0,'y':3},{'x':0,'y':4},{'x':0,'y':5},{'x':0,'y':6},{'x':0,'y':7},{'x':0,'y':8},{'x':0,'y':9},{'x':0,'y':10},
                 {'x':0,'y':11},{'x':0,'y':12},{'x':0,'y':13},{'x':0,'y':14},{'x':0,'y':15},{'x':0,'y':16},{'x':0,'y':17},{'x':0,'y':18},{'x':0,'y':19},{'x':0,'y':20},
                 {'x':11,'y':0},{'x':11,'y':1},{'x':11,'y':2},{'x':11,'y':3},{'x':11,'y':4},{'x':11,'y':5},{'x':11,'y':6},{'x':11,'y':7},{'x':11,'y':8},{'x':11,'y':9},{'x':11,'y':10},
                 {'x':11,'y':11},{'x':11,'y':12},{'x':11,'y':13},{'x':11,'y':14},{'x':11,'y':15},{'x':11,'y':16},{'x':11,'y':17},{'x':11,'y':18},{'x':11,'y':19},{'x':11,'y':20},
                 {'x':1,'y':20},{'x':2,'y':20},{'x':3,'y':20},{'x':4,'y':20},{'x':5,'y':20},{'x':6,'y':20},{'x':7,'y':20},{'x':8,'y':20},{'x':9,'y':20},{'x':10,'y':20}
  ]
 const MAX_SHAPE = tetraminos.length;

 
let relativeShape;
let field = [{'x': 0,'y': 1000000}];
let level = 0
let score = 0
let delay
let deletedCount = 0

let firstColor = randomColor(colors,level)
let nextShape = tetraminos[Math.floor(Math.random()*MAX_SHAPE)].map(function(item){return {'x':item.x,'y':item.y,'color':firstColor} })

let elementCanvas = document.getElementById("canvas");
let ctx = elementCanvas.getContext('2d')
let tetraminoColor
let centerCoordinates = {'x' : 5 , 'y' : 0}
let scoreElement = document.getElementById("score")
let levelElement = document.getElementById("level")


scoreElement.append("score: 0")
levelElement.append("level 0")


    


function mirrored(shape){
    return shape.map(function(item){
        return {x: -item.x, y: item.y, color : item.color };
    });
}

function rotated(shape) {
    return shape.map(function(item){return {'x' : item.y, 'y': -item.x, 'color' : item.color}});
}

function actualShape(relativeShape, extraX=0, extraY=0) {
    return relativeShape.map(item => ({
        'x' : item.x + centerCoordinates.x + extraX,
        'y' : item.y + centerCoordinates.y + extraY,
        'color' : item.color,
    }));
}

function futureShape(shape) {
    return shape.map(item => ({ x: item.x, y: item.y + 1 }));
}


function generateFinalShape(){
    centerCoordinates = {'x' : 5 , 'y' : 0}

    const tetraminoType = Math.floor(Math.random()*MAX_SHAPE)
    
   
   
   tetraminoColor = randomColor(colors,level) 

   relativeShape = nextShape.map(function(value){return {'x' : value.x, 'y' : value.y, 'color' : value.color} } )
   nextShape = tetraminos[tetraminoType].map(function(item){
   	
   	return	{'x' : item.x, 'y' : item.y, 'color' : tetraminoColor }
   })
    

    let shapeEvents = Math.floor(Math.random()*4)  // 0 - 3

	if (shapeEvents == 1){ 
           
         nextShape = mirrored(nextShape)    
    }

    if (shapeEvents == 2){
           
        nextShape = rotated(nextShape)    
    }

    if (shapeEvents == 3){ 
          
       nextShape = mirrored(rotated(nextShape));
    }
}


generateFinalShape()

function loop(){

  if (isGameEnded(field)){ 

  
  }
	drawField()
  
     if(intersectsFieldOrBorder(actualShape(relativeShape, 0, 1), field)) {
         
        addShapeToField(actualShape(relativeShape));
        
        
        
        //--//
        addToScore(getDeletedYs(), level)
        levelUpdate(score, level)
        console.log(score,'<= score | level =>',level)
    	getDeletedYs().forEach( function(counter){
    		
    	deleteFullRow(counter, field)
    	shiftDownField(field, counter) 

		})
		//--//
        
         generateFinalShape()
    }else{
       shiftDown(centerCoordinates);
     }
     loopID = setTimeout(loop, delay )
     if (isGameEnded(field) ){
      clearTimeout(loopID) 
      alert("GAME OVER")
     }
     if (deletedCount < 112){
     delay = DELAY-(deletedCount*4)
     console.log(delay)
    }
     }




function handler(key){
 
  //handlerInterval = setInterval(function(){
  console.log("handler")
  if (key){
  console.log("ekey")
  drawField(field)
  
  if ( (key.keyCode == "D".charCodeAt(0) || key.keyCode ==39)&& !intersectsFieldOrBorder(actualShape(relativeShape, 1), field)){
            
    centerCoordinates.x += 1;
  }

  if ( ( key.keyCode == "A".charCodeAt(0) || key.keyCode ==37 ) && !intersectsFieldOrBorder(actualShape(relativeShape, -1), field)) {
            
  centerCoordinates.x -= 1;
            
  }

  if ( ( key.keyCode == "W".charCodeAt(0) || key.keyCode ==38 )  ){ 
    let rotatedCopy = relativeShape.map(function(item){return {'x' : item.y, 'y': -item.x, 'color' : item.color}}) 

  if(!intersectsFieldOrBorder(actualShape(rotatedCopy),field)){
                
      relativeShape = rotatedCopy;
      }
  
}    



  if ( (key.keyCode == "S".charCodeAt(0) || key.keyCode ==40 ) ){
      delay = 100
            
    }
}
//},50000)

}


function shiftDown(shape){
     shape.y = shape.y + 1
}

function addShapeToField(shape){
    shape.forEach(function(item){
        field.push( {'x' : item.x, 'y' : item.y, 'color' : item.color } )
     })
}

function intersectsFieldOrBorder(shape, field) {

    for(let itemfall of shape) {
        if(itemfall.y == fieldHeight) {
            return true;
        }
        if(itemfall.x <= 0) {
            return true;
        }
        if(itemfall.x > fieldWidth) {
            return true;
        }
        
        for(let itemField of field) {
            if(itemfall.y == itemField.y && itemfall.x == itemField.x) {
                return true;
            }
        }
    }
    return false;
}

function getDeletedYs(){
let deletedY = []
let check = []
let temp = []
    ys.forEach(function(currentY){
        temp  = []
        field.forEach(function(fieldCell){
            if(fieldCell.y == currentY){
                temp.push(fieldCell.x)
                }    

        })
        check.push( {'y' : currentY, 'x' : temp} )
    })
    	
    	check.forEach(function(item){
    		if (item.x.length == 10){
            	deletedY.push(item.y)
		}
	})
      
    	deletedCount += deletedY.length

      console.log(deletedCount)
    	return deletedY
}

function deleteFullRow(y,fieldArray){
fieldArray.forEach( function(point){ 
	field = fieldArray.filter(function(value, index, arr){
	return value.y != y;
	})
})
}

function shiftDownField(fieldArray,y){
	
	fieldArray.forEach( function(fieldCell) {
	if (fieldCell.y < y ) {shiftDown(fieldCell) } 
	});
}

function lowEnough(item){
	return item.y > 1
}


function isGameEnded(fieldArray){
	
	if(fieldArray.every(lowEnough)){
		return false
	}
  $("#start").attr("disabled",false)
	return true
	}

function randomColor(colors,level){
	return colors[Math.floor(Math.random()*5)+level*5]
}

function drawField(){
  
	ctx.clearRect(0,0,590,630)
    for (let x = 1; x<=fieldWidth; x++ )
    for (let y = 0; y<=fieldHeight; y++ )
    drawBorder({'x':x,'y':0+y},'rgba(112, 103, 116, 0.3)')
    
    border.forEach(function(value){
      ctx.fillStyle = 'rgba(135, 135, 135, 0.97)'  
      ctx.fillRect(value.x * square, value.y * square,square,square)
      drawBorder(value,"rgba(188, 41, 68, 0.97)")
    })

    
	actualShape(relativeShape).forEach(function(item){
        ctx.fillStyle = item.color
        ctx.fillRect(item.x * square,item.y * square,square,square)
        drawCellBorder(item)
    })

    field.forEach(function(fieldCell){
        ctx.fillStyle = fieldCell.color
        ctx.fillRect(fieldCell.x * square,fieldCell.y * square,square,square)
        drawCellBorder(fieldCell)
        
        })

    nextShape.forEach(function(nextCell){

    	ctx.fillStyle = nextCell.color
    	ctx.fillRect((nextCell.x+nextShapeXOffset)*square,(nextCell.y+nextShapeYOffset)*square,square,square)
      drawCellBorder(nextCell,nextShapeXOffset, nextShapeYOffset)

    })
    
}

function addToScore(array,currentLevel){

	if (array.length == 1){
		score += 40*(currentLevel+1)	
	}
	if (array.length == 2){
		score += 100*(currentLevel+1)
	}
	if (array.length == 3){
		score += 300*(currentLevel+1)
	}
	if (array.length == 4){
		score += 1200*(currentLevel+1)
  }

  
  $("#score").empty()  
  scoreElement.append("score: ",score)
}

function levelUpdate(score,currentLevel){

if (level <= (colors.length/5) ){
	  level = Math.floor(deletedCount/10)
    
    $("#level").empty()
    levelElement.append("level ",level)
}
else{
  $("#level").empty()
  levelElement.append("MAX level")
}
  
  
}

function drawCellBorder(single,nextShapeXOffset = 0,nextShapeYOffset = 0){

  ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
  ctx.fillRect( (single.x + nextShapeXOffset + 0.2)*square, (single.y + nextShapeYOffset + 0.1)*square, 0.8*square, 0.1*square)
  ctx.fillRect( (single.x + nextShapeXOffset +0.1)*square, (single.y + nextShapeYOffset + 0.1)*square, 0.1*square, 0.8*square)
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  ctx.fillRect( (single.x + nextShapeXOffset+0.1)*square, (single.y + nextShapeYOffset + 0.9)*square, 0.9*square, 0.1*square)
  ctx.fillRect( (single.x + nextShapeXOffset + 0.9)*square, (single.y + nextShapeYOffset + 0.1)*square, 0.1*square, 0.8*square)

}

function drawBorder(borderCell,color){ 
  ctx.fillStyle = color

  ctx.fillRect( (borderCell.x + 0) * square, (borderCell.y + 0) * square, 0.5 * square, 1/3 * square)
  ctx.fillRect( (borderCell.x + 2/3) * square, (borderCell.y + 0) * square, 1/3 * square, 1/3 * square)
  ctx.fillRect( (borderCell.x + 0) * square, (borderCell.y + 0.5) * square, 1/3 * square, 1/3 * square)
  ctx.fillRect( (borderCell.x + 0.5) * square, (borderCell.y + 0.5) * square, 0.5 * square, 1/3 * square)
  

}


 

  drawField(field)




$("#pause").click(function(){
$("#start").attr('disabled', false)
$("#pause").attr("disabled",true)
clearTimeout(loopID)
 

})


$("#start").click(function(){
if (isGameEnded(field)){
drawField(field)
field = []
score = 0
level = 0
deletedCount = 0

loop() 
$("#start").attr('disabled', true)
$("#pause").attr("disabled",false)

}
else{

loop() 
$("#start").attr('disabled', true)
$("#pause").attr("disabled",false)
}
})

window.addEventListener("keydown", function(e) {
    
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


//document.addEventListener('keypress', handler )

document.addEventListener('keydown', handler )


