var grid;
var w = 40;
var rows = 600/w;
var cols = 600/w;
var current;
var stack = [];
var path = [];
var blocked = [];
var completed = false;
var lost = false;
var paused = false;
var play = false;
var checked = [];
var player;
var enemy;
var previous;

function make2DArray(rows,cols){
    var arr = new Array(rows);
    for(var i=0;i<arr.length;i++){
        arr[i] = new Array(cols);    
    }
    return arr;
}

function setup(){
    createCanvas(600,600);

    grid = make2DArray(rows,rows);
    for(var i=0;i<rows;i++){
        for(var j=0;j<rows;j++){
            grid[i][j] = new Cell(i,j);   
        }  
    }
    
    current = grid[rows-1][0];
    player = grid[0][0];
    enemy = grid[rows-1][cols-1];
}

function draw(){
    background(0);
    if(!play){
        var txt = "MAZE RUNNER";
        var txt2 = "Reach the green spot at the\nopposite end and avoid the blue enemy."
        var txt3 = "PRESS 'ENTER'";
       
        textSize(50);
        fill(255,100,40);
        text(txt,100,50);
        textSize(30);
        fill(100,200,150);
        text(txt2,20,150);
        text(txt3,200,400);
    }
    if(play){
        for(var i=0;i<rows;i++){
            for(var j=0;j<rows;j++){
                grid[i][j].show();
                grid[i][j].generate(); 
            }  
        }
    
        fill(0,255,0);
        noStroke();
        rect((rows-1)*w,(rows-1)*w,w,w);
    
        if(lost){
            background(0);
            fill(255,0,0);
            textSize(50);
            text("YOU LOST\ncreated by Ak#",170,200);
            noLoop();
        }
        if(player == grid[rows-1][cols-1]){
            background(0);
            fill(0,0,255);
            textSize(50);
            text("YOU WON !!!\ncreated by Ak#",170,200);
            noLoop();
        }
        if(paused){  
        textSize(30);
        text("PAUSED\n",50,50);     
        }
    }
}

function e(){
    if(!paused && play){
        grid[enemy.i][enemy.j].enem();  
    }
}
var t = setInterval(e,275);
if(paused){
    clearInterval(t);
}

function keyPressed(){
    
    if(keyCode === UP_ARROW){
        for(var i=0;i<rows;i++){
            for(var j=0;j<cols;j++){
                grid[i][j].move(0,1);
            }
        }
    }
    
    if(keyCode === DOWN_ARROW){
        for(var i=rows-1;i>=0;i--){
            for(var j=cols-1;j>=0;j--){    
                grid[i][j].move(0,-1);
            }
        }
    }
    
    if(keyCode === RIGHT_ARROW){
         for(var i=rows-1;i>=0;i--){
            for(var j=cols-1;j>=0;j--){ 
                grid[i][j].move(1,0);            
            }
        }
    }
    
    if(keyCode === LEFT_ARROW){
       for(var i=0;i<rows;i++){
            for(var j=0;j<cols;j++){           
                grid[i][j].move(-1,0);          
            }
        }
    }
    
    if(keyCode == 13){
        if(!play){
        play = true;
        }
    }
    
    if(keyCode == 27){
        if(!paused){
            paused = true;
            noLoop();
        }
        else{
            paused = false;
            loop();
        }
    }

    return false;
}

