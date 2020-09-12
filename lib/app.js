var canvas;
var gl = null;
// Two handles, one for each shaders' couple. 1 = goureaud; 0 = phong
// This project only uses phong shader
var	shaderProgram
	
var shaderDir = "http://127.0.0.1/CompGraphics-Project/shaders/";	
var modelsDir = "http://127.0.0.1/CompGraphics-Project/models/";
	
var perspectiveMatrix,viewMatrix;

// FOR CAMERA SPACE
var normalMatrixPositionHandle;
var lightDirMatrixPositionHandle;
var lightPosMatrixPositionHandle;
var lightDirMatrix;
var lightPosMatrix;

var vertexNormalHandle
var vertexPositionHandle
var vertexUVHandle
var textureFileHandle
var textureInfluenceHandle
var ambientLightInfluenceHandle
var ambientLightColorHandle

var matrixPositionHandle
var	materialDiffColorHandle

// Handle for every light direction
var lightDirectionHandle1
var lightDirectionHandle2
var lightDirectionHandle3
var lightDirectionHandle4
var lightDirectionHandle5
var lightDirectionHandle6
var lightDirectionHandle7
var lightDirectionHandle8

// Handle for every light position
var lightPositionHandle1
var lightPositionHandle2
var lightPositionHandle3
var lightPositionHandle4
var lightPositionHandle5
var lightPositionHandle6
var lightPositionHandle7
var lightPositionHandle8

var lightColorHandle 
var lightTypeHandle
var	eyePositionHandle
var materialSpecColorHandle
var materialSpecPowerHandle 
var objectSpecularPower = 20.0;

// Parameters for light definition
var dirLightAlpha = -utils.degToRad(0); 
var dirLightBeta  = -utils.degToRad(0); 
var dirLightAlpha1 = -utils.degToRad(180);
var dirLightAlpha2 = -utils.degToRad(0);
var dirLightBeta2 = -utils.degToRad(90);


var lightDirection = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
					  Math.sin(dirLightAlpha),
					  Math.cos(dirLightAlpha) * Math.sin(dirLightBeta),
                      ];
var lightDirection1 = [ Math.cos(dirLightAlpha1) * Math.cos(dirLightBeta),
                        Math.sin(dirLightAlpha1),
                        Math.cos(dirLightAlpha1) * Math.sin(dirLightBeta),
                    ];
var lightDirection2 = [ Math.cos(dirLightAlpha2) * Math.cos(dirLightBeta2),
                        Math.sin(dirLightAlpha2),
                        Math.cos(dirLightAlpha2) * Math.sin(dirLightBeta2),
                    ];

//var room = [[-3.6, -3.2, 3.6, 3.2]]

// 1st 4 lights use lightdirection1
// 2nd 4 lights use lightDirection

//[7.0, 0.0, -1.0]

var lightPosition = [[-1.8, 0.0, -2.2], [10,10,10],

                    [10, 10, 10], [10,10,10], // [0.0, 3.2, -2.2]

                    [-1,0,-1], [10.0, 10.0, 10.0],
                    [10.0, 10.0, 10.0], [10.0, 10.0, 10.0]];	

var lightColor = new Float32Array([1.0, 1.0, 0.866, 0.6]);

var sceneObjects = 0; //total number of nodes 
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

// Parameters for CAMERA
var cx = 2.0; // depth
var cy = 0.0; // left-right
var cz = -1.0; // height

// elevation angle
var elevation = -90.0;

// left-right angle (90° angle, tecnically at 270°)
var angle = 90.0;

// movement increments
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

var currentLightType = 4;         //spot light
var currentShader = 0;            //Defines the current shader in use.
var textureInfluence = 1.0;
var ambientLightInfluence = 0.6;
// RGBA value
var ambientLightColor = [1.0, 1.0, 1.0, 0.5];

