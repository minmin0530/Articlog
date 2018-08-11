class Matrix {
  static create () {
    const m = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
    return m;
  }
  static lookAt(e, t, u) {
    const m = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
    let l;

    t[0] = e[0] - t[0];
    t[1] = e[1] - t[1];
    t[2] = e[2] - t[2];
    
    l = Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);
    m[ 2] = t[0] / l;
    m[ 6] = t[1] / l;
    m[10] = t[2] / l;


    t[0] = u[1] * m[10] - u[2] * m[ 6];
    t[1] = u[2] * m[ 2] - u[0] * m[10];
    t[2] = u[0] * m[ 6] - u[1] * m[ 2];
    l = Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);
    m[0] = t[0] / l;
    m[4] = t[1] / l;
    m[8] = t[2] / l;


    m[1] = m[ 6] * m[8] - m[10] * m[4];
    m[5] = m[10] * m[0] - m[ 2] * m[8];
    m[9] = m[ 2] * m[4] - m[ 6] * m[0];

    m[12] = -(e[0] * m[0] + e[1] * m[4] + e[2] * m[ 8]);
    m[13] = -(e[0] * m[1] + e[1] * m[5] + e[2] * m[ 9]);
    m[14] = -(e[0] * m[2] + e[1] * m[6] + e[2] * m[10]);

    return m;
  }
  static perspective (fovy, aspect, near, far) {
    const m = [
      0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0,
    ];
    const t = near * Math.tan(fovy * Math.PI / 360.0);
    const r = t * aspect;
    const a = r * 2;
    const b = t * 2;
    const c = far - near;
    m[0] = near * 2 / a;
    m[5] = near * 2 / b;
    m[10] = -(far + near) / c;
    m[11] = -1.0;
    m[14] = -(far * near * 2) / c;
    
    return m;
  }
  static multiply (m2, m1) {
    const m3 = [];
    m3.push(m1[0]*m2[0]+m1[1]*m2[4]+m1[2]*m2[ 8]+m1[3]*m2[12]);
    m3.push(m1[0]*m2[1]+m1[1]*m2[5]+m1[2]*m2[ 9]+m1[3]*m2[13]);
    m3.push(m1[0]*m2[2]+m1[1]*m2[6]+m1[2]*m2[10]+m1[3]*m2[14]);
    m3.push(m1[0]*m2[3]+m1[1]*m2[7]+m1[2]*m2[11]+m1[3]*m2[15]);

    m3.push(m1[4]*m2[0]+m1[5]*m2[4]+m1[6]*m2[ 8]+m1[7]*m2[12]);
    m3.push(m1[4]*m2[1]+m1[5]*m2[5]+m1[6]*m2[ 9]+m1[7]*m2[13]);
    m3.push(m1[4]*m2[2]+m1[5]*m2[6]+m1[6]*m2[10]+m1[7]*m2[14]);
    m3.push(m1[4]*m2[3]+m1[5]*m2[7]+m1[6]*m2[11]+m1[7]*m2[15]);

    m3.push(m1[8]*m2[0]+m1[9]*m2[4]+m1[10]*m2[ 8]+m1[11]*m2[12]);
    m3.push(m1[8]*m2[1]+m1[9]*m2[5]+m1[10]*m2[ 9]+m1[11]*m2[13]);
    m3.push(m1[8]*m2[2]+m1[9]*m2[6]+m1[10]*m2[10]+m1[11]*m2[14]);
    m3.push(m1[8]*m2[3]+m1[9]*m2[7]+m1[10]*m2[11]+m1[11]*m2[15]);

    m3.push(m1[12]*m2[0]+m1[13]*m2[4]+m1[14]*m2[ 8]+m1[15]*m2[12]);
    m3.push(m1[12]*m2[1]+m1[13]*m2[5]+m1[14]*m2[ 9]+m1[15]*m2[13]);
    m3.push(m1[12]*m2[2]+m1[13]*m2[6]+m1[14]*m2[10]+m1[15]*m2[14]);
    m3.push(m1[12]*m2[3]+m1[13]*m2[7]+m1[14]*m2[11]+m1[15]*m2[15]);
    return m3;
  }
  initialize() {
    this.m = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
  }
  scale(x, y, z) {
    // const m1 = [
    //     x, 0.0, 0.0, 0.0,
    //   0.0,   y, 0.0, 0.0,
    //   0.0, 0.0,   z, 0.0,
    //   0.0, 0.0, 0.0, 1.0,
    // ];

    // this.m = Matrix.multiply(m1, this.m);

    this.m[ 0] *= x;
    this.m[ 5] *= y;
    this.m[10] *= z;
  }
  rotateX(angle) {
    this.m[ 5] = Math.cos(angle);  this.m[ 6] = -Math.sin(angle);
    this.m[ 9] = Math.sin(angle);  this.m[10] =  Math.cos(angle);
  }
  translate(x, y, z) {
    this.m[ 3] = x;
    this.m[ 7] = y;
    this.m[11] = z;
  }
  multiplyVector(v1) {
    const v2 = [];

    for (let l = 0; l < v1.length; l += 3) {
      v2.push(this.m[0] * v1[0 + l] + this.m[1] * v1[1 + l] + this.m[ 2] * v1[2 + l] + this.m[ 3]); 
      v2.push(this.m[4] * v1[0 + l] + this.m[5] * v1[1 + l] + this.m[ 6] * v1[2 + l] + this.m[ 7]); 
      v2.push(this.m[8] * v1[0 + l] + this.m[9] * v1[1 + l] + this.m[10] * v1[2 + l] + this.m[11]); 
    }
    return v2;
  }
};
class BevelCube {
  constructor () {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    
    this.time = 0.0;

    this.color = [];

    for (let l = 0; l < 16 * 6; ++l) {
      this.color.push(1.0);
      this.color.push(0.0);
      this.color.push(0.0);
      this.color.push(1.0);
    }
    for (let l = 0; l < 6 * 6; ++l) {
      this.color.push(1.0);
      this.color.push(0.0);
      this.color.push(0.0);
      this.color.push(0.1);
    }

    const SIZE = 10.0;
    const BEVEL = 2.0;
    this.basePosition = [
      //vertex
       SIZE,         SIZE +BEVEL,  SIZE,
       SIZE,         SIZE,         SIZE +BEVEL,
       SIZE +BEVEL,  SIZE,         SIZE,

       SIZE,         SIZE,         -SIZE -BEVEL,
       SIZE,         SIZE +BEVEL,  -SIZE,
       SIZE +BEVEL,  SIZE,         -SIZE,
       
       -SIZE,         SIZE,         SIZE +BEVEL,
       -SIZE,         SIZE +BEVEL,  SIZE,
       -SIZE -BEVEL,  SIZE,         SIZE,

       -SIZE,         SIZE +BEVEL,  -SIZE,
       -SIZE,         SIZE,         -SIZE -BEVEL,
       -SIZE -BEVEL,  SIZE,         -SIZE,

       SIZE,         -SIZE,         SIZE +BEVEL,
       SIZE,         -SIZE -BEVEL,  SIZE,
       SIZE +BEVEL,  -SIZE,         SIZE,

       SIZE,         -SIZE -BEVEL,  -SIZE,
       SIZE,         -SIZE,         -SIZE -BEVEL,
       SIZE +BEVEL,  -SIZE,         -SIZE,
       
       -SIZE,        -SIZE -BEVEL,  SIZE,
       -SIZE,        -SIZE,         SIZE +BEVEL,
       -SIZE -BEVEL, -SIZE,         SIZE,

       -SIZE,        -SIZE,         -SIZE -BEVEL,
       -SIZE,        -SIZE -BEVEL,  -SIZE,
       -SIZE -BEVEL, -SIZE,         -SIZE,
      //edge top
      -SIZE,  SIZE,        -SIZE -BEVEL,
       SIZE,  SIZE +BEVEL, -SIZE,
       SIZE,  SIZE,        -SIZE -BEVEL,
      -SIZE,  SIZE,        -SIZE -BEVEL,
      -SIZE,  SIZE +BEVEL, -SIZE,
       SIZE,  SIZE +BEVEL, -SIZE,

       SIZE +BEVEL,  SIZE,        -SIZE,
       SIZE,         SIZE +BEVEL,  SIZE,
       SIZE +BEVEL,  SIZE,         SIZE,
       SIZE +BEVEL,  SIZE,        -SIZE,
       SIZE,         SIZE +BEVEL, -SIZE,
       SIZE,         SIZE +BEVEL,  SIZE,

       SIZE,  SIZE +BEVEL,  SIZE,
       -SIZE,  SIZE,         SIZE +BEVEL,
       SIZE,  SIZE,         SIZE +BEVEL,
      -SIZE,  SIZE +BEVEL,  SIZE,
      -SIZE,  SIZE,         SIZE +BEVEL,
       SIZE,  SIZE +BEVEL,  SIZE,

      -SIZE,         SIZE +BEVEL,  SIZE,
      -SIZE -BEVEL,  SIZE,        -SIZE,
      -SIZE -BEVEL,  SIZE,         SIZE,
      -SIZE,         SIZE +BEVEL, -SIZE,
      -SIZE -BEVEL,  SIZE,        -SIZE,
      -SIZE,         SIZE +BEVEL,  SIZE,
      //edge side
      SIZE +BEVEL,  SIZE, -SIZE,
      SIZE,        -SIZE, -SIZE -BEVEL,
      SIZE,         SIZE, -SIZE -BEVEL,
      SIZE +BEVEL, -SIZE, -SIZE,
      SIZE,        -SIZE, -SIZE -BEVEL,
      SIZE +BEVEL,  SIZE, -SIZE,

      SIZE,         SIZE,  SIZE +BEVEL,
      SIZE +BEVEL, -SIZE,  SIZE,       
      SIZE +BEVEL,  SIZE,  SIZE,       
      SIZE,        -SIZE,  SIZE +BEVEL,
      SIZE +BEVEL, -SIZE,  SIZE,       
      SIZE,         SIZE,  SIZE +BEVEL,

      -SIZE,        -SIZE,  -SIZE -BEVEL,
      -SIZE -BEVEL,  SIZE,  -SIZE,
      -SIZE,         SIZE,  -SIZE -BEVEL,
      -SIZE,        -SIZE,  -SIZE -BEVEL,
      -SIZE -BEVEL, -SIZE,  -SIZE,
      -SIZE -BEVEL,  SIZE,  -SIZE,

      -SIZE -BEVEL, -SIZE,  SIZE,       
      -SIZE,         SIZE,  SIZE +BEVEL,
      -SIZE -BEVEL,  SIZE,  SIZE,       
      -SIZE -BEVEL, -SIZE,  SIZE,       
      -SIZE,        -SIZE,  SIZE +BEVEL,
      -SIZE,         SIZE,  SIZE +BEVEL,

      //edge bottom
       SIZE,  -SIZE -BEVEL, -SIZE,
       -SIZE,  -SIZE,        -SIZE -BEVEL,
       SIZE,  -SIZE,        -SIZE -BEVEL,
      -SIZE,  -SIZE -BEVEL, -SIZE,
      -SIZE,  -SIZE,        -SIZE -BEVEL,
       SIZE,  -SIZE -BEVEL, -SIZE,

       SIZE,         -SIZE -BEVEL,  SIZE,
       SIZE +BEVEL,  -SIZE,        -SIZE,
       SIZE +BEVEL,  -SIZE,         SIZE,
       SIZE,         -SIZE -BEVEL, -SIZE,
       SIZE +BEVEL,  -SIZE,        -SIZE,
       SIZE,         -SIZE -BEVEL,  SIZE,

      -SIZE,  -SIZE,         SIZE +BEVEL,
       SIZE,  -SIZE -BEVEL,  SIZE,
       SIZE,  -SIZE,         SIZE +BEVEL,
      -SIZE,  -SIZE,         SIZE +BEVEL,
      -SIZE,  -SIZE -BEVEL,  SIZE,
       SIZE,  -SIZE -BEVEL,  SIZE,

       -SIZE -BEVEL,  -SIZE,        -SIZE,
       -SIZE,         -SIZE -BEVEL,  SIZE,
       -SIZE -BEVEL,  -SIZE,         SIZE,
       -SIZE -BEVEL,  -SIZE,        -SIZE,
       -SIZE,         -SIZE -BEVEL, -SIZE,
       -SIZE,         -SIZE -BEVEL,  SIZE,
        
     //plane
      -SIZE,  SIZE, -SIZE -BEVEL,
       SIZE,  SIZE, -SIZE -BEVEL,
       SIZE, -SIZE, -SIZE -BEVEL,
       SIZE, -SIZE, -SIZE -BEVEL,
      -SIZE, -SIZE, -SIZE -BEVEL,
      -SIZE,  SIZE, -SIZE -BEVEL,

       SIZE, -SIZE,  SIZE +BEVEL,
       SIZE,  SIZE,  SIZE +BEVEL,
      -SIZE,  SIZE,  SIZE +BEVEL,
      -SIZE,  SIZE,  SIZE +BEVEL,
      -SIZE, -SIZE,  SIZE +BEVEL,
       SIZE, -SIZE,  SIZE +BEVEL,

      -SIZE -BEVEL, -SIZE,  SIZE,
      -SIZE -BEVEL,  SIZE,  SIZE,
      -SIZE -BEVEL,  SIZE, -SIZE,
      -SIZE -BEVEL,  SIZE, -SIZE,
      -SIZE -BEVEL, -SIZE, -SIZE,
      -SIZE -BEVEL, -SIZE,  SIZE,
      
       SIZE +BEVEL,  SIZE, -SIZE, 
       SIZE +BEVEL,  SIZE,  SIZE, 
       SIZE +BEVEL, -SIZE,  SIZE, 
       SIZE +BEVEL, -SIZE,  SIZE, 
       SIZE +BEVEL, -SIZE, -SIZE, 
       SIZE +BEVEL,  SIZE, -SIZE,
 
      -SIZE,  SIZE +BEVEL,  SIZE,
       SIZE,  SIZE +BEVEL,  SIZE,
       SIZE,  SIZE +BEVEL, -SIZE,
       SIZE,  SIZE +BEVEL, -SIZE,
      -SIZE,  SIZE +BEVEL, -SIZE,
      -SIZE,  SIZE +BEVEL,  SIZE,
      
       SIZE, -SIZE -BEVEL, -SIZE, 
       SIZE, -SIZE -BEVEL,  SIZE, 
      -SIZE, -SIZE -BEVEL,  SIZE, 
      -SIZE, -SIZE -BEVEL,  SIZE, 
      -SIZE, -SIZE -BEVEL, -SIZE, 
       SIZE, -SIZE -BEVEL, -SIZE, 
    ];
    this.position = this.basePosition;
    this.normal = this.position;  

    this.stm = new Matrix();
    this.rm = new Matrix();
    this.srtm = new Matrix();

  }
  setPosition(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
  }
  update () {
    this.time += 0.1;
    this.position = [];
    this.normal = [];

    this.stm.initialize();
    this.rm.initialize();
    this.srtm.initialize();

    this.rm.rotateX(this.time*0.1);
    this.stm.scale(0.5, 0.5, 0.5);
    this.stm.translate(this.x, this.y, this.z);

    this.srtm.m = Matrix.multiply(this.rm.m, this.stm.m);
    this.position = this.srtm.multiplyVector(this.basePosition);
      
    for (var v = 0; v < 44 * 9; v += 9) {
      var vec1 = [ this.position[3+v]-this.position[0+v], this.position[4+v]-this.position[1+v], this.position[5+v]-this.position[2+v] ];
      var vec2 = [ this.position[6+v]-this.position[0+v], this.position[7+v]-this.position[1+v], this.position[8+v]-this.position[2+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[0+v]-this.position[6+v], this.position[1+v]-this.position[7+v], this.position[2+v]-this.position[8+v] ];
      vec2 = [ this.position[3+v]-this.position[6+v], this.position[4+v]-this.position[7+v], this.position[5+v]-this.position[8+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[6+v]-this.position[3+v], this.position[7+v]-this.position[4+v], this.position[8+v]-this.position[5+v] ];
      vec2 = [ this.position[0+v]-this.position[3+v], this.position[1+v]-this.position[4+v], this.position[2+v]-this.position[5+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
   }
  }
};
class Cube {
  constructor () {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    
    this.time = 0.0;
    
    this.alpha = 1.0;
    this.color = [
        1.0, 0.0, 0.0, this.alpha,
        1.0, 0.0, 0.0, this.alpha,
        1.0, 0.0, 0.0, this.alpha,
        1.0, 0.0, 0.0, this.alpha,
        1.0, 0.0, 0.0, this.alpha,
        1.0, 0.0, 0.0, this.alpha,
  
        0.0, 1.0, 0.0, this.alpha,
        0.0, 1.0, 0.0, this.alpha,
        0.0, 1.0, 0.0, this.alpha,
        0.0, 1.0, 0.0, this.alpha,
        0.0, 1.0, 0.0, this.alpha,
        0.0, 1.0, 0.0, this.alpha,
  
        0.0, 0.0, 1.0, this.alpha,
        0.0, 0.0, 1.0, this.alpha,
        0.0, 0.0, 1.0, this.alpha,
        0.0, 0.0, 1.0, this.alpha,
        0.0, 0.0, 1.0, this.alpha,
        0.0, 0.0, 1.0, this.alpha,
  
        1.0, 1.0, 0.0, this.alpha,
        1.0, 1.0, 0.0, this.alpha,
        1.0, 1.0, 0.0, this.alpha,
        1.0, 1.0, 0.0, this.alpha,
        1.0, 1.0, 0.0, this.alpha,
        1.0, 1.0, 0.0, this.alpha,
  
        1.0, 0.0, 1.0, this.alpha,
        1.0, 0.0, 1.0, this.alpha,
        1.0, 0.0, 1.0, this.alpha,
        1.0, 0.0, 1.0, this.alpha,
        1.0, 0.0, 1.0, this.alpha,
        1.0, 0.0, 1.0, this.alpha,
  
        0.0, 1.0, 1.0, this.alpha,
        0.0, 1.0, 1.0, this.alpha,
        0.0, 1.0, 1.0, this.alpha,
        0.0, 1.0, 1.0, this.alpha,
        0.0, 1.0, 1.0, this.alpha,
        0.0, 1.0, 1.0, this.alpha,
    ];
    const SIZE = 3.0;
    this.basePosition = [
        -SIZE,  SIZE, -SIZE,
         SIZE,  SIZE, -SIZE,
         SIZE, -SIZE, -SIZE,
         SIZE, -SIZE, -SIZE,
        -SIZE, -SIZE, -SIZE,
        -SIZE,  SIZE, -SIZE,
  
         SIZE, -SIZE,  SIZE,
         SIZE,  SIZE,  SIZE,
        -SIZE,  SIZE,  SIZE,
        -SIZE,  SIZE,  SIZE,
        -SIZE, -SIZE,  SIZE,
         SIZE, -SIZE,  SIZE,
  
        -SIZE, -SIZE,  SIZE,
        -SIZE,  SIZE,  SIZE,
        -SIZE,  SIZE, -SIZE,
        -SIZE,  SIZE, -SIZE,
        -SIZE, -SIZE, -SIZE,
        -SIZE, -SIZE,  SIZE,
        
         SIZE,  SIZE, -SIZE, 
         SIZE,  SIZE,  SIZE, 
         SIZE, -SIZE,  SIZE, 
         SIZE, -SIZE,  SIZE, 
         SIZE, -SIZE, -SIZE, 
         SIZE,  SIZE, -SIZE,
   
        -SIZE,  SIZE,  SIZE,
         SIZE,  SIZE,  SIZE,
         SIZE,  SIZE, -SIZE,
         SIZE,  SIZE, -SIZE,
        -SIZE,  SIZE, -SIZE,
        -SIZE,  SIZE,  SIZE,
        
         SIZE, -SIZE, -SIZE, 
         SIZE, -SIZE,  SIZE, 
        -SIZE, -SIZE,  SIZE, 
        -SIZE, -SIZE,  SIZE, 
        -SIZE, -SIZE, -SIZE, 
         SIZE, -SIZE, -SIZE, 
    ];
    this.position = this.basePosition;
    this.normal = this.position;  

    this.stm = new Matrix();
    this.rm = new Matrix();
    this.srtm = new Matrix();

  }
  setPosition(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
  }
  update () {
    this.time += 0.1;
    this.position = [];
    this.normal = [];

    this.stm.initialize();
    this.rm.initialize();
    this.srtm.initialize();

    this.rm.rotateX(this.time);
    this.stm.scale(0.5, 0.5, 0.5);
    this.stm.translate(this.x, this.y, this.z);

    this.srtm.m = Matrix.multiply(this.rm.m, this.stm.m);
    this.position = this.srtm.multiplyVector(this.basePosition);
      
    for (var v = 0; v < 12 * 9; v += 9) {
      var vec1 = [ this.position[3+v]-this.position[0+v], this.position[4+v]-this.position[1+v], this.position[5+v]-this.position[2+v] ];
      var vec2 = [ this.position[6+v]-this.position[0+v], this.position[7+v]-this.position[1+v], this.position[8+v]-this.position[2+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[0+v]-this.position[6+v], this.position[1+v]-this.position[7+v], this.position[2+v]-this.position[8+v] ];
      vec2 = [ this.position[3+v]-this.position[6+v], this.position[4+v]-this.position[7+v], this.position[5+v]-this.position[8+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[6+v]-this.position[3+v], this.position[7+v]-this.position[4+v], this.position[8+v]-this.position[5+v] ];
      vec2 = [ this.position[0+v]-this.position[3+v], this.position[1+v]-this.position[4+v], this.position[2+v]-this.position[5+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
   }
  }

};
class Octahedron {
  constructor () {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    
    this.time = 0.0;
     
  
    this.color = [
       1.0, 0.0, 0.0, 1.0,
       1.0, 0.0, 0.0, 1.0,
       1.0, 0.0, 0.0, 1.0,
  
       0.0, 1.0, 0.0, 1.0,
       0.0, 1.0, 0.0, 1.0,
       0.0, 1.0, 0.0, 1.0,
  
       1.0, 0.0, 1.0, 1.0,
       1.0, 0.0, 1.0, 1.0,
       1.0, 0.0, 1.0, 1.0,
  
       0.0, 1.0, 1.0, 1.0,
       0.0, 1.0, 1.0, 1.0,
       0.0, 1.0, 1.0, 1.0,
  
       1.0, 1.0, 1.0, 1.0,
       1.0, 1.0, 1.0, 1.0,
       1.0, 1.0, 1.0, 1.0,
  
       0.0, 0.0, 1.0, 1.0,
       0.0, 0.0, 1.0, 1.0,
       0.0, 0.0, 1.0, 1.0,
  
       1.0, 1.0, 0.0, 1.0,
       1.0, 1.0, 0.0, 1.0,
       1.0, 1.0, 0.0, 1.0,
  
       0.5, 0.5, 0.5, 1.0,
       0.5, 0.5, 0.5, 1.0,
       0.5, 0.5, 0.5, 1.0,
    ];
    const r0 = 0.0;
    const r1 = 1.0;
    this.basePosition = [
      r1,  r0,  r0,
      r0,  r1,  r0,
      r0,  r0,  r1,
  
      r0, -r1,  r0,
      r1,  r0,  r0,
      r0,  r0,  r1,

      r0,  r1,  r0,
      r1,  r0,  r0,
      r0,  r0, -r1,
  
      r1,  r0,  r0,
      r0, -r1,  r0,
      r0,  r0, -r1,
  
      r0,  r1,  r0,
      -r1,  r0,  r0,
      r0,  r0,  r1,
  
     -r1,  r0,  r0,
      r0, -r1,  r0,
      r0,  r0,  r1,
  
     -r1,  r0,  r0,
      r0,  r1,  r0,
      r0,  r0, -r1,
  
     r0, -r1,  r0,
     -r1,  r0,  r0,
      r0,  r0, -r1,
    ];
    this.position = this.basePosition;
    this.normal = this.position;  
  
    this.stm = new Matrix();
    this.rm = new Matrix();
    this.srtm = new Matrix();
  }

  setPosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  update () {
    this.time += 0.1;
    this.position = [];
    this.normal = [];

    this.stm.initialize();
    this.rm.initialize();
    this.srtm.initialize();

    this.rm.rotateX(this.time);
    this.stm.scale(2, 2, 2);
    this.stm.translate(this.x, this.y, this.z);

    this.srtm.m = Matrix.multiply(this.rm.m, this.stm.m);
    this.position = this.srtm.multiplyVector(this.basePosition);
      
    for (var v = 0; v < 8 * 9; v += 9) {
      var vec1 = [ this.position[3+v]-this.position[0+v], this.position[4+v]-this.position[1+v], this.position[5+v]-this.position[2+v] ];
      var vec2 = [ this.position[6+v]-this.position[0+v], this.position[7+v]-this.position[1+v], this.position[8+v]-this.position[2+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[0+v]-this.position[6+v], this.position[1+v]-this.position[7+v], this.position[2+v]-this.position[8+v] ];
      vec2 = [ this.position[3+v]-this.position[6+v], this.position[4+v]-this.position[7+v], this.position[5+v]-this.position[8+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[6+v]-this.position[3+v], this.position[7+v]-this.position[4+v], this.position[8+v]-this.position[5+v] ];
      vec2 = [ this.position[0+v]-this.position[3+v], this.position[1+v]-this.position[4+v], this.position[2+v]-this.position[5+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
   }
   




  }
};
class Octahedron2 {
  constructor () {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    
    this.time = 0.0;
     
    const subdivisionColor = [
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
 
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
 
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
 
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
 
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
 
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
 
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
 
      0.5, 0.5, 0.5, 1.0,
      0.5, 0.5, 0.5, 1.0,
      0.5, 0.5, 0.5, 1.0,
     
    ];
    this.color = []

    const r0 = 0.0;
    const r1 = 1.0;
    const r2 = 1/Math.sqrt(2);


    const baseSubdivision = [
      r1,  r0,  r0,
      r2,  r2,  r0,
      r2,  r0,  r2,

      r0,  r1,  r0,
      r2,  r2,  r0,
      r0,  r2,  r2,

      r0,  r0,  r1,
      r2,  r0,  r2,
      r0,  r2,  r2,

      r2,  r2,  r0,
      r2,  r0,  r2,
      r0,  r2,  r2,
      
    ];

    this.basePosition = [];

    let minusX = 1;
    let minusY = 1;
    let minusZ = 1;
    for (let m = 0; m < 8; ++m) {
      if (m % 4 < 2 ) {minusX = -1;} else {minusX = 1;}
      if (m % 2 == 0) {minusY = -1;} else {minusY = 1;}
      if (m >= 4    ) {minusZ = -1;} else {minusZ = 1;}
      for (let l = 0; l < 4 * 3 * 3; l += 3) {
        this.basePosition.push(minusX * baseSubdivision[0 + l]);
        this.basePosition.push(minusY * baseSubdivision[1 + l]);
        this.basePosition.push(minusZ * baseSubdivision[2 + l]);
      }
    }

    for (let m = 0; m < 4; ++m) {    
    for (let l = 0; l < subdivisionColor.length; ++l) {
      this.color.push(subdivisionColor[l]);
    }
    }

    this.position = this.basePosition;
    this.normal = this.position;  
  
    this.stm = new Matrix();
    this.rm = new Matrix();
    this.srtm = new Matrix();
  }

  setPosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  update () {
    this.time += 0.02;
    this.position = [];
    this.normal = [];

    this.stm.initialize();
    this.rm.initialize();
    this.srtm.initialize();

    this.rm.rotateX(this.time);
    this.stm.scale(2, 2, 2);
    this.stm.translate(this.x, this.y, this.z);

    this.srtm.m = Matrix.multiply(this.rm.m, this.stm.m);
    this.position = this.srtm.multiplyVector(this.basePosition);
      
    for (var v = 0; v < 32 * 9; v += 9) {
      var vec1 = [ this.position[3+v]-this.position[0+v], this.position[4+v]-this.position[1+v], this.position[5+v]-this.position[2+v] ];
      var vec2 = [ this.position[6+v]-this.position[0+v], this.position[7+v]-this.position[1+v], this.position[8+v]-this.position[2+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[0+v]-this.position[6+v], this.position[1+v]-this.position[7+v], this.position[2+v]-this.position[8+v] ];
      vec2 = [ this.position[3+v]-this.position[6+v], this.position[4+v]-this.position[7+v], this.position[5+v]-this.position[8+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[6+v]-this.position[3+v], this.position[7+v]-this.position[4+v], this.position[8+v]-this.position[5+v] ];
      vec2 = [ this.position[0+v]-this.position[3+v], this.position[1+v]-this.position[4+v], this.position[2+v]-this.position[5+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
   }
   




  }
};
class Octahedron3 {
  constructor () {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    
    this.time = 0.0;
     
    // const subdivisionColor = [
    //   1.0, 0.0, 0.0, 1.0,
    //   1.0, 0.0, 0.0, 1.0,
    //   1.0, 0.0, 0.0, 1.0,
 
    //   0.0, 1.0, 0.0, 1.0,
    //   0.0, 1.0, 0.0, 1.0,
    //   0.0, 1.0, 0.0, 1.0,
 
    //   1.0, 0.0, 1.0, 1.0,
    //   1.0, 0.0, 1.0, 1.0,
    //   1.0, 0.0, 1.0, 1.0,
 
    //   0.0, 1.0, 1.0, 1.0,
    //   0.0, 1.0, 1.0, 1.0,
    //   0.0, 1.0, 1.0, 1.0,
 
    //   1.0, 1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0, 1.0,
 
    //   0.0, 0.0, 1.0, 1.0,
    //   0.0, 0.0, 1.0, 1.0,
    //   0.0, 0.0, 1.0, 1.0,
 
    //   1.0, 1.0, 0.0, 1.0,
    //   1.0, 1.0, 0.0, 1.0,
    //   1.0, 1.0, 0.0, 1.0,
 
    //   0.5, 0.5, 0.5, 1.0,
    //   0.5, 0.5, 0.5, 1.0,
    //   0.5, 0.5, 0.5, 1.0,
     
    // ];
    this.color = []

    const r0 = 0.0;
    const r1 = 1.0;
    const r2 = 1/Math.sqrt(2);
    const r3s = Math.sin(Math.PI/180 * 22.5);
    const r3c = Math.cos(Math.PI/180 * 22.5);
    const r3m = 0.5 - Math.sqrt(1.5)/4;

    console.log(r3s);
    console.log(r3c);

    const baseSubdivision = [
      r3c, r3s, r0,
      r1,  r0,  r0,
      r3c, r0,  r3s,

      r3c, r3s, r0,
      r2,  r3s, r3s,
      r2,  r2,  r0,

      r2,  r3s, r3s,
      r3c, r0,  r3s,
      r2,  r0,  r2,      
      
      r2,  r3s, r3s,
      r3c, r3s, r0,
      r3c, r0,  r3s,
    ];

    this.basePosition = [];

    let minusX = 1;
    let minusY = 1;
    let minusZ = 1;
    for (let m = 0; m < 4; ++m) {

      for (let l = 0; l < 4 * 3 * 3; l += 3) {
        
        if (m == 0) {
          this.basePosition.push(minusX * baseSubdivision[0 + l]);
          this.basePosition.push(minusY * baseSubdivision[1 + l]);
          this.basePosition.push(minusZ * baseSubdivision[2 + l]);
        } else if (m == 1) {
          this.basePosition.push(minusX * baseSubdivision[1 + l]);
          this.basePosition.push(minusY * baseSubdivision[0 + l]);
          this.basePosition.push(minusZ * baseSubdivision[2 + l]);
        } else if (m == 2) {
          this.basePosition.push(minusX * baseSubdivision[1 + l]);
          this.basePosition.push(minusY * baseSubdivision[2 + l]);
          this.basePosition.push(minusZ * baseSubdivision[0 + l]);
        } else {
          if (l == 0) {
          this.basePosition.push(minusX * this.basePosition[0 + 10*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3]);

          this.basePosition.push(minusX * this.basePosition[0 + 10*3 + 12*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3 + 12*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3 + 12*3]);
          
          this.basePosition.push(minusX * this.basePosition[0 + 10*3 + 24*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3 + 24*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3 + 24*3]);


          this.basePosition.push(minusX * this.basePosition[0 + 10*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3]);

          this.basePosition.push(minusX * this.basePosition[0 + 10*3 + 12*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3 + 12*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3 + 12*3]);

          this.basePosition.push(minusZ * baseSubdivision[0 + 5 * 3 ]);
          this.basePosition.push(minusZ * baseSubdivision[1 + 5 * 3 ]);
          this.basePosition.push(minusZ * baseSubdivision[2 + 5 * 3 ]);


          this.basePosition.push(minusX * this.basePosition[0 + 10*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3]);
          
          this.basePosition.push(minusX * this.basePosition[0 + 10*3 + 24*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3 + 24*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3 + 24*3]);

          this.basePosition.push(minusZ * baseSubdivision[0 + 8 * 3 ]);
          this.basePosition.push(minusZ * baseSubdivision[1 + 8 * 3 ]);
          this.basePosition.push(minusZ * baseSubdivision[2 + 8 * 3 ]);


          this.basePosition.push(minusX * this.basePosition[0 + 10*3 + 12*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3 + 12*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3 + 12*3]);
          
          this.basePosition.push(minusX * this.basePosition[0 + 10*3 + 24*3]);
          this.basePosition.push(minusY * this.basePosition[1 + 10*3 + 24*3]);
          this.basePosition.push(minusZ * this.basePosition[2 + 10*3 + 24*3]);

          this.basePosition.push(r0);//minusZ * baseSubdivision[0 + 8 * 3 + 4*3*3]);
          this.basePosition.push(r2);//minusZ * baseSubdivision[1 + 8 * 3 + 4*3*3 ]);
          this.basePosition.push(r2);//minusZ * baseSubdivision[2 + 8 * 3 + 4*3*3 ]);
          
          }
        }
      }
    }

    const l = this.basePosition.length;
    for (let n = 0; n < 7; ++n) {
      if (n % 4 < 2 ) {minusX = -1;} else {minusX = 1;}
      if (n % 2 == 0) {minusY = -1;} else {minusY = 1;}
      if (n >= 3    ) {minusZ = -1;} else {minusZ = 1;}
      for (let m = 0; m < l; m += 3) {
        this.basePosition.push(minusX * this.basePosition[m + 0]);
        this.basePosition.push(minusY * this.basePosition[m + 1]);
        this.basePosition.push(minusZ * this.basePosition[m + 2]);
      }
    }

    for (let m = 0; m < 16 * 8 * 3; ++m) {    
        this.color.push(0.0);
        this.color.push(1.0);
        this.color.push(0.0);
        this.color.push(1.0);
    }      

    this.position = this.basePosition;
    this.normal = this.position;  
  
    this.stm = new Matrix();
    this.rm = new Matrix();
    this.srtm = new Matrix();
  }

  setPosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  update () {
    this.time += 0.02;
    this.position = [];
    this.normal = [];

    this.stm.initialize();
    this.rm.initialize();
    this.srtm.initialize();

    this.rm.rotateX(this.time);
    this.stm.scale(2, 2, 2);
    this.stm.translate(this.x, this.y, this.z);

    this.srtm.m = Matrix.multiply(this.rm.m, this.stm.m);
    this.position = this.srtm.multiplyVector(this.basePosition);
      
    for (var v = 0; v < 128 * 9; v += 9) {
      var vec1 = [ this.position[3+v]-this.position[0+v], this.position[4+v]-this.position[1+v], this.position[5+v]-this.position[2+v] ];
      var vec2 = [ this.position[6+v]-this.position[0+v], this.position[7+v]-this.position[1+v], this.position[8+v]-this.position[2+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[0+v]-this.position[6+v], this.position[1+v]-this.position[7+v], this.position[2+v]-this.position[8+v] ];
      vec2 = [ this.position[3+v]-this.position[6+v], this.position[4+v]-this.position[7+v], this.position[5+v]-this.position[8+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
  
      vec1 = [ this.position[6+v]-this.position[3+v], this.position[7+v]-this.position[4+v], this.position[8+v]-this.position[5+v] ];
      vec2 = [ this.position[0+v]-this.position[3+v], this.position[1+v]-this.position[4+v], this.position[2+v]-this.position[5+v] ];
      this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
      this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
      this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
   }
   




  }
};
class Grass {
    constructor () {
      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      
      this.time = 0.0;

      this.all = 5000;
      this.randomX = [];
      this.randomZ = [];
      
      for (let l = 0; l < this.all; ++l) {
        this.randomX.push( (Math.random() * this.all - this.all/2) / 50 );
        this.randomZ.push( (Math.random() * this.all - this.all/2) / 50 );
      }
    
      this.color = [];
      for (let l = 0; l <3*9*this.all; ++l) {
        this.color.push(0.0);
        this.color.push(1.0);
        this.color.push(0.0);
        this.color.push(1.0);
      }
      const r0 = -0.5;
      const r1 =  0.5;
      const s0 =  0.8;
      const s1 =  6.0;
      this.basePosition = [
        r1,     r0,    r0,
        r0*s0,  r1*s1,  r0,
        r0,     r0,    r0,

        r0*s0,  r1*s1,  r0,
        r1,     r0,    r0,
        r1*s0,  r1*s1,  r0,

        r1*s0,     r1*s1,   r0,
        r0*s0*s0,  r1*s1*1.8, r0,
        r0*s0,     r1*s1,   r0,

        r0*s0*s0,  r1*s1*1.8, r0,
        r1*s0,     r1*s1,   r0,
        r1*s0*s0,  r1*s1*1.8, r0,

        r1*s0*s0,     r1*s1*1.8, r0,
        r0*s0*s0*s0,  r1*s1*2.4, r0,
        r0*s0*s0,     r1*s1*1.8, r0,

        r0*s0*s0*s0,  r1*s1*2.4, r0,
        r1*s0*s0,     r1*s1*1.8, r0,
        r1*s0*s0*s0,  r1*s1*2.4, r0,

        r1*s0*s0*s0,     r1*s1*2.4, r0,
        r0*s0*s0*s0*s0,  r1*s1*3.0, r0,
        r0*s0*s0*s0,     r1*s1*2.4, r0,

        r0*s0*s0*s0*s0,  r1*s1*3.0, r0,
        r1*s0*s0*s0,     r1*s1*2.4, r0,
        r1*s0*s0*s0*s0,  r1*s1*3.0, r0,
        
        r1*s0*s0*s0*s0,     r1*s1*3.0, r0,
        0,                  r1*s1*3.6, r0,  
        r0*s0*s0*s0*s0,     r1*s1*3.0, r0,
      ];
      this.position = this.basePosition;
      this.normal = this.position;  
    
      this.stm = new Matrix();
      this.rm = new Matrix();
      this.srtm = new Matrix();
    }
  
    setPosition(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    update () {
      this.time += 0.4;
      if (this.time > 359.0) {
        this.time = 1.0;
      }
      const sway = Math.cos(Math.PI / 180.0 * this.time);
      this.position2 = [];
      this.position = [];
      this.normal = [];
  
      this.stm.initialize();
      this.rm.initialize();
      this.srtm.initialize();
  
    //   this.rm.rotateX(this.time);
//       this.stm.scale(2, 2, 2);
 //     this.stm.translate(this.x, this.y, this.z);


  
      this.srtm.m = Matrix.multiply(this.rm.m, this.stm.m);
      this.basePosition = this.srtm.multiplyVector(this.basePosition);



      for (let l = 0; l < this.basePosition.length; l+=3) {
        if (l >= 6 * 3) {// && (l / 3) % 2 == 1) {
            this.position2[l+0] = Math.cos(Math.PI / 180.0 * this.time) + this.basePosition[l+0];
        } else {
            this.position2[l+0] = this.basePosition[l+0];
        }
        this.position2[l+1] = this.basePosition[l+1];
        this.position2[l+2] = this.basePosition[l+2];
      }
      this.position2[3] = this.position2[18+6];
      this.position2[3+6] = this.position2[18+6];
      this.position2[3+12] = this.position2[18+12];

      let i = 18;
      for (let k = 0; k < 3; ++k) {
        for (let l = 0; l < this.basePosition.length; l+=3) {
          if (l >= (12 + 6*k) * 3) {// && (l / 3) % 2 == 1) {
              this.position2[l+0] = sway + this.position2[l+0];
          } else {
              this.position2[l+0] = this.position2[l+0];
          }
          this.position2[l+1] = this.position2[l+1];
          this.position2[l+2] = this.position2[l+2];
        }
        if (k < 2) {
        this.position2[i*(k+1)+3] = this.position2[i*(k+2)+6];
        this.position2[i*(k+1)+3+6] = this.position2[i*(k+2)+6];
        this.position2[i*(k+1)+3+12] = this.position2[i*(k+2)+12];
        }
      }
      this.position2[57] = this.position2[72+6];
      this.position2[57+6] = this.position2[72+6];
      this.position2[57+12] = this.position2[72+0];

      this.position2[75] = sway + this.position2[72];

      for (let k = 0; k < this.all; ++k) {
      for (let l = 0; l < this.position2.length; l += 3) {
        this.position.push(this.position2[l + 0] + this.randomX[k]);
        this.position.push(this.position2[l + 1] + 0.0);
        this.position.push(this.position2[l + 2] + this.randomZ[k]);
      }
      }
//      this.normal = this.position;



     
      for (var v = 0; v < 9 * 9 * this.all; v += 9) {
        var vec1 = [ this.position2[3+v]-this.position2[0+v], this.position2[4+v]-this.position2[1+v], this.position2[5+v]-this.position2[2+v] ];
        var vec2 = [ this.position2[6+v]-this.position2[0+v], this.position2[7+v]-this.position2[1+v], this.position2[8+v]-this.position2[2+v] ];
        this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
        this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
        this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
    
        vec1 = [ this.position2[0+v]-this.position2[6+v], this.position2[1+v]-this.position2[7+v], this.position2[2+v]-this.position2[8+v] ];
        vec2 = [ this.position2[3+v]-this.position2[6+v], this.position2[4+v]-this.position2[7+v], this.position2[5+v]-this.position2[8+v] ];
        this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
        this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
        this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
    
        vec1 = [ this.position2[6+v]-this.position2[3+v], this.position2[7+v]-this.position2[4+v], this.position2[8+v]-this.position2[5+v] ];
        vec2 = [ this.position2[0+v]-this.position2[3+v], this.position2[1+v]-this.position2[4+v], this.position2[2+v]-this.position2[5+v] ];
        this.normal.push(vec1[1] * vec2[2] - vec1[2] * vec2[1]);
        this.normal.push(vec1[2] * vec2[0] - vec1[0] * vec2[2]);
        this.normal.push(vec1[0] * vec2[1] - vec1[1] * vec2[0]);
      }
    }
  };
/*
ai6gl is WebGL wrapper library.
*/

class AI6GL {
  constructor () {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (gl) {
      this.GL = gl;
      this.object = [];
      this.time = 0.0;
//      gl.enable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    
//      this.fetchShader(gl);
    }
  }

  setCamera (eye, target, up) {
    this.eye = eye;
    this.target = target;
    this.up = up;
  }
  addLight (light) {
    this.light = light;
  }
  addObject (object) {
    this.object.push(object);
  }
  async fetchShader(gl, f) {
    this.vertexShader   = await fetch('src/shader/vertex.vs'  ).then((response) => response.text());
    this.fragmentShader = await fetch('src/shader/fragment.fs').then((response) => response.text());
    
    this.prg = await this.create_program(this.create_shader('vs', gl), this.create_shader('fs', gl), gl);
//    await this.mainLoop(gl);
    await f();
  }

  create_shader(id, gl) {
    let shader;
    switch (id) {
      case 'vs':
        shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, this.vertexShader);
        break;
      case 'fs':
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(shader, this.fragmentShader);
        break;
      default:
        return;
    }
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  }
  create_program(vs, fs, gl) {
    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      alert(gl.getProgramInfoLog(program));
    }
  }
  create_vbo(data, gl) {
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }


  draw(gl) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const planeLightPosition = [
      0.85, 0.0, -0.3,
    ];

    for (const object of this.object) {

      const vPlaneColor   = this.create_vbo(object.color, gl);
      const vPlanePosition = this.create_vbo(object.position, gl);
      const vPlaneNormal   = this.create_vbo(object.normal, gl);
  
      const vPlaneAttColor    = gl.getAttribLocation(this.prg, 'color');
      const vPlaneAttLocation = gl.getAttribLocation(this.prg, 'position');
      const vPlaneAttNormal   = gl.getAttribLocation(this.prg, 'normal');
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vPlaneColor);
      gl.enableVertexAttribArray(vPlaneAttColor);
      gl.vertexAttribPointer(vPlaneAttColor, 4, gl.FLOAT, false, 0, 0);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vPlanePosition);
      gl.enableVertexAttribArray(vPlaneAttLocation);
      gl.vertexAttribPointer(vPlaneAttLocation, 3, gl.FLOAT, false, 0, 0);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vPlaneNormal);
      gl.enableVertexAttribArray(vPlaneAttNormal);
      gl.vertexAttribPointer(vPlaneAttNormal, 3, gl.FLOAT, false, 0, 0);
  
      const view        = Matrix.lookAt(this.eye, this.target, this.up);
      const perspective = Matrix.perspective(90, 640.0 / 480.0, 0.1, 1000);
      const model       = Matrix.create();
      const vp          = Matrix.multiply(perspective, view);
      const mvp         = Matrix.multiply(vp, model);
  
      const puniLocationEye = gl.getUniformLocation(this.prg, 'lightPosition');
      gl.uniform3fv(puniLocationEye, this.light);
      const puniLocation = gl.getUniformLocation(this.prg, 'mvp');
      gl.uniformMatrix4fv(puniLocation, false, mvp);
      gl.drawArrays(gl.TRIANGLES, 0, object.position.length / 3);
      gl.flush();  
    }

  }
};