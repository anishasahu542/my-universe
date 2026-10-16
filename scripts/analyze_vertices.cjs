const fs = require('fs');

const buf = fs.readFileSync('public/models/ultimate_space_kit.glb');
const chunk0Length = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));
const binChunkStart = 20 + chunk0Length + 8; // skip chunk1 header

console.log('Buffer views count:', gltf.bufferViews.length);
console.log('Accessors count:', gltf.accessors.length);

// Read position buffer for each mesh primitive
gltf.meshes.forEach((mesh, mi) => {
  mesh.primitives.forEach((prim, pi) => {
    const acc = gltf.accessors[prim.attributes.POSITION];
    const bv = gltf.bufferViews[acc.bufferView];
    const byteOffset = binChunkStart + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    
    // Sample some vertices
    const vertexCount = acc.count;
    let sumX = 0, sumY = 0, sumZ = 0;
    let minY = Infinity, maxY = -Infinity;
    
    for (let v = 0; v < vertexCount; v++) {
      const idx = byteOffset + v * 12; // 3 floats = 12 bytes
      const x = buf.readFloatLE(idx);
      const y = buf.readFloatLE(idx + 4);
      const z = buf.readFloatLE(idx + 8);
      sumX += x;
      sumY += y;
      sumZ += z;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const avgX = sumX / vertexCount;
    const avgY = sumY / vertexCount;
    const avgZ = sumZ / vertexCount;
    console.log(`Mesh ${mi} Prim ${pi}: count=${vertexCount}, Center=(${avgX.toFixed(2)}, ${avgY.toFixed(2)}, ${avgZ.toFixed(2)}), Y range=[${minY.toFixed(2)}, ${maxY.toFixed(2)}]`);
  });
});
