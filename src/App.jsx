import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import Lottie from "lottie-react";
import loadingAnimation from "/public/loading.json"; 
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>

{isLoading && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 1000,
    color: "#fff",
    textAlign: "center",
  }}>
    <Lottie 
      animationData={loadingAnimation} 
      loop={true} 
      style={{ width: 300, height: 200 }} 
    />
    <p style={{   
      fontSize: "12px", 
      color: "#fff",
      maxWidth: "80%",
      display: "none", // Default: Hidden
    }}
    className="mobile-text"
    >
      For the best experience, we recommend using Miyu on a desktop device. Mobile compatibility is currently limited.
    </p>

    <style>
  {`
    @media (max-width: 768px) {
      .mobile-text {
        display: block !important;
      }
    }
  `}
</style>
  </div>
)}


      <Leva hidden />
      <UI />
      <Canvas camera={{ position: [0, 0, 2.2], fov: 60 }}>
        <Experience />
        <OrbitControls 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={1} 
          maxDistance={2} 
          enableDamping={true}
          dampingFactor={0.1}
        />
      </Canvas>
    </>
  );
}

export default App;