// Objects indexing
// 0-3 -> walls
// 4 -> floor
// 5 -> sofa
// 6 -> bed
// 7 -> chair
// 8-12 -> closet
// 13 -> sofa2
// 14 -> chair2
// 15 -> chair3
// 16-21 -> plant
// 22 -> topiary
// 23 -> topiary
// 24-29 -> plant
// 30 -> bed
// 31-32 -> table
var roomObj0 = 0;
var roomObj1 = 1;
var roomObj2 = 2;
var roomObj3 = 3;
var roomObj4 = 4;
var sofaObj = 5;
var bedObj = 6;
var chairObj = 7;
var closetObj10 = 8;
var closetObj11 = 9;
var closetObj12 = 10;
var closetObj13 = 11;
var closetObj14 = 12;
var sofaObj2 = 13;
var chairObj2 = 14;
var chairObj3 = 15;
var plant10 = 16;
var plant11 = 17;
var plant12 = 18;
var plant13 = 19;
var plant14 = 20;
var plant15 = 21;
var topiary1 = 22;
var topiary2 = 23;
var plant20 = 24;
var plant21 = 25;
var plant22 = 26;
var plant23 = 27;
var plant24 = 28;
var plant25 = 29;
var bedObj2 = 30;
var woodtable10 = 31;
var woodtable11 = 32;
var potPlant11 = 33;
var potPlant12 = 34; // pot
var closetObj20 = 35;
var closetObj21 = 36;
var closetObj22 = 37;
var closetObj23 = 38;
var closetObj24 = 39;
var poster1 = 40;
var poster2 = 41;



var getTexture;