function Cell(i,j){
    this.i = i;
    this.j = j;
    this.walls = [true,true]; 
    
    this.show = function(){
        var x = this.i*w;
        var y = this.j*w;
        if(checked.includes(grid[this.i][this.j])){
            fill(50);
            noStroke();
            rect(x,y,w,w);
        }
        if(current == grid[this.i][this.j] && current != grid[rows-1][0]){
            fill(200);
            noStroke();
            rect(x,y,w,w);
        }
        
        stroke(255,0,0);
        strokeWeight(5.5);
        if(this.walls[1])
            line(x,y,x,y+w);
        if(this.walls[0])
            line(x,y,x+w,y);
        if(completed && player == grid[this.i][this.j]){
            fill(200);
            noStroke();
            rect(x,y,w,w);
        }
        if(completed && enemy == grid[this.i][this.j]){
            fill(0,250,250);
            noStroke();
            rect(x,y,w,w);
        }
    }

    this.checkNeighbors = function(m,n){
        var neighbors = [];
        for(var x = -1;x<=1;++x){
            var i = m+x;
            if(i<0 || i>=rows)continue;
            if(!checked.includes(grid[i][n])){
                neighbors.push(grid[i][n]);
            }
        }
        for(var y = -1;y<=1;++y){
            var j = n+y;
            if(j<0 || j>=rows)continue;
            if(!checked.includes(grid[m][j])){
                neighbors.push(grid[m][j]);
            }
        }    
    return neighbors;
}
    
    this.generate = function(){
        if(current == grid[this.i][this.j]){
            if(this.checkNeighbors(this.i,this.j).length>0){
                next = random(this.checkNeighbors(this.i,this.j));
                this.removeWalls(current,next);
                checked.push(current);
                stack.push(current);
                current = next;
            }
            else if(stack.length>0){
                current = stack.pop();
            }
            else
                completed = true;
        }   
    }
    
    this.removeWalls = function(a,b){
        if(a.i-b.i == 1)
            a.walls[1] = false;
        if(a.i-b.i == -1)
            b.walls[1] = false;
        if(a.j-b.j == 1)
            a.walls[0] = false;
        if(a.j-b.j == -1)
            b.walls[0] = false;
    }
    
    this.move = function(x,y){
        if(player == grid[this.i][this.j]){
            var i = this.i + x;
            var j = this.j - y;
            if(i >= 0 && i < rows && j >= 0 && j < cols){
                if(x === 1 && !grid[i][this.j].walls[1])
                   player = grid[i][this.j];
                if(x === -1 && !grid[this.i][this.j].walls[1])
                   player = grid[i][this.j];
                if(y === 1 && !grid[this.i][this.j].walls[0])
                   player = grid[this.i][j];
                if(y === -1 && !grid[this.i][j].walls[0])
                   player = grid[this.i][j];
            }
        }   
    }
    
    this.enemyNeighbors = function(m,n){
        var neighbors = [];
        
        for(var x = -1;x<=1;++x){
            var i = m+x;
            
            if(i<0 || i>=rows || x == 0)continue;
            
            if(!blocked.includes(grid[i][n]) && previous != grid[i][n]){
                if(x === 1 && !grid[i][n].walls[1])
                    neighbors.push(grid[i][n]);
                
                if(x === -1 && !grid[m][n].walls[1])
                    neighbors.push(grid[i][n]);
            }
        }
        
        for(var y = -1;y<=1;++y){
            var j = n+y;
            
            if(j<0 || j>=rows || y == 0)continue;
            
            if(!blocked.includes(grid[m][j]) && previous != grid[m][j]){
                if(y === -1 && !grid[m][n].walls[0])
                    neighbors.push(grid[m][j]);
                
                if(y === 1 && !grid[m][j].walls[0])
                    neighbors.push(grid[m][j]);
            }
        }    
    return neighbors;
}
    
    this.enem = function(){
        var least = Infinity;
        var next;
        var d;
        
        if(enemy == grid[this.i][this.j] && completed && player != enemy){
            var neighbors = this.enemyNeighbors(this.i,this.j);
            
            if(neighbors.length>0){
                for(k = 0;k<neighbors.length;k++){
                    d = abs(player.i-neighbors[k].i) + abs(player.j-neighbors[k].j);
                    if(d<least){
                        least = d;
                        next = neighbors[k];
                    }
                }
                
                previous = enemy;
                if(neighbors.length == 1)
                    blocked.push(enemy); 
                path.push(enemy);
                enemy = next;               
            }
            else{
                blocked.push(enemy);
                previous = enemy;
                enemy = path.pop();   
            }
            if(blocked.includes(player)){
                for(var i =0;i<blocked.length;i++){
                    if(blocked[i] == player)
                        blocked.splice(i,1);
                }
            }
        }
        else if(player == enemy)
            lost = true;
    }
}