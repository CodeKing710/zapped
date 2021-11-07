class Interval {
    //Accepts a callback and a time in ms to reoccur
    //Doesn't use setInterval for various reasons
    constructor(cb, ms) {
        this.cb = cb;
        this.time = ms;
        this.worker = null;
    }
    start() {
        this.worker = new Worker(`./js/interval.js?ms=${this.time}`);
        this.worker.onmessage = this.cb;
    }
    stop() {
        this.worker.terminate();
    }
}
let app = {
    fps: (1000/60), //1000ms divided by desired frames per second yields the time per frame required to achieve said fps
    data: {
        shop: [{}],
        upgrades: [{}],
        themes: [{}],
        stats: {
            totalEnergy: 0, //Total energy player has
            energyPerSecond: 0.1, //Amount of energy made every second
            energyPerClick: 0.5,
            orderOfMagnitude: 1 //Counter for when numbers are too large to display
        }
    },
    WIDTH:null,
    HEIGHT:null,
    frame: new Interval(updateGame, this.fps),
    eps: new Interval(function() {handleScore(app.data.stats.energyPerSecond)}, 1000),
    start: function() {
        //Grab game containers
        let game = $("#game","elem")[0];
        this.view = $("#view","elem")[0];
        this.ctx = this.view.getContext('2d');
        
        //Set variables based on screen size
        this.WIDTH = game.offsetWidth-12;
        this.HEIGHT = game.offsetHeight - $("#gameNav","elem")[0].offsetHeight - 16;
        $("#view").attr('width',this.WIDTH).attr('height',this.HEIGHT);

        //Start the game interval counters
        this.play();

        //Bind game nav buttons
        $('#shop').bind('click',function(){showShop()});
        $('#upgrade').bind('click',function(){showUpgrades()});
        $('#theme').bind('click',function(){showThemes()});

        //Save current theme colors (for reskins later)
        this.theme = {
            bg: getComputedStyle(document.body).getPropertyValue('--bg-color-'),
            color: getComputedStyle(document.body).getPropertyValue('--color-')
        };

        //Assign click event handler for the only clickable canvas element
        $("#view").on('click',function(e){app.smallBolt(e)},function(e){app.bigBolt(e,1.01);});
    },
    clear: function() {this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);},
    pause: function() {
        this.frame.stop();
        this.eps.stop();
    },
    play: function() {
        this.frame.start();
        this.eps.start();
    },
    bigBolt: function(e, scale=1, noInc = false) {
        if(e != null) {
            e.preventDefault();
        }
        this.ctx.scale(scale, scale);
        this.ctx.lineWidth = "5";
        this.ctx.strokeStyle = this.theme.color;
        this.ctx.fillStyle = this.theme.bg;
        let boltPts = [
            {
                x: this.WIDTH/1.7,
                y:this.HEIGHT/10
            },
            {
                x: this.WIDTH/4,
                y: this.HEIGHT/2
            },
            {
                x: this.WIDTH/2,
                y: this.HEIGHT/2.5
            },
            {
                x: this.WIDTH/3,
                y: this.HEIGHT/1.25
            },
            {
                x: this.WIDTH/1.4,
                y: this.HEIGHT/3.5
            },{
                x: this.WIDTH/2.2,
                y: this.HEIGHT/2.6
            },
            {
                x: this.WIDTH/1.7,
                y: this.HEIGHT/10
            }
        ];
        let bolt = new Component(0,0,this.WIDTH,this.HEIGHT,"poly",boltPts);
        bolt.shape.outline(this.ctx);
        this.ctx.stroke();
        this.ctx.fill();

        if(!noInc)
            handleScore(this.data.stats.energyPerClick);
    },
    smallBolt: function(e) {
        this.bigBolt(e, 0.99);
    },
    updateScore: function() {
        this.ctx.fillStyle = this.theme.color;
        let scoreText = new Component(this.WIDTH/1.18,this.HEIGHT/30, "20px", "Consolas", "text",`E: \$${this.data.stats.totalEnergy.toFixed(1)}`);
        scoreText.draw(this.ctx);
    }
};
//Include a self reference
app.self = app;
//Factory for creating drawing objects with hitboxes
class Component {
    constructor(x = 0, y = 0, w = 0, h = 0, type = "poly", datapoints = []) {
        this.type = type; //Supported types: text, rect, sq, tri, circ, poly, and path
        this.width = w; this.height = h;
        this.vx = 0; this.vy = 0; this.x = x; this.y = y;

        switch(this.type) {
            case "poly":
                this.shape = new Shape(datapoints);
            break;
            case "text":
                this.text = datapoints;
            break;
        }
    }
    draw(ctx, stroke = "#000", fill = "#000") {
        switch(this.type) {
            case "text":
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = fill;
                ctx.strokeStyle = stroke;
                ctx.fillText(this.text, this.x, this.y);
                
            break;
        }
    }
}

//Defines drawing parameters for a component
//Points are relative to the origin
//Doesn't draw the shape just outlines where the stroke would go
class Shape {
    constructor(points = []) {
        this.points = points;
    }
    outline(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
    }
}

function updateGame() {
    with (app) {
        clear();
        bigBolt(null, 1, true);
        updateScore();
    }
}
function handleScore(num, inc = true) {
    if(inc)
        app.data.stats.totalEnergy += num;
    else
        app.data.stats.totalEnergy -= num;

    // console.log(app.data.stats.totalEnergy);
}