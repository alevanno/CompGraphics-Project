var canvas;
var gl = null;
// Two handles, one for each shaders' couple. 1 = goureaud; 0 = phong
// We decided to use only phong shader
var	shaderProgram = new Array(2);
	
var shaderDir = "http://127.0.0.1/CompGraphics-Project/shaders/";	
var modelsDir = "http://127.0.0.1/CompGraphics-Project/models/";
	
var perspectiveMatrix,viewMatrix;

//FOR CAMERA SPACE
var normalMatrixPositionHandle;
var lightDirMatrixPositionHandle;
var lightPosMatrixPositionHandle;
var lightDirMatrix;
var lightPosMatrix;

var vertexNormalHandle = new Array(2);
var vertexPositionHandle = new Array(2);
var vertexUVHandle = new Array(2);
var textureFileHandle = new Array(2);
var textureInfluenceHandle = new Array(2);
var ambientLightInfluenceHandle = new Array(2);
var ambientLightColorHandle = new Array(2);

var matrixPositionHandle = new Array(2);
var	materialDiffColorHandle = new Array(2);

// Handle for every light direction
var lightDirectionHandle1 = new Array(2);
var lightDirectionHandle2 = new Array(2);
var lightDirectionHandle3 = new Array(2);
var lightDirectionHandle4 = new Array(2);
var lightDirectionHandle5 = new Array(2);
var lightDirectionHandle6 = new Array(2);
var lightDirectionHandle7 = new Array(2);
var lightDirectionHandle8 = new Array(2);

// Handle for every light position
var lightPositionHandle1 = new Array(2);
var lightPositionHandle2 = new Array(2);
var lightPositionHandle3 = new Array(2);
var lightPositionHandle4 = new Array(2);
var lightPositionHandle5 = new Array(2);
var lightPositionHandle6 = new Array(2);
var lightPositionHandle7 = new Array(2);
var lightPositionHandle8 = new Array(2);

var lightColorHandle  = new Array(2);
var lightTypeHandle = new Array(2);
var	eyePositionHandle = new Array(2);
var materialSpecColorHandle = new Array(2);
var materialSpecPowerHandle  = new Array(2);
var objectSpecularPower = 20.0;

// Parameters for light definition (directional light)
// With 90-90 bulb effect
var dirLightAlpha = -utils.degToRad(70);
var dirLightBeta  = -utils.degToRad(100);
var dirLightAlpha1 = -utils.degToRad(290);


var lightDirection = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
					  Math.sin(dirLightAlpha),
					  Math.cos(dirLightAlpha) * Math.sin(dirLightBeta),
                      ];
var lightDirection1 = [ Math.cos(dirLightAlpha1) * Math.cos(dirLightBeta),
                        Math.sin(dirLightAlpha1),
                        Math.cos(dirLightAlpha1) * Math.sin(dirLightBeta),
                    ];

var lightPosition = [[-5.95, 1.3, -1.3], [-3.9, 1.3, -1.3], [-1.7, 1.3, -1.3], [0.3, 1.3, -1.3],
                    [0.3, 0.9, -1.3], [-1.7, 0.9, -1.3], [-3.6, 0.9, -1.3], [-5.95, 0.9, -1.3]];	

var lightColor = new Float32Array([1.0, 1.0, 0.866, 0.6]);

var sceneObjects; //total number of nodes 
// The following arrays have sceneObjects as dimension.	
var vertexBufferObjectId= new Array();
var indexBufferObjectId = new Array();
var objectWorldMatrix = new Array();
var projectionMatrix = new Array();
//for camera space
var worldViewMatrix = new Array();
var normalMatrix = new Array();
//Back to default
var facesNumber		= new Array();
var diffuseColor 	= new Array();	//diffuse material colors of objs
var specularColor   = new Array();	
var diffuseTextureObj 	= new Array();	//Texture material
var nTexture 		= new Array();	//Number of textures per object				

//Parameters for Camera (10/13/36) - -20.-20
var cx = 1.1;
var cy = -0.1;
var cz = -1.2;
var elevation = -90.0;
//That angle give us the visual as state in our
//notes on the 90° angle, so we are tecnically at 270°
var angle = 90.0;

var delta = 0.1;
var mult = 50.0;

// Eye parameters;