function main(){


	canvas=document.getElementById("c");
	
	try{
		// get Canvas without alpha channel
		gl = canvas.getContext("webgl2", {alpha: false});
	}catch(e){
		 console.log(e);
	}
	if(gl){
		// Setting canvas size
        utils.resizeCanvasToDisplaySize(canvas);
		var w=canvas.clientWidth;
        var h=canvas.clientHeight;
        // Default settings
		gl.clearColor(0.5, 0.5, 0.5, 1.0);
		gl.viewport(0.0, 0.0, w, h);
        gl.enable(gl.DEPTH_TEST);
        // In case we want to have a larger/different vision see here (fov-y,ecc.)
		perspectiveMatrix = utils.MakePerspective(65, w/h, 0.1, 100.0);

		//Open the json file containing the 3D model to load,
		//parse it to retrieve objects' data
		//and creates the VBO and IBO from them
		//The vertex format is (x,y,z,nx,ny,nz,u,v)
        loadModel('emptyRoom.json');
        
        loadModel('sofa2.json');
        
        loadModel('bed.json');

        loadModel('chair.json');

        loadModel('closet.json');

        loadModel('sofa2.json');

        loadModel('chair.json');

        loadModel('chair.json');

        loadModel('plant.json');

        loadModel('topiary.json');
        
        loadModel('topiary.json');

        loadModel('plant.json');

        loadModel('bed.json')

        loadModel('woodtable.json');

        loadModel('potPlant.json');

        loadModel('closet.json');

        loadModel('rectangle.json');

        loadModel('rectangle.json');

        
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

        var currSceneObject = loadedModel.meshes.length;
            
        for (i=0; i < currSceneObject ; i++) { 

            objectWorldMatrix[sceneObjects] = new utils.identityMatrix();
            projectionMatrix[sceneObjects] = new utils.identityMatrix();
            //For camera spaec
            worldViewMatrix[sceneObjects] = new utils.identityMatrix();
            normalMatrix[sceneObjects] = new utils.identityMatrix();
            //Back to default
            diffuseColor[sceneObjects] = [1.0, 1.0, 1.0, 1.0];
            specularColor[sceneObjects] = [1.0, 1.0, 1.0, 1.0];
            observerPositionObj[sceneObjects] = new Array(3);
            lightDirection1Obj[sceneObjects] = new Array(3);
            lightDirection2Obj[sceneObjects] = new Array(3);
            lightDirection3Obj[sceneObjects] = new Array(3);
            lightDirection4Obj[sceneObjects] = new Array(3);
            lightDirection5Obj[sceneObjects] = new Array(3);
            lightDirection6Obj[sceneObjects] = new Array(3);
            lightDirection7Obj[sceneObjects] = new Array(3);
            lightDirection8Obj[sceneObjects] = new Array(3);
            //TODO: Istanziare per ogni nuovo array
            lightPositionObj1[sceneObjects] = new Array(3);
            lightPositionObj2[sceneObjects] = new Array(3);
            lightPositionObj3[sceneObjects] = new Array(3);
            lightPositionObj4[sceneObjects] = new Array(3);
            lightPositionObj5[sceneObjects] = new Array(3);
            lightPositionObj6[sceneObjects] = new Array(3);
            lightPositionObj7[sceneObjects] = new Array(3);
            lightPositionObj8[sceneObjects] = new Array(3);	

            
            // Creating the vertex data.
            var meshMatIndex = loadedModel.meshes[i].materialindex;
            
            var UVFileNamePropertyIndex = -1;
            var diffuseColorPropertyIndex = -1;
            var specularColorPropertyIndex = -1;
            for (n = 0; n < loadedModel.materials[meshMatIndex].properties.length; n++){
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$tex.file") UVFileNamePropertyIndex = n;
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.diffuse") diffuseColorPropertyIndex = n;
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.specular") specularColorPropertyIndex = n;
            }
            
            // Getting vertex and normals					
            var objVertex = [];
            //retrieval of meshes index, normal index, UV index							   
            for (n = 0; n < loadedModel.meshes[i].vertices.length/3; n++){
                // Loading triangles in objVertex
                objVertex.push(loadedModel.meshes[i].vertices[n*3], 
                    loadedModel.meshes[i].vertices[n*3+1],
                    loadedModel.meshes[i].vertices[n*3+2]);
                objVertex.push(loadedModel.meshes[i].normals[n*3], 
                    loadedModel.meshes[i].normals[n*3+1],
                    loadedModel.meshes[i].normals[n*3+2]);	
                    
                // emptyRoom.json doesn't include UV coordinates
                if (modelName === 'emptyRoom.json') {
                    //back wall i=0 z= 2.19
                    //front wall i=2 z= -2.24
                    if (i===0 || i===2) {
                        objVertex.push( loadedModel.meshes[i].vertices[n*3+2],
                                loadedModel.meshes[i].vertices[n*3+1] );
                    }
                    //lateral walls i=1 x= 1.95
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
                else if (sceneObjects === poster1) {


                    objVertex.push(loadedModel.meshes[i].vertices[n * 3 + 2]/3.2 +0.5,
                        loadedModel.meshes[i].vertices[n * 3 + 1]/3.2+0.1);
                }
                else if (sceneObjects === poster2) {


                    objVertex.push(loadedModel.meshes[i].vertices[n * 3 + 2]/3.8 +0.5,
                        loadedModel.meshes[i].vertices[n * 3 + 1]/3.8+0.14);
                }
                else {
                    if (UVFileNamePropertyIndex >= 0) {
                        objVertex.push( loadedModel.meshes[i].texturecoords[0][n*2],
                            loadedModel.meshes[i].texturecoords[0][n*2+1]);
                    }
                }
                    
            }
                        
            facesNumber[sceneObjects] = loadedModel.meshes[i].faces.length;
    
            // Only if the sceneObject have an UV mapping for its property
            if(UVFileNamePropertyIndex>=0){
                
                nTexture[sceneObjects]=true;
                
                // Texture variants
                switch (sceneObjects) {
                    case sofaObj2:
                        imageName = 'tartan.jpg';
                        break;
                    case chairObj2:
                        imageName = 'chair_celeste.png';
                        break;
                    case chairObj3:
                        imageName = 'chair_beige.png';
                        break;
                    case plant13:
                        imageName = 'plant.jpg'
                        break;
                    case topiary1:
                        imageName = 'topiary_v4.jpg'
                        break;
                    case topiary2:
                        imageName = 'topiary_v2.jpg'
                        break;
                    case woodtable10:
                        imageName = 'Wood_Table_C.png'
                        break;
                    case potPlant11:
                        imageName = 'leaf.png'
                        break;
                    case potPlant12:
                        imageName = 'pot.jpg'
                        break;
                    case bedObj2:
                        imageName = 'bed_teal.png'
                        break;
                    case poster1:
                        imageName = 'nook.jpg'
                        break;
                    case poster2:
                        imageName = 'catalog.jpg'
                        break;
                    default:
                        var imageName = loadedModel.materials[meshMatIndex].properties[UVFileNamePropertyIndex].value;
                        break;

                }
                
                
                getTexture = function(image_URL){


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
                    
                    diffuseTextureObj[sceneObjects] = getTexture(modelsDir + imageName);
            
            } else { 
                nTexture[i] = false;
            }

            // Mesh color, where:
            // Diffuse value
            diffuseColor[sceneObjects] = loadedModel.materials[meshMatIndex].properties[diffuseColorPropertyIndex].value; 
            // alpha value added
            diffuseColor[sceneObjects].push(1.0);	
            // Specular value
            specularColor[sceneObjects] = loadedModel.materials[meshMatIndex].properties[specularColorPropertyIndex].value;
            // vertices, normals and UV set 1
            vertexBufferObjectId[sceneObjects] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectId[sceneObjects]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objVertex), gl.STATIC_DRAW);
                        
            // Creating index buffer
            facesData = [];				 
            for (n = 0; n < loadedModel.meshes[i].faces.length; n++){

                facesData.push( loadedModel.meshes[i].faces[n][0],
                                loadedModel.meshes[i].faces[n][1],
                                loadedModel.meshes[i].faces[n][2]
                                );
            }
            
            indexBufferObjectId[sceneObjects]=gl.createBuffer ();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectId[sceneObjects]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(facesData),gl.STATIC_DRAW);
                        
        
            // Creating the objects' world matrix
            if (loadedModel.rootnode.children) {
                objectWorldMatrix[sceneObjects] = loadedModel.rootnode.children[i].transformation;
            }
            
            // Correcting the orientation
            objectOrientation(objectWorldMatrix, sceneObjects);

            
        
            console.log('finito oggetto ' + sceneObjects);                         
            sceneObjects += 1;
            }
        });
}



