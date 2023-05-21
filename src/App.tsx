import { Mesh, Vector3 } from "three";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls, button } from "leva";
import {
  OrbitControls,
  MeshReflectorMaterial,
  Text3D,
  PerspectiveCamera,
} from "@react-three/drei";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";
import optimerBold from "three/examples/fonts/gentilis_bold.typeface.json";
import robotoBold from "./Roboto Black_Regular.json";

type TextProps = {
  text: string;
  index: number;
  color: string;
};

function Text({ text, index, color }: TextProps) {
  const mesh = useRef<Mesh>(null!);

  useEffect(() => {
    mesh.current.geometry.computeVertexNormals();
    mesh.current.geometry.computeBoundingBox();
    const boundingBox = mesh.current.geometry.boundingBox;
    const center = new Vector3();
    const size = new Vector3();
    boundingBox!.getSize(size);
    boundingBox!.getCenter(center);
    mesh.current.geometry.translate(
      -center.x,
      index * (center.y + size.y / 2),
      -center.z
    );
  }, [text, index]);

  return (
    <>
      <Text3D
        // @ts-ignore
        font={robotoBold}
        size={1}
        height={2}
        ref={mesh}
        receiveShadow
        curveSegments={25}
        castShadow
      >
        {text.toUpperCase()}
        <meshStandardMaterial color={color} metalness={1} roughness={0.3} />
      </Text3D>
    </>
  );
}

function TextMultiLine({ text }: { text: string }) {
  const { textColor } = useControls({ textColor: "#ffffff" });
  const lines = text.split("\n").reverse();
  return (
    <>
      {lines.map((line, index) => (
        <Text key={line} text={line} index={index} color={textColor} />
      ))}
    </>
  );
}

const ReflectiveSurface = () => {
  const gl = useThree((state) => state.gl);
  const { floorColor } = useControls({
    floorColor: "#151515",
    screenshot: button(() => {
      const link = document.createElement("a");
      link.setAttribute("download", "canvas.png");
      link.setAttribute(
        "href",
        gl.domElement
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();
    }),
  });

  // @ts-ignore
  const materialRef = useRef<MeshReflectorMaterial>();

  useFrame(() => {
    if (materialRef.current) {
      // Animate the reflection offset to create the illusion of movement
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[50, 50]} />
      {/* @ts-ignore */}
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={15}
        depthScale={1}
        minDepthThreshold={0.85}
        color={floorColor}
        metalness={0}
        roughness={1}
        flatShading={false}
        fog={true}
      />
    </mesh>
  );
};

function App() {
  const { text, fov } = useControls({
    text: { value: "BIG TEXT\nIS FUNNY", rows: true },
    fov: { value: 45, min: 20, max: 100 },
  });

  return (
    <>
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        style={{ height: "100vh", background: "black" }}
        camera={{ fov: fov, position: [-4.5, 1.2, 5.7] }}
      >
        <PerspectiveCamera makeDefault fov={fov} position={[-4.5, 1.2, 5.7]} />
        <OrbitControls target={[0, 2, 0]} />
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          castShadow
          intensity={2}
          position={[0.2, 1.3, 3.7]}
          shadow-mapSize={[1024, 1024]}
          rotation={[0.052, 0, 0]}
        >
          <orthographicCamera
            attach="shadow-camera"
            left={-20}
            right={20}
            top={20}
            bottom={-20}
          />
        </directionalLight>
        <directionalLight
          castShadow
          intensity={2}
          position={[-27.7, 7.9, 4.5]}
          shadow-mapSize={[1024, 1024]}
          rotation={[0.052, 0, 0]}
        >
          <orthographicCamera
            attach="shadow-camera"
            left={-20}
            right={20}
            top={20}
            bottom={-20}
          />
        </directionalLight>

        <TextMultiLine text={text} />
        <ReflectiveSurface />
      </Canvas>
    </>
  );
}

export default App;
