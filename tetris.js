//made by Albin Gyllander
const sideLength = 25
var canvas1 = document.getElementById('game2')
ctx1 = canvas1.getContext('2d')
boardWidth = 16
boardHeight = 24
score = 0
const availableColors= ['#f7fafe','#f0f4fd','#e8effc','#e0eafb','#d8e4fa','#d0dffa','#c9daf9','#c1d5f8','#b9cff7','#b2caf6','#aac5f5','#a2bff4','#9abaf3','#92b5f2','#8bb0f2','#83aaf1','#7ba5f0','#74a0ef','#6c9aee','#6495ed']

coordinatesPlane = coordinatesPlaneDuplicate = [...Array(boardHeight)].map(e => Array(boardWidth).fill(0));


class block {
	constructor(color,x,y){
		this.color = color
		this.x = x 
		this.y = y
		if(y>=0){
			coordinatesPlane[y][x] = color
		}				
	}
	getCoordinates(){
		return [this.x,this.y]
	}
	updateCoordinates(newX,newY){
		if(newY>= 0 && this.y >=0 ){
			coordinatesPlane[this.y][this.x] = 0
			this.x = newX
			this.y = newY
			coordinatesPlane[this.y][this.x] = this.color
		}
	}
	deleteCoordinates(){
		
		if(this.y>= 0 ){
			coordinatesPlane[this.y][this.x] = 0
		}	
	}
}

class figure {
	constructor(startBlock,length, attr){
		
		this.startBlock = startBlock
		this.length = length
		this.attr = attr
		this.color = this.startBlock.color
		this.listOfAddons = new Array
		this.listOfAddons.push(this.startBlock)
	
	}
	updateRotation(newRotation){
		this.rotationMatrix = newRotation
	}
	getAddons(){
		return this.listOfAddons
	}
	updateNewAddons(addons){
		var oldAddons = this.listOfAddons
		if(addons.length != oldAddons.length){
			return false
		}else{
			for(let i = 0;i<oldAddons.length;i++){

				oldAddons[i].updateCoordinates(addons[i].x,addons[i].y)
			}
		}
	
	}

	getAddonsCoordinates(){
		var arrayWithCoordinates = new Array
		for(let c = 0;c<this.listOfAddons.length;c++){
			var newArray  =new Array
			newArray.push(this.listOfAddons[c].x,this.listOfAddons[c].y)
			arrayWithCoordinates.push(newArray)
		}
		return arrayWithCoordinates
	}
	//this just deletes the coordinates from the plane not the visual representation 
	deleteAddons(){
		var g = this.getAddons()
		for(let h = 0;h<g.length;h++){
			g[h].deleteCoordinates()
			
		}
	}
	//checks wether this figure is touching any other shaped on either side
	isToTheSide(dir = 0){
		
		var list = this.listOfAddons
		if(dir=='right'){
			for(let g = 0;g<list.length;g++){
				var newArray = new Array
				newArray.push(list[g].x+1,list[g].y)

				if(!isEmpty(list[g].x+1,list[g].y ) && !nestedArrayContainArray(this.getAddonsCoordinates(),newArray)){
					return true
				}
			}	
		}else if(dir == 'left'){
			for(let g = 0;g<list.length;g++){
				var newArray = new Array
				newArray.push(list[g].x-1,list[g].y)

				if(!isEmpty(list[g].x-1,list[g].y ) && !nestedArrayContainArray(this.getAddonsCoordinates(),newArray)){
					return true
				}

			}	
		}
		return false
	}
	//checks to see of figure is hitting the bottom of the board
	isHitting(){
		var list = this.listOfAddons

		for(let g = 0;g<list.length;g++){
			var newArray= new Array
			newArray.push(list[g].x,list[g].y+1)

			if(!isEmpty(list[g].x,list[g].y+1 ) && !nestedArrayContainArray(this.getAddonsCoordinates(),newArray)){
				return true
			}

		}
		
		return false
	}
	//this function just updates the position of the figure based on its coordinates
	move(){
		
		this.deleteAddons()
		var list = this.getAddonsCoordinates()
		for(let v = 0;v<list.length;v++){
			var figureY =list[v][1]
			var figureX = list[v][0]
			if(figureY>=0){
				coordinatesPlane[figureY][figureX] = this.color
			}
			
			drawBox(list[v][0],list[v][1],this.color)
		}
	}