function objectOrientation(objectWorldMatrix, sceneObjects) {
    objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
        objectWorldMatrix[sceneObjects],
        utils.MakeRotateXMatrix(-90));

    // translation(width, height, depth)

    switch (sceneObjects) {
        case roomObj0:
        case roomObj1:
        case roomObj2:
        case roomObj3:
        case roomObj4:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(2.0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(0.0, -0.05, 0.0));
            break;
        case sofaObj: // sofa
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.8));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(0.2, 0.0, -2.2));
            break;
        case bedObj: // bed
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-2.9, 0.0, 1.9));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateYMatrix(-180));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.65));
            break;
        case chairObj: // chair
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-2.4, 0.0, -1.8));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.008));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateZMatrix(-45));
            break;
        case closetObj10: // closet
        case closetObj11: // closet
        case closetObj12: // closet
        case closetObj13: // closet
        case closetObj14: // closet
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(2.4, 1.1, 3.3));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateYMatrix(0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(1.7));
            break;
        case sofaObj2:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.8));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateYMatrix(-180));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-1.80, 0.0, 2.35));
            break;
        case chairObj2: // chair
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-3.0, 0.0, -1.0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.008));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateZMatrix(-60));
            break;
        case chairObj3: // chair
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-1.6, 0.0, -2.4));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.008));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateZMatrix(-30));
            break;
        case plant10: // plant
        case plant11: // plant
        case plant12: // plant
        case plant13: // plant
        case plant14: // plant
        case plant15: // plant
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-3.0, 0.0, -2.6));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.2));
            break;
        case topiary1:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(1.8, 0.0, -1.8));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.006));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            break;
        case topiary2:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(0.0, 0.57, 0.0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.0035));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            break;
        case plant20: // plant
        case plant21: // plant
        case plant22: // plant
        case plant23: // plant
        case plant24: // plant
        case plant25: // plant
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-1.8, 0.0, 2.6));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.2));
            break;
        case bedObj2: // bed
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-0.7, 0.0, 1.9));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateYMatrix(-180));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.65));
                break;
        case woodtable10:
        case woodtable11:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(0.0, 0.0, 0.0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(1.2));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            break;
        case potPlant12:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(1.28, 1.8, 2.54));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.8));
        case potPlant11:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(3.6, 0.7, 3.0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateXMatrix(-90));
            break;
        case closetObj20: // closet
        case closetObj21: // closet
        case closetObj22: // closet
        case closetObj23: // closet
        case closetObj24: // closet
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(3.8, 1.1, 2.0));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateYMatrix(-90));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(1.7));
            break;
        case 40:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(-5.3, 1.5, 0.0));
            //objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                //objectWorldMatrix[sceneObjects],
                //utils.MakeRotateYMatrix(-180));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.5));
            break;
        case 41:
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeTranslateMatrix(1.8, 1.3, -2.6));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeRotateYMatrix(-90));
            objectWorldMatrix[sceneObjects] = utils.multiplyMatrices(
                objectWorldMatrix[sceneObjects],
                utils.MakeScaleMatrix(0.5));
            break;
    }

}


