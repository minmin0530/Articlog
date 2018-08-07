attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

//varying   vec3 vEye;
varying   vec4 vColor;
varying   vec3 vNormal;
varying   vec3 vLightPosition;

uniform   vec3 lightPosition;
uniform   mat4 mvp;

void main () {
//  vEye = eye;
  vColor = color;
  vNormal = normal;
  vLightPosition = lightPosition - position;
  gl_Position = mvp * vec4(position, 1.0);
}