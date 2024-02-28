class Snake{
    constructor(){
        this.color = 'green'
        this.bordercolor = 'blue'
        this.body = [1] //array of squares
        this.snakesize =15
        this.head = {x:0, y:0}
        this.body[0] = this.head
        this.features = {tonguex:this.snakesize,tonguey:this.snakesize/2-5/2
                        ,lefteyex:this.snakesize/2,lefteyey:0
                        ,righteyex:this.snakesize/2,righteyey:this.snakesize}
    }

    extendSize (x1,y1){
       let newbody = {x:x1,y:y1}
       this.body.unshift(newbody)
    }

    reduceSize(index){
        this.body.splice(index, this.body.length-index)
    }
    draw (){
        const canvas = document.getElementById('background')
        const ctx = canvas.getContext('2d')
        for (let i = 0;i<this.body.length;i++){
            ctx.fillStyle = this.color
            ctx.fillRect(this.body[i].x,this.body[i].y,this.snakesize,this.snakesize)
            ctx.strokeStyle = this.bordercolor
            ctx.strokeRect(this.body[i].x,this.body[i].y,this.snakesize,this.snakesize)
        }
        //draw the tongue
        ctx.fillStyle = 'red'
        ctx.fillRect(this.features.tonguex,this.features.tonguey,5,5)
        //draw the eyes
        ctx.fillStyle = '#ebfae3'
        ctx.beginPath()
        ctx.arc(this.features.righteyex,this.features.righteyey,5,0,Math.PI*2,true)
        ctx.arc(this.features.lefteyex,this.features.lefteyey,5,0,Math.PI*2,true)
        ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.arc(this.features.righteyex,this.features.righteyey,1.5,0,Math.PI*2,true)
        ctx.arc(this.features.lefteyex,this.features.lefteyey,1.5,0,Math.PI*2,true)
        ctx.fill()
    }
    follow(h){
       for (let i = 0;i<this.body.length;i++){
           let swap = {x: this.body[i].x,y:this.body[i].y} 
           this.body[i] = {x:h.x,y:h.y}
           h = swap
       } 
    }
    moveLeft(){
        this.head.x = this.head.x -15
        this.features = {tonguex:this.head.x-5,tonguey:this.head.y+this.snakesize/2-5/2,
                        lefteyex:this.head.x+this.snakesize/2,lefteyey:this.head.y+this.snakesize,
                        righteyex:this.head.x+this.snakesize/2,righteyey:this.head.y}
        this.follow(this.head)
    }
    moveRight(){
        this.head.x = this.head.x +15
        this.features = {tonguex:this.head.x+this.snakesize,tonguey:this.head.y+this.snakesize/2-5/2
                        ,lefteyex:this.head.x+this.snakesize/2,lefteyey:this.head.y
                        ,righteyex:this.head.x+this.snakesize/2,righteyey:this.head.y+this.snakesize}
        this.follow(this.head)
    }
    moveUp(){
        this.head.y = this.head.y-15
        this.features ={tonguex:this.head.x+this.snakesize/2-5/2,tonguey:this.head.y-5
                        ,lefteyex:this.head.x,lefteyey:this.head.y+this.snakesize/2
                        ,righteyex:this.head.x+this.snakesize,righteyey:this.head.y+this.snakesize/2}
        this.follow(this.head)
    }
    moveDown(){
        this.head.y = this.head.y +15
        this.features ={tonguex:this.head.x+this.snakesize/2-5/2,tonguey:this.head.y+this.snakesize
                        ,lefteyex:this.head.x+this.snakesize,lefteyey:this.head.y+this.snakesize/2
                        ,righteyex:this.head.x,righteyey:this.head.y+this.snakesize/2}
        this.follow(this.head)
    }
}

class Food{
    constructor (x1,y1){
        this.size = 15
        this.color = 'yellow'
        this.position = {x:x1,y:y1}
    }
    draw(){
        const canvas = document.getElementById('background')
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x,this.position.y,this.size,this.size)
    }
}

document.addEventListener('DOMContentLoaded',function () {
    const panel = document.getElementById('background')
    let gameloop
    let food
    let snake
    let moveloop
    let direction
    let score 
    let time 

    function paintScore(){
        const toolbar = document.getElementById('toolbar')
        const ctx = toolbar.getContext('2d')
        ctx.fillStyle = 'black'
        ctx.font = '20px sans-serif'
        ctx.textAlign = 'center'
        ctx.clearRect(0, 0, toolbar.width, toolbar.height)
        ctx.fillText(score,toolbar.width/2,toolbar.height/2)
    }
    function repaint () {
        const canvas = document.getElementById('background')
        const ctx = canvas.getContext('2d')
        if (snake.head.x === food.position.x&&snake.head.y === food.position.y){
            snake.extendSize(food.position.x,food.position.y)
            food = FoodGenerator()
            score++
            if (time>50) time = time-5
        }
        if (collision()){
            gameloop = clearInterval(gameloop)
            moveloop = clearInterval(moveloop)
            direction = ''
            ctx.fillStyle = 'black'
            ctx.font = '20px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('GAME OVER!',canvas.width/2,canvas.height/2)
            ctx.font = '15px sans-serif'
            ctx.fillText('Score: '+score,canvas.width/2,canvas.height/2+20)
            button.style.display = 'block'
            return
        } 
        let bite = BiteItself()
        if (bite !== undefined){
            snake.reduceSize(bite)
            score = snake.body.length-1
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        snake.draw()
        food.draw()
        paintScore()
    }
    
    function FoodGenerator(){
        let randomx = 15*Math.floor(Math.random()
                    *(+(panel.width/15)-1 - +0)) + +0
        let randomy = 15*Math.floor(Math.random()
                    *(+(panel.height/15)-1 - +0)) + +0
        let randomfood = new Food(randomx,randomy)
        return randomfood
    }

    function StartGame(){
        food = FoodGenerator()
        snake = new Snake()
        score = 0
        time = 150
        gameloop = setInterval(repaint,50)
        moveloop = clearInterval(moveloop)
        panel.focus()
    }

    function collision(){
        if(snake.head.x<0||snake.head.x>panel.width-15
            ||snake.head.y<0||snake.head.y>panel.height-15) return true
    }

    function BiteItself(){
        for (let i = 2; i<snake.body.length;i++){
            if (snake.head.x===snake.body[i].x&&snake.head.y===snake.body[i].y)
                return i
        }
        return undefined
    }
    let button = document.getElementById('btn')
    button.addEventListener('click', event =>{
        button.style.display = 'none'
        StartGame()
    })        
    panel.addEventListener('keydown', (event) => {
        const keyname = event.key
        if (keyname === 'ArrowRight'&&direction !== 'l'){
            direction = 'r'
            moveloop = clearInterval(moveloop)
            moveloop = setInterval(function(){snake.moveRight()},time)
        }
        if (keyname === 'ArrowLeft'&&direction !== 'r'){
            direction = 'l'
            moveloop = clearInterval(moveloop)
            moveloop = setInterval(function(){snake.moveLeft()},time)
        }
        if (keyname === 'ArrowUp'&&direction !== 'd'){
            direction = 'u'
            moveloop = clearInterval(moveloop)
            moveloop = setInterval(function(){snake.moveUp()},time)
        }
        if (keyname === 'ArrowDown'&&direction !== 'u'){
            direction = 'd'
            moveloop = clearInterval(moveloop)
            moveloop = setInterval(function(){snake.moveDown()},time)
        }  
    })
})