var observerPositionObj = new Array();
var lightDirection1Obj = new Array();
var lightDirection2Obj = new Array();
var lightDirection3Obj = new Array();
var lightDirection4Obj = new Array();
var lightDirection5Obj = new Array();
var lightDirection6Obj = new Array();
var lightDirection7Obj = new Array();
var lightDirection8Obj = new Array();

var lightPositionObj1 = new Array();
var lightPositionObj2 = new Array();
var lightPositionObj3 = new Array();
var lightPositionObj4 = new Array();
var lightPositionObj5 = new Array();
var lightPositionObj6 = new Array();
var lightPositionObj7 = new Array();
var lightPositionObj8 = new Array();

var currentLightType = 4;         
var currentShader = 0;                //Defines the current shader in use.
var textureInfluence = 1.0;
var ambientLightInfluence = 0.4;
//I valori sono in rgba (ultimo valore alpha)
var ambientLightColor = [1.0, 1.0, 1.0, 0.5];


function main(){


	canvas=document.getElementById("c");
	
	try{
		//get Canvas without alpha channel
		gl = canvas.getContext("webgl2", {alpha: false});
	}catch(e){
		 console.log(e);
	}
	if(gl){
		
		//Setting the size for the canvas equal to half the browser window
        //and other useful parameters
        utils.resizeCanvasToDisplaySize(canvas);
		var w=canvas.clientWidth;
        var h=canvas.clientHeight;
        //Default settings
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);
        gl.enable(gl.DEPTH_TEST);
        //In case we want to have a larger/different vision see here (fov-y,ecc.)
		perspectiveMatrix = utils.MakePerspective(60, w/h, 0.1, 100.0);

		//Open the json file containing the 3D model to load,
		//parse it to retreive objects' data
		//and creates the VBO and IBO from them
		//The vertex format is (x,y,z,nx,ny,nz,u,v)
        loadModel("emptyRoom.json");
        
        //loadModel('chair.json');

		
		//Load shaders' code
		//compile them
		//retrieve the handles
		loadShaders();
		
		//Setting up the interaction using keys
		initInteraction();

		//Rendering cycle
        drawScene();

		
	}else{
		alert( "Error: Your browser does not appear to support WebGL.");
	}
	
}




