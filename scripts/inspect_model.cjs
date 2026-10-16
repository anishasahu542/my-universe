const fs = require('fs');

const buf = fs.readFileSync('public/models/ultimate_space_kit.glb');
const chunk0Length = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));

console.log('=== NODES & MESHES ===');
gltf.nodes.forEach((node, i) => {
  console.log('Node ' + i + ': name="' + node.name + '", mesh=' + node.mesh + ', children=' + JSON.stringify(node.children) + ', translation=' + JSON.stringify(node.translation) + ', rotation=' + JSON.stringify(node.rotation) + ', scale=' + JSON.stringify(node.scale));
});

console.log('\n=== MESH PRIMITIVES & BOUNDS ===');
gltf.meshes.forEach((mesh, mi) => {
  console.log('Mesh ' + mi + ' [' + mesh.name + ']: primitives count=' + mesh.primitives.length);
  mesh.primitives.forEach((prim, pi) => {
    const posAcc = gltf.accessors[prim.attributes.POSITION];
    console.log('  Prim ' + pi + ': count=' + posAcc.count + ', min=' + JSON.stringify(posAcc.min) + ', max=' + JSON.stringify(posAcc.max));
  });
});
