/*Hard Set Variables for the entire code operation*/

var canvas;
var ctx;
var MaxCircles = 5;
var humans = []
var towers = []
var per_click_push = 4;
var tower_radius = 100;
var place_towers = true;
var place_people = false;
var show_tower_conns = true;
var existing_ids = []
var background = new Image();

background.src = "./tukbg.png";

/*main looping function for the Canvas frames*/
function main() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    var frame = function() {
        draw();
        update();
        window.requestAnimationFrame(frame, canvas);

    };
    window.requestAnimationFrame(frame, canvas);
}

/*Human Object Code*/
function Humans() {
    this.id = makeid(10)
    while (existing_ids.includes(this.id)) {
        this.id = makeid(10)
    }
    existing_ids.push(this.id)

    this.size = 4;
    this.x = 0;
    this.y = 0;
    this.xSpeed = 0
    this.ySpeed = 0
    this.color = 'white';
    this.animation_speed = this.arc_alpha / tower_radius
    this.human_conns = []
    this.tower_conns = []
}

/*Tower Object Code*/
function Towers() {
    this.id = makeid(10)
    while (existing_ids.includes(this.id)) {
        this.id = makeid(10)
    }
    existing_ids.push(this.id)

    this.size = 8;
    this.x = 0;
    this.y = 0;
    this.color = '#de1028';
    this.arc_animation = 8
    this.arc_alpha = 0.3
    this.animation_speed = this.arc_alpha / tower_radius
    this.human_conns = []
    this.tower_conns = []
}



main();


/*Draw Function used for drawing the frames of the canvas each time its refreshed*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    if (show_tower_conns == true) {
        drawTowerLinks();
    }
    drawConnections();
    drawHumans();
    animate_towers();
}

/*update function that is called recursively by the Canvas Code, called in the fram drawing*/
function update() {
    updateCircles();
}

/*this is the function that expands that beeping red circle in the tower radius*/
function updateCircles() {
    for (i = 0; i < humans.length; i++) {
        humans[i].x += humans[i].xSpeed;
        humans[i].y += humans[i].ySpeed;

        if (humans[i].x + humans[i].size > canvas.width) { // if the x component of particle makes it leave the canvas
            humans[i].x = canvas.width - humans[i].size; // puts particle within canvas
            humans[i].xSpeed = -humans[i].xSpeed; // reverses x component of speed of Atom
        }
        if (humans[i].x < humans[i].size) {
            humans[i].x = humans[i].size;
            humans[i].xSpeed = -humans[i].xSpeed;
        }
        if (humans[i].y + humans[i].size > canvas.height) {
            humans[i].y = canvas.height - humans[i].size;
            humans[i].ySpeed = -humans[i].ySpeed;
        }
        if (humans[i].y < humans[i].size) {
            humans[i].y = humans[i].size;
            humans[i].ySpeed = -humans[i].ySpeed;
        }
    }
}

