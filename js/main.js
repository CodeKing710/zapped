//Stuff to run prior to pageload
installDeps();
//Initialize Globals for the application within a namespace
let app = {
    data: {
        shop: [{}],
        upgrades: [{}],
        themes: [{}]
    },
    WIDTH:null,
    HEIGHT:null,
    start: function() {
        let game = $("#game","elem")[0];
        this.view = $("#view","elem")[0];
        this.ctx = this.view.getContext('2d');
        this.WIDTH = game.offsetWidth-12;
        this.HEIGHT = game.offsetHeight - $("#gameNav","elem")[0].offsetHeight - 16;
        $("#view").attr('width',this.WIDTH).attr('height',this.HEIGHT);
        this.frame = setInterval(updateGame, 10);
        $('#shop').on('click',shop, false);
        $('#upgrades').on('click',upgrades, false);
        $('#themes').on('click',themes, false);
    },
    clear: function() {this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);},
    pause: function() {this.frame = clearInterval(this.frame);},
    play: function() {this.frame = setInterval(updateGame, 10);},
    drawBolt: function() {
        this.ctx.lineWidth = "10";
        this.ctx.strokeStyle = "#00d4e8";
        this.ctx.fillStyle = "#004d8e";
        this.ctx.beginPath();
        this.ctx.moveTo(this.WIDTH/1.7,this.HEIGHT/10);
        this.ctx.lineTo(this.WIDTH/4,this.HEIGHT/2)
        this.ctx.lineTo(this.WIDTH/2,this.HEIGHT/2.5);
        this.ctx.lineTo(this.WIDTH/3,this.HEIGHT/1.25);
        this.ctx.lineTo(this.WIDTH/1.4,this.HEIGHT/3.5);
        this.ctx.lineTo(this.WIDTH/2.2,this.HEIGHT/2.6);
        this.ctx.lineTo(this.WIDTH/1.7,this.HEIGHT/10);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    }
};
function updateGame() {
    with (app) {
        clear();
        drawBolt();
    }
}
function shop() {}
function upgrades() {}
function themes() {}

//Stuff to run after DOM load
$(function(){
    //Works similar to namespace in C++
    //as in any property or method referenced here will
    //reference the variable containing the object
    //containing the property or method name
    //It's more obvious what the "with" keywords function is once you notice how and what its referencing
    //This also allows for this application to run separate from the other libraries present
    with (app) {
        //Draw lightning bolt onto screen
        start();
        // drawBolt();
    }
})