function loadShaders() {
    
    utils.loadFiles([shaderDir + 'vs.glsl',
    shaderDir + 'fs.glsl',
    //shaderDir + 'vs_g.glsl',
    //shaderDir + 'fs_g.glsl'
    ],
    function (shaderText) {
        // odd numbers are VSs, even are FSs
        
        for (let i = 0; i < shaderText.length; i += 2) {
            let vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, shaderText[i]);
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(vertexShader));
            }
            let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, shaderText[i + 1]);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(fragmentShader));
            }
            shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program...");
            }
        }
        
        });
        
        // Getting the handles to the shaders' vars
        
        
        //Retrieve information
        vertexPositionHandle = gl.getAttribLocation(shaderProgram, 'inPosition');
        vertexNormalHandle = gl.getAttribLocation(shaderProgram, 'inNormal');
        vertexUVHandle = gl.getAttribLocation(shaderProgram, 'inUVs');
        
        matrixPositionHandle = gl.getUniformLocation(shaderProgram, 'wvpMatrix');

        worldViewMatrixHandle = gl.getUniformLocation(shaderProgram, 'worldViewMatrix');
        
        materialDiffColorHandle = gl.getUniformLocation(shaderProgram, 'mDiffColor');
        materialSpecColorHandle = gl.getUniformLocation(shaderProgram, 'mSpecColor');
        materialSpecPowerHandle = gl.getUniformLocation(shaderProgram, 'mSpecPower');
        textureFileHandle = gl.getUniformLocation(shaderProgram, 'textureFile');
        
        textureInfluenceHandle = gl.getUniformLocation(shaderProgram, 'textureInfluence');
        ambientLightInfluenceHandle = gl.getUniformLocation(shaderProgram, 'ambientLightInfluence');
        ambientLightColorHandle = gl.getUniformLocation(shaderProgram, 'ambientLightColor');
        
        eyePositionHandle = gl.getUniformLocation(shaderProgram, 'eyePosition');

        lightDirectionHandle1 = gl.getUniformLocation(shaderProgram, 'lightDirection1');
        lightDirectionHandle2 = gl.getUniformLocation(shaderProgram, 'lightDirection2');
        lightDirectionHandle3 = gl.getUniformLocation(shaderProgram, 'lightDirection3');
        lightDirectionHandle4 = gl.getUniformLocation(shaderProgram, 'lightDirection4');
        lightDirectionHandle5 = gl.getUniformLocation(shaderProgram, 'lightDirection5');
        lightDirectionHandle6 = gl.getUniformLocation(shaderProgram, 'lightDirection6');
        lightDirectionHandle7 = gl.getUniformLocation(shaderProgram, 'lightDirection7');
        lightDirectionHandle8 = gl.getUniformLocation(shaderProgram, 'lightDirection8');
        lightPositionHandle1 = gl.getUniformLocation(shaderProgram, 'lightPosition1');
        lightPositionHandle2 = gl.getUniformLocation(shaderProgram, 'lightPosition2');
        lightPositionHandle3 = gl.getUniformLocation(shaderProgram, 'lightPosition3');
        lightPositionHandle4 = gl.getUniformLocation(shaderProgram, 'lightPosition4');
        lightPositionHandle5 = gl.getUniformLocation(shaderProgram, 'lightPosition5');
        lightPositionHandle6 = gl.getUniformLocation(shaderProgram, 'lightPosition6');
        lightPositionHandle7 = gl.getUniformLocation(shaderProgram, 'lightPosition7');
        lightPositionHandle8 = gl.getUniformLocation(shaderProgram, 'lightPosition8');
        lightColorHandle = gl.getUniformLocation(shaderProgram, 'lightColor');
        lightTypeHandle = gl.getUniformLocation(shaderProgram, 'lightType');
        //for camera space
        normalMatrixPositionHandle = gl.getUniformLocation(shaderProgram, 'nMatrix');
        lightDirMatrixPositionHandle = gl.getUniformLocation(shaderProgram, 'lightDirMatrix');
        lightPosMatrixPositionHandle = gl.getUniformLocation(shaderProgram, 'lightPosMatrix');
        
}


