var gl;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    /* var vertices_1 = [
        vec2(-0.4, -0.9),
        vec2(0, -0.2),
        vec2(0.4, -0.9)
    ]; */

    var vertices_1 = [
        vec2(-0.4, -0.4),
        vec2(0, 0.4),
        vec2(0.4, -0.4)
    ];

    let translateAmountY = 0.6

    var vertices_2 = [
        translateY(vertices_1[0], -translateAmountY),
        translateY(vertices_1[1], -translateAmountY),
        translateY(vertices_1[2], -translateAmountY)
    ];

    vertices_1 = [
        translateY(vertices_1[0], translateAmountY),
        translateY(vertices_1[1], translateAmountY),
        translateY(vertices_1[2], translateAmountY)
    ]

    

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices_1), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // First draw
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices_2), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawArrays( gl.TRIANGLES, 0, 3);

    // render();
};

function translateY(vector, translateAmountY){
    var x = vector[0],
        y = vector[1]

    return [x, y + translateAmountY]
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

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3);
}