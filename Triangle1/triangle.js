
var gl;
var points = [];
var numOfSubdivisions = 5;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    divideTriangle(vertices[0], vertices[1], vertices[3], numOfSubdivisions);

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

// Make a triangle
function triangle(a, b, c) {
    points.push(a, b, c);
}

function twist(vector){
    var angleValue = 100;
    var angle = angleValue * Math.PI * 180;

    var x = vector[0],
        y = vector[1],
        d = Math.sqrt(x * x + y * y),
        sinAngle = Math.sin(d * angle),
        cosAngle = Math.cos(d * angle);

    return [x * cosAngle - y * sinAngle, x * sinAngle + y * cosAngle]
}

function divideTriangle(a, b, c, count){
    // Recursion check
    if(count === 0){
        triangle(a, b, c);
    } else {
        // Bisect sides
        var ab_side = mix(a, b, 0.5);
        var ac_side = mix(a, c, 0.5);
        var bc_side = mix(b, c, 0.5);
        count--;

        // Make new triangles
        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(c, ac, bc, count - 1);
        divideTriangle(b, bc, ab, count - 1);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
}
