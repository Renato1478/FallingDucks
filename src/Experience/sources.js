export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/px.jpg",
      "textures/environmentMap/nx.jpg",
      "textures/environmentMap/py.jpg",
      "textures/environmentMap/ny.jpg",
      "textures/environmentMap/pz.jpg",
      "textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  {
    name: "duckModel",
    type: "gltfModel",
    path: "models/Duck/glTF/Duck.gltf",
  },
  {
    name: "waterfallEnvironmentModel",
    type: "gltfModel",
    path: "environments/waterfall/glTF/glTF-Binary/WaterfallEnvironmentModel.glb",
  },
];
