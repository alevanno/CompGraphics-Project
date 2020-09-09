attribute vec3 inPosition; 
attribute vec3 inNormal; 
attribute vec2 inUVs;

varying vec3 fsNormal; 
varying vec3 fsPosition; 
varying vec2 fsUVs;

uniform mat4 wvpMatrix; 
//For camera space:
//Matrix to apply transformation on normals
uniform mat4 nMatrix;

void main() { 
	fsNormal = mat3(nMatrix) * inNormal; 
	fsPosition =  inPosition;
	fsUVs = inUVs;
	gl_Position = wvpMatrix * vec4(inPosition, 1.0);
}
	