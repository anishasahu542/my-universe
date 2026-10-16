const fs = require('fs');
const THREE = require('three');

// Simulate Three.js GLTFLoader hierarchy with matrices
const buf = fs.readFileSync('public/models/ultimate_space_kit.glb');
const chunk0Length = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));
const binChunkStart = 20 + chunk0Length + 8;

// Build Three.js objects
const root = new THREE.Group();
root.name = "RootScene";

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

// Build hierarchy
gltf.nodes.forEach((n, idx) => {
  const parentObj = threeNodes[idx];
  if (n.children) {
    n.children.forEach(childIdx => {
      parentObj.add(threeNodes[childIdx]);
    });
  }
});

root.add(threeNodes[0]);
root.updateMatrixWorld(true);

// Add geometries to the meshes
gltf.nodes.forEach((n, idx) => {
  if (n.mesh !== undefined) {
    const meshDef = gltf.meshes[n.mesh];
    const meshObj = threeNodes[idx];
    
    // Read vertices from first primitive
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

console.log('=== WORLD BOUNDING BOXES FOR EACH MESH ===');
gltf.nodes.forEach((n, idx) => {
  if (n.mesh !== undefined) {
    const meshObj = threeNodes[idx];
    const bbox = new THREE.Box3().setFromObject(meshObj);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);
    console.log(`Node ${idx} [${meshObj.name}] Mesh ${n.mesh}:`);
    console.log(`   Center: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`);
    console.log(`   Size: (${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)})`);
    console.log(`   Min: (${bbox.min.x.toFixed(2)}, ${bbox.min.y.toFixed(2)}, ${bbox.min.z.toFixed(2)})`);
    console.log(`   Max: (${bbox.max.x.toFixed(2)}, ${bbox.max.y.toFixed(2)}, ${bbox.max.z.toFixed(2)})`);
  }
});

const totalBbox = new THREE.Box3().setFromObject(root);
const totalCenter = new THREE.Vector3();
const totalSize = new THREE.Vector3();
totalBbox.getCenter(totalCenter);
totalBbox.getSize(totalSize);
console.log('\n=== TOTAL SCENE BOUNDS ===');
console.log(`Center: (${totalCenter.x.toFixed(2)}, ${totalCenter.y.toFixed(2)}, ${totalCenter.z.toFixed(2)})`);
console.log(`Size: (${totalSize.x.toFixed(2)}, ${totalSize.y.toFixed(2)}, ${totalSize.z.toFixed(2)})`);
console.log(`Min: (${totalBbox.min.x.toFixed(2)}, ${totalBbox.min.y.toFixed(2)}, ${totalBbox.min.z.toFixed(2)})`);
console.log(`Max: (${totalBbox.max.x.toFixed(2)}, ${totalBbox.max.y.toFixed(2)}, ${totalBbox.max.z.toFixed(2)})`);