// MOVEMENT


var room = [[-3.6, -3.2, 3.6, 3.2]]
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
            case 32:
                document.getElementById("posbox").style.opacity ^= 1;
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

	
	for (i = 0; i < sceneObjects; i++){        
        //mod. for camera space
        worldViewMatrix[i] = utils.multiplyMatrices(viewMatrix, objectWorldMatrix[i]);
        projectionMatrix[i] = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix[i]);
        normalMatrix[i] = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix[i]));
		
		lightDirection1Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection1); 
        lightDirection2Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection1); 
        lightDirection3Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection2); 
        lightDirection4Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection2); 
        lightDirection5Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        lightDirection6Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        lightDirection7Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        lightDirection8Obj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])), lightDirection); 
        
        //console.log('oggetto ' + i + ' prima ha posizione luce ' + lightPosition[0]);
        lightPositionObj1[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(objectWorldMatrix[i])),lightPosition[0]);
        //console.log('oggetto '+i+'  dopo ha posizione luce '+ lightPositionObj1[i]);
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


//[xmin, ymin, xmax, ymax]
var zones = [[], [], [], [], [],
    [0.5, -1.8, 2.0, -0.5], //5 sofa
    [-3.6, 1.2, -1.9, 3.2], //6 bed
    [-2.1, -2.2, -1.3, -1.1], //7 chair
    [1.8, 1.8, 2.9, 3.2], //8-12 closet
    [],[],[],[],
    [0.5, -3.0, 2.0, -1.9], //13 sofa2
    [-3.2, -1.4, -2.1, -0.5], //14 chair2
    [-1.3, -3, -0.5, -1.9], //15 chair3 (nearest)
    [], //16-21 plant
    [],[],[],[],[],
    [], //22 topiary
    [], //23 topiary
    [], //24-29 plant
    [], [], [], [], [],
    [-1.9, 1.2, 0.4, 3.2], //30 bed
    [-1, -0.5, 1, 0.5],[], //31-32 table
    [],[], //33-34 pot
    [2.9, 1.1, 3.6, 1.8], //35-39 closet
    [],[],[],[]
    ];
function popup(x, y) {

    document.getElementById('posbox').innerHTML = "<b>x</b> = "+x+",<br><b>y</b> = "+y;

    var inZone = 0;
    var i;
    for (i = 0; i < zones.length; i++) {
        minX = Math.min(zones[i][0], zones[i][2]);
        maxX = Math.max(zones[i][0], zones[i][2]);
        minY = Math.min(zones[i][1], zones[i][3]);
        maxY = Math.max(zones[i][1], zones[i][3]);
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            console.log('ci sono' + i);
            inZone = 1;
            break;
        }
    }
    document.getElementById("descrbox").style.opacity = inZone;
    fillInfoBox(i);


    return [inZone, i];
}