function loadModel(modelName){

    utils.get_json(modelsDir + modelName, function(loadedModel){
            
        sceneObjects = loadedModel.meshes.length;

            //preparing to store objects' world matrix & the lights & material properties per object 
            for (i=0; i < sceneObjects; i++) {
                objectWorldMatrix[i] = new utils.identityMatrix();
                projectionMatrix[i] =  new utils.identityMatrix();
                //For camera spaec
                worldViewMatrix[i] = new utils.identityMatrix();
                normalMatrix[i] = new utils.identityMatrix();
                //Back to default
                diffuseColor[i] = [1.0, 1.0, 1.0, 1.0];	
                specularColor[i] = [1.0, 1.0, 1.0, 1.0];	
                observerPositionObj[i] = new Array(3);		
                lightDirection1Obj[i] = new Array(3);
                lightDirection2Obj[i] = new Array(3);
                lightDirection3Obj[i] = new Array(3);
                lightDirection4Obj[i] = new Array(3);
                lightDirection5Obj[i] = new Array(3);
                lightDirection6Obj[i] = new Array(3);
                lightDirection7Obj[i] = new Array(3);
                lightDirection8Obj[i] = new Array(3);
                //TODO: Istanziare per ogni nuovo array
                lightPositionObj1[i] = new Array(3);	
                lightPositionObj2[i] = new Array(3);	
                lightPositionObj3[i] = new Array(3);	
                lightPositionObj4[i] = new Array(3);
                lightPositionObj5[i] = new Array(3);	
                lightPositionObj6[i] = new Array(3);
                lightPositionObj7[i] = new Array(3);	
                lightPositionObj8[i] = new Array(3);			
		
            }

            for (i=0; i < sceneObjects ; i++) { 

                
                //Creating the vertex data.
                var meshMatIndex = loadedModel.meshes[i].materialindex;
                
                var UVFileNamePropertyIndex = -1;
                var diffuseColorPropertyIndex = -1;
                var specularColorPropertyIndex = -1;
                for (n = 0; n < loadedModel.materials[meshMatIndex].properties.length; n++){
                    if(loadedModel.materials[meshMatIndex].properties[n].key == "$tex.file") UVFileNamePropertyIndex = n;
                    if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.diffuse") diffuseColorPropertyIndex = n;
                    if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.specular") specularColorPropertyIndex = n;
                }
                
                //Getting vertex and normals					
                var objVertex = [];
                //retrieval of meshes index, normal index, UV index							   
                for (n = 0; n < loadedModel.meshes[i].vertices.length/3; n++){
                    //console.log(loadedModel.meshes[i].vertices.length);
                    // Loading triangles in objVertex
                    objVertex.push(loadedModel.meshes[i].vertices[n*3], 
                        loadedModel.meshes[i].vertices[n*3+1],
                        loadedModel.meshes[i].vertices[n*3+2]);
                    objVertex.push(loadedModel.meshes[i].normals[n*3], 
                        loadedModel.meshes[i].normals[n*3+1],
                        loadedModel.meshes[i].normals[n*3+2]);	
                        //if(UVFileNamePropertyIndex>=0){
                            //console.log(objVertex);
                            //objVertex.push( loadedModel.meshes[i].texturecoords[0][n*2],
                                //loadedModel.meshes[i].texturecoords[0][n*2+1]);
                                
                        //} else {
                    if (modelName === 'emptyRoom.json') {
                        //back wall i=0 z= 2.19
                        //front wall i=2 z= -2.24
                        if (i===0 || i===2) {
                            objVertex.push( loadedModel.meshes[i].vertices[n*3+2],
                                    loadedModel.meshes[i].vertices[n*3+1] );
                        }
                        //i=1 x= 1.95
                        else if (i===1 || i===3) {
                            objVertex.push( loadedModel.meshes[i].vertices[n*3],
                                    loadedModel.meshes[i].vertices[n*3+1] );
                        }
                        //floor i=4 y= -1.924
                        else{
                            objVertex.push( loadedModel.meshes[i].vertices[n*3],
                                    loadedModel.meshes[i].vertices[n*3+2] );
                        }

                    }
                    else {
                        if (UVFileNamePropertyIndex >= 0) {
                            objVertex.push( loadedModel.meshes[i].texturecoords[0][n*2],
                                loadedModel.meshes[i].texturecoords[0][n*2+1]);
                        }
                    }

                        
                }
                            
                facesNumber[i] = loadedModel.meshes[i].faces.length;
		
                //Only if the sceneObject have an UV mapping for its property
                if(UVFileNamePropertyIndex>=0){
                    
                    nTexture[i]=true;
                    
                    var imageName = loadedModel.materials[meshMatIndex].properties[UVFileNamePropertyIndex].value;
                    
                    var getTexture = function(image_URL){


                        var image=new Image();
                        image.webglTexture=false;
                        
                        requestCORSIfNotSameOrigin(image, image_URL);

                        image.onload=function(e) {

                            var texture=gl.createTexture();
                            
                            gl.bindTexture(gl.TEXTURE_2D, texture);
                            
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                            gl.generateMipmap(gl.TEXTURE_2D);
                            
                            gl.bindTexture(gl.TEXTURE_2D, null);
                            image.webglTexture=texture;
                        };
                        
                        image.src=image_URL;

                        return image;
                        };
                        
                        diffuseTextureObj[i] = getTexture(modelsDir + imageName);
                
                } else { 
                    nTexture[i] = false;
                }
                
                //mesh color, where:
                // diffuse value
                diffuseColor[i] = loadedModel.materials[meshMatIndex].properties[diffuseColorPropertyIndex].value; 
                // Alpha value added
                diffuseColor[i].push(1.0);	
                // speculare value
                specularColor[i] = loadedModel.materials[meshMatIndex].properties[specularColorPropertyIndex].value;
                //vertices, normals and UV set 1
                //BINDBUFFER
                vertexBufferObjectId[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectId[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objVertex), gl.STATIC_DRAW);
                         
                //Creating index buffer
                facesData = [];				 
                for (n = 0; n < loadedModel.meshes[i].faces.length; n++){
    
                    facesData.push( loadedModel.meshes[i].faces[n][0],
                                    loadedModel.meshes[i].faces[n][1],
                                    loadedModel.meshes[i].faces[n][2]
                                    );
                }
                
                indexBufferObjectId[i]=gl.createBuffer ();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectId[i]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(facesData),gl.STATIC_DRAW);
                          
            
                //creating the objects' world matrix
                objectWorldMatrix[i] = loadedModel.rootnode.children[i].transformation;
                
                //Correcting the orientation
                objectWorldMatrix[i] = utils.multiplyMatrices(
                                        objectWorldMatrix[i],
                                        utils.MakeRotateXMatrix(-90));
                                        
            } 
        });
}