	createFigure(color,rotation =0){
		//initiating an instance of the figure
		this.deleteAddons()
		

		//this rotates the figure
		if(this.rotationMatrix == 1){
			this.updateRotation(1)
			
			ctx1.clearRect(0,0,canvas1.width,canvas1.height)
								var listOfNew = getCoordinatesOfBoxAddOnsRotated(this.getAddonsCoordinates())
			this.startBlock = listOfNew[0]
			for(let i = 0;i<listOfNew.length;i++){
				if(listOfNew[i].y>=0){
					coordinatesPlane[listOfNew[i].y][listOfNew[i].x] = this.color
				}
				
			 	drawBox(listOfNew[i].x,listOfNew[i].y,this.color)

			}
		
		//this gets new coordinates and moves the figure
		}else{
			
			this.listOfAddons = new Array
			this.listOfAddons.push(this.startBlock)
			var block  = this.listOfAddons[0]
			
			var figureX = block.x
			var figureY = block.y 
			drawBox(figureX,figureY,this.color)
			if(figureY>=0){
				coordinatesPlane[figureY][figureX] = this.color
			}
			
			var list = getCoordinatesOfBoxAddOns(this.listOfAddons)
			for(let v = 0;v<list.length;v++){
				drawBox(list[v][0],list[v][1],this.color)
			}	
		}
	}
}

//checks if a specific box is empty based on the coordinatesplane array
function isEmpty(x,y){
	if (x >= boardWidth || x < 0 || y < 0 || y>= boardHeight){
		return false
	}else{
		if(coordinatesPlane[y][x] != 0){
			return false
		}else{
			return true
		}	
	}
	
}	

//draw the box 
function drawBox(x,y,color){	
	x = x*sideLength 
	y = y*sideLength
	sideLength1 = sideLength-2
	ctx1.fillStyle=availableColors[color]
	ctx1.beginPath()
	//starting position
	ctx1.moveTo(x, y);
	//to the right
	ctx1.lineTo(x + sideLength1, y);
	//down
	ctx1.lineTo(x + sideLength1, y + sideLength1);
	//to the left
	ctx1.lineTo(x , y + sideLength1);
	//completes the rectangle
	ctx1.fill();
}


function getCoordinatesOfBoxAddOnsRotated(listOfOld){
	//figuring out the center of the figure
	xArrrayMax = new Array
	yArrrayMax = new Array
	for(let i = 0;i<listOfOld.length;i++){
		xArrrayMax.push(listOfOld[i][0])
		yArrrayMax.push(listOfOld[i][1])
	}
	//the X and Y specifies the center of the figure which it should rotate around
	x = Math.floor((Math.min(...xArrrayMax) + Math.max(...xArrrayMax)) / 2)
	y = Math.floor((Math.min(...yArrrayMax) + Math.max(...yArrrayMax)) / 2)
	

	var listOfNew = new Array
	var rotatedCoordinates = new Array
	
	//gets the new rotated coordinates
	for(let g = 0; g < listOfOld.length;g++){
		
		coordX1 = listOfOld[g][0] - x
		coordY1 = (listOfOld[g][1] - y)*-1

		coordX = (Math.round(coordX1 * Math.cos(Math.PI/2) - coordY1 * Math.sin(Math.PI/2)))+ x 
		coordY = ((Math.round(coordX1 * Math.sin(Math.PI/2) + coordY1 * Math.cos(Math.PI/2)))*-1) + y
	
		newBlock = new block('yellow',coordX,coordY)	
		listOfNew.push(newBlock)
	}		
	window.figure1.updateNewAddons(listOfNew)
	//set the rotation back to 0 so that the next rotation command will generate the next rotation based
	//on the current rotation
	window.figure1.updateRotation(0)
	return listOfNew
}

