const fs = require('fs');
const THREE = require('three');

// Let's inspect where the top horizontal walkable faces are on each mesh!
const buf = fs.readFileSync('public/models/ultimate_space_kit.glb');
const chunk0Length = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));
const binChunkStart = 20 + chunk0Length + 8;

const threeNodes = [];
gltf.nodes.forEach((n, idx) => {
  const obj = n.mesh !== undefined ? new THREE.Mesh() : new THREE.Group();
  obj.name = n.name || `Node_${idx}`;
  if (n.matrix) {
    const mat = new THREE.Matrix4().fromArray(n.matrix);
    mat.decompose(obj.position, obj.quaternion, obj.scale);
  }
  threeNodes[idx] = obj;
});

gltf.nodes.forEach((n, idx) => {
  const parentObj = threeNodes[idx];
  if (n.children) {
    n.children.forEach(childIdx => parentObj.add(threeNodes[childIdx]));
  }
});

const root = new THREE.Group();
root.add(threeNodes[0]);
root.updateMatrixWorld(true);

// Attach geometries
gltf.nodes.forEach((n, idx) => {
  if (n.mesh !== undefined) {
    const meshDef = gltf.meshes[n.mesh];
    const meshObj = threeNodes[idx];
    const prim = meshDef.primitives[0];
    const acc = gltf.accessors[prim.attributes.POSITION];
    const bv = gltf.bufferViews[acc.bufferView];
    const byteOffset = binChunkStart + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    
    const positions = new Float32Array(acc.count * 3);
    for (let i = 0; i < acc.count * 3; i++) {
      positions[i] = buf.readFloatLE(byteOffset + i * 4);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    meshObj.geometry = geom;
  }
});

root.updateMatrixWorld(true);

// Find flat/upward-facing triangles (walkable surfaces) in each mesh in WORLD space
gltf.nodes.forEach((n, idx) => {
  if (n.mesh !== undefined) {
    const meshObj = threeNodes[idx];
    const geom = meshObj.geometry;
    const pos = geom.attributes.position;
    const worldMatrix = meshObj.matrixWorld;
    
    let upwardTriangles = 0;
    const heights = [];
    const upwardPoints = [];

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const edge1 = new THREE.Vector3();
    const edge2 = new THREE.Vector3();
    const normal = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
      vA.fromBufferAttribute(pos, i).applyMatrix4(worldMatrix);
      vB.fromBufferAttribute(pos, i + 1).applyMatrix4(worldMatrix);
      vC.fromBufferAttribute(pos, i + 2).applyMatrix4(worldMatrix);

      edge1.subVectors(vB, vA);
      edge2.subVectors(vC, vA);
      normal.crossVectors(edge1, edge2).normalize();

      // Check if normal points roughly UP (+Y)
      if (normal.y > 0.7) {
        upwardTriangles++;
        const avgY = (vA.y + vB.y + vC.y) / 3;
        const avgX = (vA.x + vB.x + vC.x) / 3;
        const avgZ = (vA.z + vB.z + vC.z) / 3;
        heights.push(avgY);
        upwardPoints.push({ x: avgX, y: avgY, z: avgZ });
      }
    }

    if (upwardPoints.length > 0) {
      // Find clusters/levels of walkable platforms
      heights.sort((a, b) => a - b);
      const minH = heights[0];
      const maxH = heights[heights.length - 1];
      console.log(`Node ${idx} [${meshObj.name}]: upward faces=${upwardTriangles}, Walkable Y range=[${minH.toFixed(2)}, ${maxH.toFixed(2)}]`);
      
      // Sample 3 representative walkable locations on this object
      const p1 = upwardPoints[0];
      const p2 = upwardPoints[Math.floor(upwardPoints.length / 2)];
      const p3 = upwardPoints[upwardPoints.length - 1];
      console.log(`   Sample spots:`);
      console.log(`     P1: (${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p1.z.toFixed(2)})`);
      console.log(`     P2: (${p2.x.toFixed(2)}, ${p2.y.toFixed(2)}, ${p2.z.toFixed(2)})`);
      console.log(`     P3: (${p3.x.toFixed(2)}, ${p3.y.toFixed(2)}, ${p3.z.toFixed(2)})`);
    }
  }
});