var room = [[-5.1,-0.7,-6.8,0.9], [-3.5,-0.7,-4.7,0.9], [-5.95,0.9,-6.4,1.3], [-5.1,1.3,-6.8,3.0],
            [-4.7,-0.4,-5.1,0.05], [-3.0,-0.7,-4.7,0.9], [-2.7,-0.4,-3.0,0.05], [1.1,-0.7,-0.6,0.9],
            [-0.6,-0.4,-1.0,0.05], [-1.0,-0.7,-2.7,0.9], [0.7,0.9,0.25,1.3], [1.1,1.3,-0.6,3.0],
            [-0.6,1.65,-1.0,2.1], [-1.0,1.3,-2.7,3.0], [-2.7,1.65,-3.0,2.1], [-3.0,1.3,-4.7,3.0],
            [-4.7,1.65,-5.1,2.1]];
function collision(x, y) {
    
    var inRoom = false;
    var i;
    for (i=0; i<room.length; i++) {
        minX = Math.min(room[i][0], room[i][2]);
        maxX = Math.max(room[i][0], room[i][2]);
        minY = Math.min(room[i][1], room[i][3]);
        maxY = Math.max(room[i][1], room[i][3]);
        if (x>=minX && x<=maxX && y>=minY && y<=maxY) {
            inRoom = true;
            break;
        }
    }
    return inRoom;
}

var paintZone = [[-0.6,-0.7,1.1,0.5], [-1.7,-0.7,-1.0,0.5], [-2.7,-0.7,-1.72,0.5], [-4.0,-0.7,-3.0,0.5], [-6.7,-0.7,-5.5,0.5],
                [-5.5,1.5,-6.7,3.0], [-3.85,1.5,-4.7,3.0], [-3.0,1.5,-3.84,3.0], [-1.72,1.5,-2.7,3.0], [-1.0,1.5,-1.71,3.0], [0.8,1.5,-0.4,3.0]];
function popup(x, y) {
    var inZone = false;
    var i;
    var j;
    for (i=0; i<paintZone.length; i++) {
        minX = Math.min(paintZone[i][0], paintZone[i][2]);
        maxX = Math.max(paintZone[i][0], paintZone[i][2]);
        minY = Math.min(paintZone[i][1], paintZone[i][3]);
        maxY = Math.max(paintZone[i][1], paintZone[i][3]);
        if (x>=minX && x<=maxX && y>=minY && y<=maxY) {
            
            inZone = true;
            j = i + sceneObjects - 11;
            break;
        }
    }
    return [inZone, j];
}