function fillInfoBox(objNum) {

    var furnName = '';
    var colourSelector = 'none';
    var btn1 = '';
    var btn2 = '';
    //var defaulTex = 

    switch(objNum) {
        case sofaObj:
        case sofaObj2:
            furnName = 'Sofa';
            btn1 = 'Tartan';
            btn2 = 'Brown';
            tex1 = 'tartan.jpg';
            tex2 = 'mufiber03.png';
            break;
        case bedObj:
        case bedObj2:
            furnName = 'Bed';
            btn1 = 'White';
            btn2 = 'Teal';
            tex1 = 'bed_d.png';
            tex2 = 'bed_teal.png';
            break
        case chairObj:
        case chairObj2:
        case chairObj3:
            furnName = 'Chair';
            btn1 = 'White';
            btn2 = 'Beige';
            tex1 = 'chair.png';
            tex2 = 'chair_beige.png';
            break;
        case woodtable10:
            furnName = 'Table';
            btn1 = 'Brown';
            btn2 = 'Beige';
            tex1 = 'Wood_Table_C.png';
            tex2 = 'Wood_Table_C_2.jpg';
            break;
        case closetObj10:
        case closetObj20:
            furnName = 'Closet';
            btn1 = 'Walnut';
            btn2 = 'Beech';
            tex1 = 'closet.png';
            tex2 = 'closet2.png';
            break
        }
    
    //TODO implement case with a single option and not necessarily 2
    if (btn1 != '') {
        colourSelector = 'inline';
        document.getElementById('colourBtn1').innerHTML = btn1;
        document.getElementById('colourBtn2').innerHTML = btn2;

        document.getElementById('colourBtn1').onclick = function() {changeTexture(objNum, tex1);}
        document.getElementById('colourBtn2').onclick = function() {changeTexture(objNum, tex2);}
    }

    document.getElementById("colourSelector").style.display = colourSelector;
    document.getElementById('furnName').innerHTML = furnName;
    return;
}

function changeTexture(sceneObjects, imageName) {
    diffuseTextureObj[sceneObjects] = getTexture(modelsDir + imageName);

    // closet
    if ((sceneObjects >= closetObj10 && sceneObjects <= closetObj14) ||
        (sceneObjects >= closetObj20 && sceneObjects <= closetObj24)) {
        changeTexture(sceneObjects+1, imageName);
    }
}


function drawScene(){
		
    computeMatrices();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(shaderProgram);
    

    //ALT
    for (i = 0; i < sceneObjects; i++) {
        fillBuffer(i);
    }

    popup(cx, cy);

    
    window.requestAnimationFrame(drawScene);
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
}

