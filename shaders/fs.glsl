precision highp float; 

uniform vec4 mDiffColor;
uniform vec4 mSpecColor;            
uniform float mSpecPower;

uniform sampler2D textureFile;
uniform float textureInfluence;
uniform float ambientLightInfluence;
uniform vec4 ambientLightColor;

uniform vec3 lightDirection1;
uniform vec3 lightDirection2;
uniform vec3 lightDirection3;
uniform vec3 lightDirection4;
uniform vec3 lightDirection5;
uniform vec3 lightDirection6;
uniform vec3 lightDirection7;
uniform vec3 lightDirection8;
// In order to use more lights, one attribute for each light position is defined
uniform vec3 lightPosition1;
uniform vec3 lightPosition2;
uniform vec3 lightPosition3;
uniform vec3 lightPosition4;
uniform vec3 lightPosition5;
uniform vec3 lightPosition6;
uniform vec3 lightPosition7;
uniform vec3 lightPosition8;
//FOR CAMERA SPACE
uniform mat4 lightDirMatrix; 
uniform mat4 lightPosMatrix; 
//Default phong
uniform vec4 lightColor;
uniform int lightType;

uniform vec3 eyePosition;

varying vec3 fsNormal; 
varying vec3 fsPosition; 
varying vec2 fsUVs;

//Function to create different lights types
//int lt = the selected light source type
//vec3 pos = the surface position

vec4 lightModel(int lt, vec3 pos, vec3 lPos, vec3 lDirX) {
	
	//The normalized light direction
    vec3 nLightDir;
	
	//Float to store light dimension and cone length
	float lDim, lCone;

	lDim = 1.0;
	
	if(lt == 1) { 			//Directional light
		nLightDir = - normalize(lDirX);
	} else if(lt == 2) {	//Point light
		nLightDir = normalize(lPos - pos);
	} else if(lt == 3) {	//Point light (decay)
		float lLen = length(lPos - pos);
		nLightDir = normalize(lPos - pos);
		lDim = 160.0 / (lLen * lLen);
	} else if(lt == 4) {	//Spot light
		nLightDir = normalize(lPos - pos);
		lCone = -dot(nLightDir, normalize(lDirX)) / 1.09;
		if(lCone < 0.7) {
			lDim = 0.0;
		} else if(lCone > 0.9) {
			lDim = 1.0;
		} else {
			lDim = (lCone - 0.7) / 0.2;
		}
	}
	return vec4(nLightDir, lDim);
}

void main() { 

	vec3 nEyeDirection = normalize(eyePosition - fsPosition);
	vec3 nNormal = normalize(fsNormal);
	vec4 diffuseTextureColorMixture = texture2D(textureFile, fsUVs) * textureInfluence + mDiffColor * (1.0 - textureInfluence) ;
	vec4 ambLight = diffuseTextureColorMixture * ambientLightColor * ambientLightInfluence;

	
	//Function to define light direction and size.
	
	vec4 lm1 = lightModel(lightType, fsPosition, lightPosition1, lightDirection1);
	float lightDimension1 = lm1.a;
	vec3 lDir1 = mat3(lightDirMatrix) * lightDirection1;
	//Computation of the lambert reflection using camera space
	vec4 diffuse1 = diffuseTextureColorMixture * lightColor * clamp(-dot(lDir1,nNormal), 0.0, 1.0) * lightDimension1;		

	vec4 lm2 = lightModel(lightType, fsPosition, lightPosition2, lightDirection2);
	float lightDimension2 = lm2.a;
	vec3 lDir2 = mat3(lightDirMatrix) * lightDirection2;
	vec4 diffuse2 = diffuseTextureColorMixture * lightColor * clamp(-dot(lDir2,nNormal), 0.0, 1.0) * lightDimension2;		

	vec4 lm3 = lightModel(lightType, fsPosition, lightPosition3, lightDirection3);
	float lightDimension3 = lm3.a;
	vec3 lDir3 = mat3(lightDirMatrix) * lightDirection3;
	vec4 diffuse3 = diffuseTextureColorMixture * lightColor * clamp(-dot(lDir3,nNormal), 0.0, 1.0) * lightDimension3;


	vec4 lm4 = lightModel(lightType, fsPosition, lightPosition4, lightDirection4);
	float lightDimension4 = lm4.a;
	vec3 lDir4 = mat3(lightDirMatrix) * lightDirection4;
	vec4 diffuse4 = diffuseTextureColorMixture * lightColor * clamp(-dot(lDir4,nNormal), 0.0, 1.0) * lightDimension4;


	vec4 lm5 = lightModel(lightType, fsPosition, lightPosition5, lightDirection5);
	float lightDimension5 = lm5.a;
	vec3 lDir5 = mat3(lightDirMatrix) * lightDirection5;
	vec4 diffuse5 = diffuseTextureColorMixture * lightColor * clamp(dot(lDir5,nNormal), 0.0, 1.0) * lightDimension5;

	vec4 lm6 = lightModel(lightType, fsPosition, lightPosition6, lightDirection6);
	float lightDimension6 = lm6.a;
	vec3 lDir6 = mat3(lightDirMatrix) * lightDirection6;
	vec4 diffuse6 = diffuseTextureColorMixture * lightColor * clamp(dot(lDir6,nNormal), 0.0, 1.0) * lightDimension6;


	vec4 lm7 = lightModel(lightType, fsPosition, lightPosition7, lightDirection7);
	float lightDimension7 = lm7.a;
	vec3 lDir7 = mat3(lightDirMatrix) * lightDirection7;
	vec4 diffuse7 = diffuseTextureColorMixture * lightColor * clamp(dot(lDir7,nNormal), 0.0, 1.0) * lightDimension7;

	vec4 lm8 = lightModel(lightType, fsPosition, lightPosition8, lightDirection8);
	float lightDimension8 = lm8.a;
	vec3 lDir8 = mat3(lightDirMatrix) * lightDirection8;
	vec4 diffuse8 = diffuseTextureColorMixture * lightColor * clamp(dot(lDir8,nNormal), 0.0, 1.0) * lightDimension8;

	//Now consider all the light
	gl_FragColor = clamp(diffuse1+diffuse2+diffuse3+diffuse4+diffuse5+diffuse6+diffuse7+diffuse8+ambLight, 0.0, 1.0);
}