/*Function that draws the towers and their beeping red animation*/
function animate_towers() {
    for (i = 0; i < towers.length; i++) {
        ctx.beginPath();
        ctx.arc(towers[i].x, towers[i].y, towers[i].size, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#de1028';
        ctx.fill();

        towers[i].arc_alpha -= towers[i].animation_speed
        towers[i].arc_animation += 1
        if (towers[i].arc_alpha > 0) {
            ctx.beginPath();
            ctx.arc(towers[i].x, towers[i].y, towers[i].arc_animation, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(222, 16, 40,' + towers[i].arc_alpha + ')';
            ctx.fill();
        } else {
            towers[i].arc_alpha = 0.3
            towers[i].arc_animation = towers[i].size

        }

    }
}

/*this is the function that draws the humans in the network when they are moving*/
function drawHumans() {
    for (j = 0; j < humans.length; j++) {
        ctx.beginPath();
        ctx.arc(humans[j].x, humans[j].y, humans[j].size, 0, 2 * Math.PI, false);
        ctx.fillStyle = humans[j].color;
        ctx.fill();
    }
}

/*a recursive function used to calculate the CI of the network*/
function recursive_find(node_neighbors, visited_nodes) {
    node_neighbors.forEach(neighbour => {
        if (!visited_nodes.includes(neighbour.id)) {
            visited_nodes.push(neighbour.id)
            recursive_find(neighbour.tower_conns, visited_nodes)
        } else {
            return visited_nodes
        }
    })
    return visited_nodes
}

/*helper function for calculating CI*/
function calculate_length(node) {
    visited_nodes = []
    visited_nodes = recursive_find(node.tower_conns, visited_nodes)
    return visited_nodes
}

/*function elements for calculating CI*/
function calculate_ci() {
    total_conns = 0
    towers.forEach(node => {
        visisted_nodes = calculate_length(node)
        if (visisted_nodes.includes(node.id)) {
            index = visisted_nodes.indexOf(node.id)
            if (index !== -1) {
                visisted_nodes.splice(index, 1);

            }
        }
        total_conns += visisted_nodes.length
    })
    return ((total_conns) / (towers.length * (towers.length - 1)))
}

/*This is the code used to draw the connection between towers themselves*/
function drawTowerLinks() {
    for (i = 0; i < towers.length; i++) {
        for (j = 0; j < towers.length; j++) {
            if (i == j) {
                continue
            } else {
                var dis = Math.sqrt(Math.pow((towers[i].x - towers[j].x), 2) + Math.pow((towers[i].y - towers[j].y), 2));
                if (dis <= tower_radius) {
                    if (!towers[i].tower_conns.includes(towers[j])) {
                        towers[i].tower_conns.push(towers[j])
                        towers[j].tower_conns.push(towers[i])
                    }
                    width = 1
                    ctx.beginPath();
                    ctx.moveTo(towers[j].x, towers[j].y);
                    ctx.lineTo(towers[i].x, towers[i].y);
                    ctx.strokeStyle = 'rgba(247, 133, 72, 0.5)';
                    ctx.lineWidth = width;
                    ctx.stroke();
                } else {
                    if (towers[i].tower_conns.includes(towers[j])) {
                        index = towers[i].tower_conns.indexOf(towers[j])
                        index2 = towers[j].tower_conns.indexOf(towers[i])
                        if (index !== -1) {
                            towers[i].tower_conns.splice(index, 1);

                        }
                        if (index2 !== -1) {
                            towers[j].tower_conns.splice(index2, 1);
                        }

                    }
                }

            }
        }
    }
}


/*Canvas Interactive code for drawing connections between towers and the people in the network*/
function drawConnections() {
    for (i = 0; i < towers.length; i++) {
        for (j = 0; j < humans.length; j++) {
            var dis = Math.sqrt(Math.pow((towers[i].x - humans[j].x), 2) + Math.pow((towers[i].y - humans[j].y), 2));
            if (dis < tower_radius) {
                var width;
                if (dis > (tower_radius * 0.9)) {
                    width = tower_radius / (dis * dis);
                } else if (dis > (tower_radius * 0.5)) {
                    width = tower_radius / (dis * 2);
                } else {
                    width = 1;
                }
                ctx.beginPath();
                ctx.moveTo(humans[j].x, humans[j].y);
                ctx.lineTo(towers[i].x, towers[i].y);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = width;
                ctx.stroke();
            }
        }
    }
}

/*All The DOM Elements gotten as javascript variables*/
tower_checker = document.getElementById("tower_check")
tower_checker.checked = true
people_checker = document.getElementById("people_check")
people_checker.checked = false
tower_range = document.getElementById("towerRange")
tower_range.value = 100
range_viewer = document.getElementById("currentRange")
reset_button = document.getElementById("resetNetwork")
tower_show = document.getElementById("tower_show")
tower_show.checked = true
connectivity_index = document.getElementById("currentCI")
ci_button = document.getElementById("ciButton")

/*Function for grabbing the mouse position when clicked*/
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/*function for calculating the CI*/
function update_ci() {
    connectivity_index.innerHTML = calculate_ci()
}

/*Generates a unique ID for the tower to be placed and makes sure that the ID doesn't exist before*/
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


/* All The event listners are added below this comment*/

/*This is the function that allows us to place new towers on the map*/
canvas.addEventListener('click', function(evt) {
    if (place_towers == true) {
        var mousePos = getMousePos(canvas, evt);
        var new_tower = new Towers();
        new_tower.x = mousePos.x;
        new_tower.y = mousePos.y;
        towers.push(
            new_tower
        )
    }
})


/* This is the function that allows us to add new 4 people per click to the network map*/
canvas.addEventListener('click', function(evt) {
    if (place_people == true) {
        var mousePos = getMousePos(canvas, evt);
        for (i = 0; i < per_click_push; i++) {
            var dot = new Humans();
            dot.x = mousePos.x;
            dot.y = mousePos.y;
            dot.xSpeed = (Math.random() - Math.random());
            dot.ySpeed = (Math.random() - Math.random());
            humans.push(dot)
        }
    }

}, false);

/*This function updates the connectivity index of the network*/
ci_button.addEventListener('click', (event) => {
    update_ci()
})

/*This is the function that resets the entire network*/
reset_button.addEventListener('click', (event) => {
    towers = []
    humans = []
})

/*This is the function that enables or disables the connection showing between networks*/
tower_show.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        show_tower_conns = true
    } else {
        show_tower_conns = false
    }
})

/*This is the function that allows us to change the radius of the network*/
tower_range.addEventListener('change', (event) => {
    tower_radius = tower_range.value;
    range_viewer.innerHTML = tower_radius
    for (i = 0; i < towers.length; i++) {
        towers[i].animation_speed = 0.3 / tower_radius
    }
})

/*This function allows us to switch between weather to place the towers or people, selecting appropriate flags*/
tower_checker.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        people_checker.checked = false
        place_people = false
        place_towers = true
    } else {
        place_towers = false
    }
})

/*This function allows us to switch between weather to place the towers or people, selecting appropriate flags*/
people_checker.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        tower_checker.checked = false
        place_towers = false
        place_people = true
    } else {
        place_people = false
    }
})