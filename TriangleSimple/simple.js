var gl;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices_1 = [
        vec2(-0.4, -0.4),
        vec2(0, 0.3),
        vec2(0.4, -0.4)
    ];

    let translateAmountY = 0.6;
    let rotateAmount = 10;

    var vertices_2 = [
        twist(vertices_1[0]),
        twist(vertices_1[1]),
        twist(vertices_1[2])
    ]

    vertices_2 = [
        translateY(vertices_2[0], -translateAmountY + 0.2),
        translateY(vertices_2[1], -translateAmountY + 0.2),
        translateY(vertices_2[2], -translateAmountY + 0.2)
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
    gl.drawArrays( gl.LINE_LOOP, 0, 3);

    // 2nd load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices_2), gl.STATIC_DRAW);

    // 2nd Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Second draw
    gl.drawArrays( gl.TRIANGLES, 0, 3);
};

function translateY(vector, translateAmountY){
    var x = vector[0],
        y = vector[1]

    return [x, y + translateAmountY]
}

function twist(vector){
    var angle = 100;

    var x = vector[0],
        y = vector[1];

    var d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) * (angle * Math.PI / 180.0);

    var sinAngle = Math.sin(d),
        cosAngle = Math.cos(d);

    var ax = ((x * cosAngle) - (y * sinAngle));
    var ay = ((x * sinAngle) + (y * cosAngle));

    return [ax, ay];
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3);
}