//this function calculates the creations of a figure
//this is something that is not normally in a tetris game as those usually has a set number of possible shapes
//this game generates it own based on a random length and random attributes
function calc(value,value2,list){
	var possibleChanges = [sideLength*-1,sideLength,0]
	var lastInList = list[list.length-1]
	var newX = (lastInList.x * sideLength) + possibleChanges[value]
	if(newX==lastInList.x*sideLength){
		value= value2
		if(value==2){
			value = 1
		}else{
			value = 0
		}
		var possibleChanges = [sideLength*-1,sideLength]
		newY = (lastInList.y * sideLength) + possibleChanges[value]
		
		if(newY <=0){
			newY = (lastInList.y * sideLength) + sideLength
		}
		
	}else{
				
		newY = (lastInList.y * sideLength) 
	}
	for(let c = 0;c<list.length;c++){
		
		if(newX==list[c].x*sideLength && newY==list[c].y*sideLength){
			return false
		}
	}
	newPosition = new Array
	newBlock = new block('yellow',newX/sideLength,newY/sideLength)
	window.figure1.listOfAddons.push(newBlock)
	newPosition.push(newX/sideLength,newY/sideLength)
	return newPosition	
}

//this just loops over the length of the figure and creates its shape based on the "calc" function
function getCoordinatesOfBoxAddOns(list){
	listOfAddons = list
	newPositionArray = new Array
	
	
	for(let v =0;v<window.figure1.length;v++){
		
		var newCoordinates = calc(window.figure1.attr[v],window.figure1.attr[v+1],list)
					
		if(newCoordinates == false){
			newCoordinates = calc(window.figure1.attr[v+1],window.figure1.attr[v],list)					
		}
		newPositionArray.push(newCoordinates)

	}
	return newPositionArray
}

//generates a list of attributes that is used to create the figure
function generateShapeList(len){
	shapeList = new Array
	for(let x=0;x<len; x++){
		shapeList.push(Math.floor(Math.random() * 3 ))
	}
	return shapeList

}
//takes a list and fills the coordinatesPlane with the lists's.
function fillInCoordinates(list,color){
	for(let g = 0;g<list.length;g++){
		
		figureX = list[g][0]
		figureY = list[g][1]
		if(figureY>=0){
			coordinatesPlane[figureY][figureX] = color
		}
		
	}
}

//drawing the canvas based on the coordinatesPlane array 
function repaintCanvas(){
	for(let y = 0;y< boardHeight  ;y++){
		for(let x = 0;x<boardWidth ;x++){
			if(!isEmpty(x,y)){
				drawBox(x,y,coordinatesPlane[y][x])
			}
		}
	}
}

//a function to see wether the a line is completed
function checkForWin(){
	let win = false
	let winLine = new Array
	for(let i =0;i<boardHeight;i++){
		length = 0
		//loops through the row to see if all boxes are filled
		for(let g = 0;g<boardWidth;g++){
			if(coordinatesPlane[i][g] != 0){
				length +=1
			}
		}
		//if they are all filled there is a win. But there can be multiple wins so it adds the win row to an array
		if(length >=boardWidth ) {

			win = true
			winLine.push(i)
		}

	}
	if(win){
		for(let o = 0;o<winLine.length;o++){
			score+=20
			document.getElementById('score').innerHTML =score
			coordinatesPlaneDuplicate = [...Array(boardHeight)].map(e => Array(boardWidth).fill(0));
			coordinatesPlane[winLine[o]]=Array(boardWidth).fill(0)

			//this moves everything down one step above the current win row
			for(let y = 0;y<coordinatesPlane.length;y++){
				if(y <=winLine[o] && y+1<=boardHeight){
					
					coordinatesPlaneDuplicate[y+1]= coordinatesPlane[y]
						
				}else{
					coordinatesPlaneDuplicate[y]= coordinatesPlane[y]
				}
			}					

			coordinatesPlane = coordinatesPlaneDuplicate	
		}
	}
}