function loadShaders() {

    utils.loadFiles([shaderDir + 'vs_p.glsl',
    shaderDir + 'fs_p.glsl',
    shaderDir + 'vs_g.glsl',
    shaderDir + 'fs_g.glsl'
    ],
        function (shaderText) {
            // odd numbers are VSs, even are FSs
            var numShader = 0;
            for (i = 0; i < shaderText.length; i += 2) {
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertexShader, shaderText[i]);
                gl.compileShader(vertexShader);
                if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                    alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(vertexShader));
                }
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragmentShader, shaderText[i + 1]);
                gl.compileShader(fragmentShader);
                if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                    alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(fragmentShader));
                }
                shaderProgram[numShader] = gl.createProgram();
                gl.attachShader(shaderProgram[numShader], vertexShader);
                gl.attachShader(shaderProgram[numShader], fragmentShader);
                gl.linkProgram(shaderProgram[numShader]);
                if (!gl.getProgramParameter(shaderProgram[numShader], gl.LINK_STATUS)) {
                    alert("Unable to initialize the shader program...");
                }
                numShader++;
            }

        });

    //Getting the handles to the shaders' vars

    for (i = 0; i < 2; i++) {
        //Retrieve information
        vertexPositionHandle[i] = gl.getAttribLocation(shaderProgram[i], 'inPosition');
        vertexNormalHandle[i] = gl.getAttribLocation(shaderProgram[i], 'inNormal');
        vertexUVHandle[i] = gl.getAttribLocation(shaderProgram[i], 'inUVs');

        matrixPositionHandle[i] = gl.getUniformLocation(shaderProgram[i], 'wvpMatrix');

        materialDiffColorHandle[i] = gl.getUniformLocation(shaderProgram[i], 'mDiffColor');
        materialSpecColorHandle[i] = gl.getUniformLocation(shaderProgram[i], 'mSpecColor');
        materialSpecPowerHandle[i] = gl.getUniformLocation(shaderProgram[i], 'mSpecPower');
        textureFileHandle[i] = gl.getUniformLocation(shaderProgram[i], 'textureFile');

        textureInfluenceHandle[i] = gl.getUniformLocation(shaderProgram[i], 'textureInfluence');
        ambientLightInfluenceHandle[i] = gl.getUniformLocation(shaderProgram[i], 'ambientLightInfluence');
        ambientLightColorHandle[i] = gl.getUniformLocation(shaderProgram[i], 'ambientLightColor');

        eyePositionHandle[i] = gl.getUniformLocation(shaderProgram[i], 'eyePosition');

        lightDirectionHandle1[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection1');
        lightDirectionHandle2[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection2');
        lightDirectionHandle3[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection3');
        lightDirectionHandle4[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection4');
        lightDirectionHandle5[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection5');
        lightDirectionHandle6[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection6');
        lightDirectionHandle7[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection7');
        lightDirectionHandle8[i] = gl.getUniformLocation(shaderProgram[i], 'lightDirection8');
        lightPositionHandle1[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition1');
        lightPositionHandle2[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition2');
        lightPositionHandle3[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition3');
        lightPositionHandle4[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition4');
        lightPositionHandle5[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition5');
        lightPositionHandle6[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition6');
        lightPositionHandle7[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition7');
        lightPositionHandle8[i] = gl.getUniformLocation(shaderProgram[i], 'lightPosition8');
        lightColorHandle[i] = gl.getUniformLocation(shaderProgram[i], 'lightColor');
        lightTypeHandle[i] = gl.getUniformLocation(shaderProgram[i], 'lightType');
        //for camera space
        normalMatrixPositionHandle = gl.getUniformLocation(shaderProgram[0], 'nMatrix');
        lightDirMatrixPositionHandle = gl.getUniformLocation(shaderProgram[0], 'lightDirMatrix');
        lightPosMatrixPositionHandle = gl.getUniformLocation(shaderProgram[0], 'lightPosMatrix');

    }

}






function initInteraction(){
    var keyFunction =function(e) {
        switch(e.keyCode) {
            case 65:	// A
            if (collision(cx+Math.sin(utils.degToRad(angle-90.0))*delta, cy+Math.cos(utils.degToRad(angle-90.0))*delta)){
                cx+=Math.sin(utils.degToRad(angle-90.0))*delta;
                cy+=Math.cos(utils.degToRad(angle-90.0))*delta;
            }
            break;
            case 68:	// D
            if (collision(cx+Math.sin(utils.degToRad(angle+90.0))*delta, cy+Math.cos(utils.degToRad(angle+90.0))*delta)){
                cx+=Math.sin(utils.degToRad(angle+90.0))*delta;
                cy+=Math.cos(utils.degToRad(angle+90.0))*delta;
            }
            break;
            case 38:	// Up arrow
            if (collision(cx-Math.sin(utils.degToRad(angle))*delta, cy-Math.cos(utils.degToRad(angle))*delta)){
                cx-=Math.sin(utils.degToRad(angle))*delta;
                cy-=Math.cos(utils.degToRad(angle))*delta;
            }
            break;
            case 40:	// Down arrow
            if (collision(cx+Math.sin(utils.degToRad(angle))*delta, cy+Math.cos(utils.degToRad(angle))*delta)){
                cx+=Math.sin(utils.degToRad(angle))*delta;
                cy+=Math.cos(utils.degToRad(angle))*delta;
            }
            break;
            
            case 37:	// Left arrow
                angle+=delta * mult;
                break;
            case 39:	// Right arrow
                angle-=delta * mult;
                    break;
            case 87:	// W
                if (elevation+delta*mult <= -65) elevation+=delta * mult;
                break;
            case 83:	// S
                if (elevation+delta*mult >= -115) elevation-=delta * mult;
                break;
        }
    }
    
    window.addEventListener("keydown", keyFunction, false);
}

function computeMatrices(){
    viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
    //FOR CAMERA SPACE
    lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));
    lightPosMatrix = utils.invertMatrix((viewMatrix));

	var eyeTemp = [cx, cy, cz];

	
	for(i=0; i < sceneObjects; i++){
        //mod. for camera space
		worldViewMatrix[i] = utils.multiplyMatrices(viewMatrix, objectWorldMatrix[i]);
        projectionMatrix[i] = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix[i]);
        normalMatrix[i] = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix[i]));
		
		lightDirection1Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection1); 
		lightDirection2Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection1); 
        lightDirection3Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection1); 
        lightDirection4Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection1); 
        lightDirection5Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        lightDirection6Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        lightDirection7Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        lightDirection8Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        
        lightPositionObj1[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[0]);
        lightPositionObj2[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[1]);
        lightPositionObj3[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[2]);
        lightPositionObj4[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[3]);
        lightPositionObj5[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[4]);
        lightPositionObj6[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[5]);
        lightPositionObj7[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[6]);
        lightPositionObj8[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[7]);

		observerPositionObj[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), eyeTemp); 
	}
	
}

function drawScene(){
		
    computeMatrices();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(shaderProgram[currentShader]);
    

    //ALT
    for (i = 0; i < sceneObjects; i++) {
        fillBuffer(i);
    }

    /*
    // To implement the pop up, we add the objects to the buffer only when necessary
    for(i=0; i < sceneObjects; i++){
        flag = popup(cx, cy);
        if (i < sceneObjects - 11) fillBuffer(i);
        if (i >= sceneObjects -11 && flag[0] == true && flag[1] == i) fillBuffer(i);
    }
    */
    
    window.requestAnimationFrame(drawScene);
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
}

function fillBuffer(i) {
    gl.uniformMatrix4fv(matrixPositionHandle[currentShader], gl.FALSE, utils.transposeMatrix(projectionMatrix[i]));		
        
    gl.uniform1f(textureInfluenceHandle[currentShader], textureInfluence);
    gl.uniform1f(ambientLightInfluenceHandle[currentShader], ambientLightInfluence);	
    
    gl.uniform1i(textureFileHandle[currentShader], 0);		//Texture channel 0 used for diff txt
    if (nTexture[i]==true && diffuseTextureObj[i].webglTexture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, diffuseTextureObj[i].webglTexture);
    } 
    
    //FOR CAMERA SPACE
    gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix[i]));
    gl.uniformMatrix4fv(lightDirMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(lightDirMatrix));
    gl.uniformMatrix4fv(lightPosMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(lightPosMatrix));

    gl.uniform4f(lightColorHandle[currentShader], lightColor[0],
                                                lightColor[1],
                                                lightColor[2],
                                                lightColor[3]);
    gl.uniform4f(materialDiffColorHandle[currentShader], diffuseColor[i][0],
                                                        diffuseColor[i][1],
                                                        diffuseColor[i][2],
                                                        diffuseColor[i][3]);
                                        
    gl.uniform4f(materialSpecColorHandle[currentShader], specularColor[i][0],
                                                        specularColor[i][1],
                                                        specularColor[i][2],
                                                        specularColor[i][3]);
    gl.uniform4f(ambientLightColorHandle[currentShader], ambientLightColor[0],
                                                        ambientLightColor[1],
                                                        ambientLightColor[2],
                                                        ambientLightColor[3]);
            
    gl.uniform1f(materialSpecPowerHandle[currentShader], objectSpecularPower);
    
                                        
    gl.uniform3f(lightDirectionHandle1[currentShader], lightDirection1Obj[i][0],
                                                    lightDirection1Obj[i][1],
                                                    lightDirection1Obj[i][2]);

    gl.uniform3f(lightDirectionHandle2[currentShader], lightDirection2Obj[i][0],
                                                    lightDirection2Obj[i][1],
                                                    lightDirection2Obj[i][2]);

    gl.uniform3f(lightDirectionHandle3[currentShader], lightDirection3Obj[i][0],
                                                    lightDirection3Obj[i][1],
                                                    lightDirection3Obj[i][2]);	
                                                    
    gl.uniform3f(lightDirectionHandle4[currentShader], lightDirection4Obj[i][0],
                                                    lightDirection4Obj[i][1],
                                                    lightDirection4Obj[i][2]);	

    gl.uniform3f(lightDirectionHandle5[currentShader], lightDirection5Obj[i][0],
                                                    lightDirection5Obj[i][1],
                                                    lightDirection5Obj[i][2]);

    gl.uniform3f(lightDirectionHandle6[currentShader], lightDirection6Obj[i][0],
                                                    lightDirection6Obj[i][1],
                                                    lightDirection6Obj[i][2]);

    gl.uniform3f(lightDirectionHandle7[currentShader], lightDirection7Obj[i][0],
                                                    lightDirection7Obj[i][1],
                                                    lightDirection7Obj[i][2]);

    gl.uniform3f(lightDirectionHandle8[currentShader], lightDirection8Obj[i][0],
                                                    lightDirection8Obj[i][1],
                                                    lightDirection8Obj[i][2]);

    gl.uniform3f(lightPositionHandle1[currentShader], lightPositionObj1[i][0],
                                                    lightPositionObj1[i][1],
                                                    lightPositionObj1[i][2]);
    gl.uniform3f(lightPositionHandle2[currentShader], lightPositionObj2[i][0],
                                                    lightPositionObj2[i][1],
                                                    lightPositionObj2[i][2]);
    gl.uniform3f(lightPositionHandle3[currentShader], lightPositionObj3[i][0],
                                                    lightPositionObj3[i][1],
                                                    lightPositionObj3[i][2]);
    gl.uniform3f(lightPositionHandle4[currentShader], lightPositionObj4[i][0],
                                                    lightPositionObj4[i][1],
                                                    lightPositionObj4[i][2]);
    gl.uniform3f(lightPositionHandle5[currentShader], lightPositionObj5[i][0],
                                                    lightPositionObj5[i][1],
                                                    lightPositionObj5[i][2]);
    gl.uniform3f(lightPositionHandle6[currentShader], lightPositionObj6[i][0],
                                                    lightPositionObj6[i][1],
                                                    lightPositionObj6[i][2]);
    gl.uniform3f(lightPositionHandle7[currentShader], lightPositionObj7[i][0],
                                                    lightPositionObj7[i][1],
                                                    lightPositionObj7[i][2]);
    gl.uniform3f(lightPositionHandle8[currentShader], lightPositionObj8[i][0],
                                                    lightPositionObj8[i][1],
                                                    lightPositionObj8[i][2]);
    
    gl.uniform1i(lightTypeHandle[currentShader], currentLightType);

    gl.uniform3f(eyePositionHandle[currentShader],	observerPositionObj[i][0],
                                                    observerPositionObj[i][1],
                                                    observerPositionObj[i][2]);
    
                                                        
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectId[i]);	
    
    gl.enableVertexAttribArray(vertexPositionHandle[currentShader]);
    gl.vertexAttribPointer(vertexPositionHandle[currentShader], 3, gl.FLOAT, gl.FALSE, 4 * 8, 0);
    
    gl.enableVertexAttribArray(vertexNormalHandle[currentShader]);
    gl.vertexAttribPointer(vertexNormalHandle[currentShader], 3, gl.FLOAT, gl.FALSE, 4 * 8, 4 * 3);	

    gl.vertexAttribPointer(vertexUVHandle[currentShader], 2, gl.FLOAT, gl.FALSE, 4*8, 4*6);                   
    gl.enableVertexAttribArray(vertexUVHandle[currentShader]);			
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectId[i]);
    gl.drawElements(gl.TRIANGLES, facesNumber[i] * 3, gl.UNSIGNED_SHORT, 0);
    
    gl.disableVertexAttribArray(vertexPositionHandle[currentShader]);
    gl.disableVertexAttribArray(vertexNormalHandle[currentShader]);
  }