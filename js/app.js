class Interval {
    //Accepts a callback and a time in ms to reoccur
    //Doesn't use setInterval for various reasons
    constructor(cb, ms, ...args) {
        this.cb = cb;
        this.time = ms;
        this.worker = null;
        this.args = args;
    }
    start() {
        if(this.worker == null) {
            this.worker = new Worker(`./js/interval.js?ms=${this.time}&cb=${this.cb.name}(${this.args.toString()})`);

            this.worker.onmessage = function(e) {eval(e.data)};
        }
    }
    stop() {
        this.worker.terminate();
    }
}
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
var app = {
    fps: (1000/60), //1000ms divided by desired frames per second yields the time per frame required to achieve said fps
    data: {
        shop: [
            {
                displayName: "Shop Item",
                name: "item1",
                desc: "This is where the item will be described and this could be super long or super short it doesn't really matter it just needs to describe whatever the upgrade or item does and how much you can have or maybe that won't be shown we will see I'm just trying to make this a super long description for no reason whatsoever.",
                cost: 0,
                qty: 0,
                max: 100,
                epsMul: 1,
                epcMul: 1,
                costMul: 1.1,
                done: false
            }
        ],
        upgrades: [
            {
                displayName: "",
                name: "",
                desc: "",
                cost: 0,
                multiplier: 1,
                done: false
            }
        ],
        themes: [
            {
                theme: "mainTheme",
                bg: "#004d8e",
                color: "#00d4e8"
            },
            {
                theme: "heatwaveTheme",
                bg: "#a73500",
                color: "#fa5500"
            }
        ]
    },
    stats: {
        totalEnergy: Number(0), //Total energy player has
        energyPerSecond: Number(0.1), //Amount of energy made every second
        energyPerClick: Number(0.5),
        earningRate: Number(1000),
        orderOfMagnitude: Number(1) //Counter for when numbers are too large to display
    },
    WIDTH:null,
    HEIGHT:null,
    init: true,
    start: function() {
        //Grab game containers
        let game = $("#game","elem")[0];
        this.view = $("#view","elem")[0];
        this.ctx = this.view.getContext('2d');
        
        //Set variables based on screen size
        this.WIDTH = game.offsetWidth-12;
        this.HEIGHT = game.offsetHeight - $("#gameNav","elem")[0].offsetHeight - 16;
        $("#view").attr('width',this.WIDTH).attr('height',this.HEIGHT);
        $(".modal").css('width',`${this.WIDTH-10}px`).css('height',`${this.HEIGHT-10}px`);

        //Start the game interval counters
        this.play();

        //Bind game nav buttons
        $('#shop').on('click',function(){showShop()});
        $('#upgrade').on('click',function(){showUpgrades()});
        $('#theme').on('click',function(){showThemes()});

        //Save current theme colors (for reskins later)
        this.theme = {
            bg: getComputedStyle(document.body).getPropertyValue('--bg-color-'),
            color: getComputedStyle(document.body).getPropertyValue('--color-')
        };

        //Assign click event handler for the only clickable canvas element
        $("#view").on('click',function(e){app.smallBolt(e)},function(e){app.bigBolt(e,1.01);});

        //Fix modal positions
        if(this.init) {
            $('.modal').css('top',`${view.offsetTop+16}px`).css('left',`${view.offsetLeft-4.5}px`);
            this.init = false;
        } else {
            $('.modal').css('top',`${view.offsetTop-5}px`).css('left',`${view.offsetLeft-5}px`);
        }

        //Append datasets to respective modals
        createList("shop");
        createList("upgrade");
        createList("theme");

        //Fix game if page resizes
        window.onresize = () => {
            app.start();
        }
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
            changeScore(this.stats.energyPerClick);
    },
    smallBolt: function(e) {
        this.bigBolt(e, 0.99);
    }
};
//Link up frame interval info to app
app.frame = new Interval(updateGame, app.fps)
app.eps = new Interval(changeScore, app.stats.earningRate, app.stats.energyPerSecond)

//External from app object for event listeners
function updateGame() {
    with (app) {
        clear();
        bigBolt(null, 1, true);
        updateScore();
    }
}
function changeScore(num, inc = true) {
    if(inc)
        app.stats.totalEnergy += num;
    else
        app.stats.totalEnergy -= num;

    // console.log(app.stats.totalEnergy);
}
function updateScore() {
    let [te, eps, cer] = ["#totalEnergy", "#earningRate", "#clickRate"];
    if(app.stats.totalEnergy <= 1000)
        $(te).text(`Zaps: ${app.stats.totalEnergy.toFixed(1)}`);
    else
        $(te).text(`Zaps: ${app.stats.totalEnergy.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`);
    $(eps).text(`E.Gen/s: ${app.stats.energyPerSecond}`);
    $(cer).text(`E.Gen/click: ${app.stats.energyPerClick}`);

    //update eps dynamically for now
    if(app.eps.args != app.stats.energyPerSecond) {
        app.eps.stop();
        app.eps.args = app.stats.energyPerSecond;
        app.eps.start();
    }
}