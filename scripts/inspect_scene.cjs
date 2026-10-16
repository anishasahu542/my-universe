const fs = require('fs');

// Inspect mesh primitives and material index
const buf = fs.readFileSync('public/models/ultimate_space_kit.glb');
const chunk0Length = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));

console.log('Scene:', gltf.scene);
console.log('Scenes:', JSON.stringify(gltf.scenes, null, 2));

// Let's check node transforms and names
gltf.nodes.forEach((n, idx) => {
  console.log(`Node ${idx}: "${n.name}" mesh=${n.mesh} children=${JSON.stringify(n.children)}`);
  if (n.translation) console.log(`   translation: ${JSON.stringify(n.translation)}`);
  if (n.rotation) console.log(`   rotation: ${JSON.stringify(n.rotation)}`);
  if (n.scale) console.log(`   scale: ${JSON.stringify(n.scale)}`);
  if (n.matrix) console.log(`   matrix: ${JSON.stringify(n.matrix)}`);
});
