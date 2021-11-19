var canvas = null;
var ctx = null;
var imgClo = null;

var paths = [];
var selection = [];

var bb = [];

function load(target, img_path, bounding_boxes)
{
    bb = JSON.parse(bounding_boxes)['bb']
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    draw(img_path);
}

function draw(img_path){
 
    imgClo = new Image();
    imgClo.src = img_path;
    
    imgClo.addEventListener('load', function(){
        ctx.drawImage(imgClo , 0, 0, 500, 500);
        initialize();
    },false);
}

function initialize()
{
    for(var i = 0 ; i < bb.length ; i++)
    {
        tmpPath = new Path2D();
        tmpPath.rect(bb[i][0], bb[i][1], bb[i][2], bb[i][3]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255,0,0,1)";
        ctx.stroke(tmpPath);
        selection.push(true);
        paths.push(tmpPath);
    }
}

function update()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgClo , 0, 0, 500, 500);

    for(var i = 0 ; i < paths.length ; i++)
    {
        if(selection[i] == false) ctx.strokeStyle = "rgba(255,0,0,0.15)";
        else ctx.strokeStyle = "rgba(255,0,0,1)"

        ctx.stroke(paths[i]);
    }
}

function clickCanvas(event)
{
    var x = event.pageX;
    var y = event.pageY;
    for(var i = 0 ; i < paths.length ; i++)
    {
        if(ctx.isPointInPath(paths[i], x, y))
        {
            selection[i] = !selection[i];
            update();
            break;
        }
    }
    console.log(selection);
}

function doFunction(image_path){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/result", true);
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4)
        {
            image_arr = image_path.split("/")
            window.location.href="/result?image="+image_arr[image_arr.length - 1];
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "selection": selection,
        "origin_path": image_path
    }));
}