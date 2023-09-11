var gl;
var trianglePoints = [];
var numOfSubdivisions = 3;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        vec2(-0.4, -0.4),
        vec2(0, 0.4),
        vec2(0.4, -0.4)
    ];

    divideTriangle(vertices[0], vertices[1], vertices[2], numOfSubdivisions, false, 0.6, true);

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(trianglePoints), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render(true, 0);

    trianglePoints = [];
    divideTriangle(vertices[0], vertices[1], vertices[2], numOfSubdivisions, true, -0.3, false);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(trianglePoints), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render(false, 1);
};

// Make a triangle
function triangle(a, b, c, lineFormat) {
    if(lineFormat){
        trianglePoints.push(a, b, c, a);
    } else {
        trianglePoints.push(a, b, c);
    }
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

function translateY(vector, translateAmountY){
    var x = vector[0],
        y = vector[1];

    return [x, y + translateAmountY]
}

function divideTriangle(a, b, c, count, shouldTwist, translateAmountY, lineFormat){
    // Recursion check
    if(count <= 0){
        // Twist it if it should be twisted
        if(shouldTwist){
            a = twist(a);
            b = twist(b);
            c = twist(c);
        }

        if(translateAmountY != 0){
            a = translateY(a, translateAmountY);
            b = translateY(b, translateAmountY);
            c = translateY(c, translateAmountY);
        }

        triangle(a, b, c, lineFormat);
        console.log(trianglePoints);

    } else {
        // Bisect sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        // Make new triangles
        divideTriangle(a, ab, ac, count - 1, shouldTwist, translateAmountY, lineFormat);
        divideTriangle(c, ac, bc, count - 1, shouldTwist, translateAmountY, lineFormat);
        divideTriangle(b, bc, ab, count - 1, shouldTwist, translateAmountY, lineFormat);

        if(lineFormat){

            divideTriangle(ab, bc, ac, count - 1, shouldTwist, translateAmountY, lineFormat);
            divideTriangle(bc, ab, ac, count - 1, shouldTwist, translateAmountY, lineFormat);

        }
    }
}

function render(clear, type) {
    if(clear){
        gl.clear( gl.COLOR_BUFFER_BIT );
    }

    switch (type) {
        case 0:
            gl.drawArrays( gl.LINES, 0, trianglePoints.length);
            break;
        case 1:
            gl.drawArrays( gl.TRIANGLES, 0, trianglePoints.length);
            break;
        case 2:
            gl.drawArrays( gl.TRIANGLE_STRIP, 0, trianglePoints.length);
            break;
        case 3:
            gl.drawArrays( gl.TRIANGLE_FAN, 0, trianglePoints.length);
            break;
        default:
            gl.drawArrays( gl.LINES, 0, trianglePoints.length);
            break;
    }
    
}
