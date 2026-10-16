const fs = require('fs');

const buf = fs.readFileSync('public/models/ultimate_space_kit.glb');
const chunk0Length = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));

console.log('Meshes details:');
gltf.meshes.forEach((m, i) => {
  console.log(`Mesh ${i} (${m.name}):`);
  m.primitives.forEach((p, pi) => {
    console.log(`  prim ${pi}: mode=${p.mode || 4}, material=${p.material}, attributes=${Object.keys(p.attributes).join(', ')}`);
  });
});