function fillBuffer(i) {
    gl.uniformMatrix4fv(matrixPositionHandle, gl.FALSE, utils.transposeMatrix(projectionMatrix[i]));

    //gl.uniformMatrix4fv(worldViewMatrixHandle, gl.FALSE, utils.transposeMatrix(worldViewMatrix[i]));		
        
    gl.uniform1f(textureInfluenceHandle, textureInfluence);
    gl.uniform1f(ambientLightInfluenceHandle, ambientLightInfluence);	
    
    gl.uniform1i(textureFileHandle, 0);		//Texture channel 0 used for diff txt
    if (nTexture[i]==true && diffuseTextureObj[i].webglTexture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, diffuseTextureObj[i].webglTexture);
    } 
    
    //FOR CAMERA SPACE
    gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix[i]));
    gl.uniformMatrix4fv(lightDirMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(lightDirMatrix));
    gl.uniformMatrix4fv(lightPosMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(lightPosMatrix));

    gl.uniform4f(lightColorHandle, lightColor[0],
                                                lightColor[1],
                                                lightColor[2],
                                                lightColor[3]);
    gl.uniform4f(materialDiffColorHandle, diffuseColor[i][0],
                                                        diffuseColor[i][1],
                                                        diffuseColor[i][2],
                                                        diffuseColor[i][3]);
                                        
    gl.uniform4f(materialSpecColorHandle, specularColor[i][0],
                                                        specularColor[i][1],
                                                        specularColor[i][2],
                                                        specularColor[i][3]);
    gl.uniform4f(ambientLightColorHandle, ambientLightColor[0],
                                                        ambientLightColor[1],
                                                        ambientLightColor[2],
                                                        ambientLightColor[3]);
            
    gl.uniform1f(materialSpecPowerHandle, objectSpecularPower);
    
                                        
    gl.uniform3f(lightDirectionHandle1, lightDirection1Obj[i][0],
                                                    lightDirection1Obj[i][1],
                                                    lightDirection1Obj[i][2]);

    gl.uniform3f(lightDirectionHandle2, lightDirection2Obj[i][0],
                                                    lightDirection2Obj[i][1],
                                                    lightDirection2Obj[i][2]);

    gl.uniform3f(lightDirectionHandle3, lightDirection3Obj[i][0],
                                                    lightDirection3Obj[i][1],
                                                    lightDirection3Obj[i][2]);	
                                                    
    gl.uniform3f(lightDirectionHandle4, lightDirection4Obj[i][0],
                                                    lightDirection4Obj[i][1],
                                                    lightDirection4Obj[i][2]);	

    gl.uniform3f(lightDirectionHandle5, lightDirection5Obj[i][0],
                                                    lightDirection5Obj[i][1],
                                                    lightDirection5Obj[i][2]);

    gl.uniform3f(lightDirectionHandle6, lightDirection6Obj[i][0],
                                                    lightDirection6Obj[i][1],
                                                    lightDirection6Obj[i][2]);

    gl.uniform3f(lightDirectionHandle7, lightDirection7Obj[i][0],
                                                    lightDirection7Obj[i][1],
                                                    lightDirection7Obj[i][2]);

    gl.uniform3f(lightDirectionHandle8, lightDirection8Obj[i][0],
                                                    lightDirection8Obj[i][1],
                                                    lightDirection8Obj[i][2]);

    gl.uniform3f(lightPositionHandle1, lightPositionObj1[i][0],
                                                    lightPositionObj1[i][1],
                                                    lightPositionObj1[i][2]);
    gl.uniform3f(lightPositionHandle2, lightPositionObj2[i][0],
                                                    lightPositionObj2[i][1],
                                                    lightPositionObj2[i][2]);
    gl.uniform3f(lightPositionHandle3, lightPositionObj3[i][0],
                                                    lightPositionObj3[i][1],
                                                    lightPositionObj3[i][2]);
    gl.uniform3f(lightPositionHandle4, lightPositionObj4[i][0],
                                                    lightPositionObj4[i][1],
                                                    lightPositionObj4[i][2]);
    gl.uniform3f(lightPositionHandle5, lightPositionObj5[i][0],
                                                    lightPositionObj5[i][1],
                                                    lightPositionObj5[i][2]);
    gl.uniform3f(lightPositionHandle6, lightPositionObj6[i][0],
                                                    lightPositionObj6[i][1],
                                                    lightPositionObj6[i][2]);
    gl.uniform3f(lightPositionHandle7, lightPositionObj7[i][0],
                                                    lightPositionObj7[i][1],
                                                    lightPositionObj7[i][2]);
    gl.uniform3f(lightPositionHandle8, lightPositionObj8[i][0],
                                                    lightPositionObj8[i][1],
                                                    lightPositionObj8[i][2]);
    
    gl.uniform1i(lightTypeHandle, currentLightType);

    gl.uniform3f(eyePositionHandle,	observerPositionObj[i][0],
                                                    observerPositionObj[i][1],
                                                    observerPositionObj[i][2]);
    
                                                        
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectId[i]);	
    
    gl.enableVertexAttribArray(vertexPositionHandle);
    gl.vertexAttribPointer(vertexPositionHandle, 3, gl.FLOAT, gl.FALSE, 4 * 8, 0);
    
    gl.enableVertexAttribArray(vertexNormalHandle);
    gl.vertexAttribPointer(vertexNormalHandle, 3, gl.FLOAT, gl.FALSE, 4 * 8, 4 * 3);	

    gl.vertexAttribPointer(vertexUVHandle, 2, gl.FLOAT, gl.FALSE, 4*8, 4*6);                   
    gl.enableVertexAttribArray(vertexUVHandle);			
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectId[i]);
    gl.drawElements(gl.TRIANGLES, facesNumber[i] * 3, gl.UNSIGNED_SHORT, 0);
    
    gl.disableVertexAttribArray(vertexPositionHandle);
    gl.disableVertexAttribArray(vertexNormalHandle);
  }