function play(){
	//initiating function
	document.getElementById('score').innerHTML = score
	gameStatus = 'start'
	interval = window.setInterval(function(){
	    if(gameStatus == 'start'){
	    	animationFall()
	    }else if( gameStatus == 'game over'){
	    	console.log('game over')
	    	clearInterval(interval)
	    }
	}, 1000);			
}

function repeatAnimationTile(){
	if(move('down')){
		cancelAnimationFrame(animationFrameTile);
		repaintCanvas()
		gameStatus = 'start'
		checkForWin()
		return true
		
	}
		
	setTimeout(() => {
	    animationFrameTile = requestAnimationFrame(repeatAnimationTile);
	}, 1000/5);	
}


function animationFall(){
	
	if(coordinatesPlane[0][Math.floor(boardWidth/2)] != 0){
		gameStatus = 'game over'
	}else{
		gameStatus = 'playing'
		randomValue = Math.floor(Math.random() * (7  - 2 + 1) + 2)
		randomList = generateShapeList(randomValue+1)
		
		randomColor = Math.floor(Math.random() * ((availableColors.length-1)  - 1 + 1) + 1)
		window.box1 = new block(randomColor,Math.floor(boardWidth/2),0)

		startYChange =0
		startXChange = 0
		startXLChange = 0

		window.figure1 = new figure(box1,randomValue,randomList)
		figure1.createFigure(randomColor)
		
		requestAnimationFrame(repeatAnimationTile); 				
	}

}


//not my function
function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}
function nestedArrayContainArray(nestedarray,array){
	for(let x=0;x<nestedarray.length;x++){
		if(arrayEquals(nestedarray[x],array)){
			return true
		}
	}
	return false
}

//rotate the current figure
function rotate(){
	//make sure it is not hitting anything
	if(!window.figure1.isHitting() && !window.figure1.isToTheSide('left') && !window.figure1.isToTheSide('right')){
		window.figure1.updateRotation(1)
		repaintCanvas()
		figure1.createFigure()
		repaintCanvas()
	}
	
}

//moves everything down
function move(direction){
	
	ctx1.clearRect(0,0,canvas1.width,canvas1.height)
	
	window.figure1.deleteAddons()

	u = window.figure1.getAddons() 
	repaintCanvas()
	if(direction == 'left'){
		if(window.figure1.isHitting() || window.figure1.isToTheSide('left')){
			
		}else{
			for(i =0;i<u.length;i++){
				u[i].updateCoordinates(u[i].x-1,u[i].y)
			}
		}	
	}else if(direction == 'right'){
		if(window.figure1.isHitting()  || window.figure1.isToTheSide('right')){
			
		}else{
			for(i =0;i<u.length;i++){
				u[i].updateCoordinates(u[i].x+1,u[i].y)
			}
		}
	}else if( direction == 'down'){
		
		if(window.figure1.isHitting()){
			fillInCoordinates(window.figure1.getAddonsCoordinates(),window.figure1.color)
			return true	
		}else{
			for(i =0;i<u.length;i++){
				u[i].updateCoordinates(u[i].x,u[i].y +1)
			}
			
		}
	}
	window.figure1.move()
}



document.addEventListener('keyup', function(event) {
    if(event.code == 'Space') {
    	rotate()
    }else if(event.code == 'ArrowDown') {
        move('down')
    }else if(event.code == 'ArrowRight') {
        move('right')
    }else if(event.code == 'ArrowLeft') {
        move('left')
    }
});

