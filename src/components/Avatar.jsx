import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0,
    eyeSquintRight: 0,
    noseSneerLeft: 0.17,
    noseSneerRight: 0.14,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 1,
    mouthDimpleLeft: 0.41,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35,
    mouthSmileRight: 0.35,
  },
  sad: {
    mouthFrownLeft: 0.5,
    mouthFrownRight: 0.5,
    mouthShrugLower: 0.5,
    browInnerUp: 0.5,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 0.5,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    mouthFunnel: 0.5,
    browInnerUp: 0.5,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41,
  },
  angry: {
    browDownLeft: 0.5,
    browDownRight: 0.5,
    eyeSquintLeft: 0.5,
    eyeSquintRight: 0.5,
    jawForward: 0.3,
    jawLeft: 0.3,
    mouthShrugLower: 0.5,
    noseSneerLeft: 0.5,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.1,
    eyeLookDownRight: 0.1,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.6,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 0.5,
    noseSneerLeft: 0.57,
    noseSneerRight: 0.5,
    eyeLookDownLeft: 0.39,
    eyeLookUpRight: 0.4,
    eyeLookInLeft: 0.5,
    eyeLookInRight: 0.5,
    mouthDimpleLeft: 0.96,
    mouthDimpleRight: 0.96,
    mouthStretchLeft: 0.28,
    mouthStretchRight: 0.29,
    mouthSmileLeft: 0.56,
    mouthSmileRight: 0.38,
    tongueOut: 0.5,
  },
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export function Avatar(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/Character2.glb");
  const { message, onMessagePlayed, chat } = useChat();

  const [lipsync, setLipsync] = useState();
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Action");
  const [facialExpression, setFacialExpression] = useState("default");
  const [audio, setAudio] = useState(null);
  const [blink, setBlink] = useState(false);


  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false); 
          nextBlink(); 
        }, 200); 
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink(); 
    return () => clearTimeout(blinkTimeout); 
  }, []);

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }
    return () => {
      if (actions[animation]) actions[animation].fadeOut(0.5);
    };
  }, [animation, actions]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.geometry.morphAttributes?.position) {
        child.morphTargetInfluences?.forEach((_, index) => {
          child.morphTargetInfluences[index] = 0;
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!message) return;
    setFacialExpression(message.facialExpression || "default");
    setLipsync(message.lipsync);
    setAnimation(message.animation || "Action");
    const audioClip = new Audio("data:audio/mp3;base64," + message.audio);
    audioClip.play();
    setAudio(audioClip);
    audioClip.onended = onMessagePlayed;
  }, [message]);

  useEffect(() => {
    let timeout1, timeout2, timeout3, timeout4, timeout5, timeout6, loopTimeout;
  
    const startSequence = () => {
      if (
        actions["Rumba_Dance"] &&
        actions["Action"] &&
        actions["Hiphop_Dance"] &&
        actions["Yawn"]
      ) {
        timeout1 = setTimeout(() => { 
          setAnimation("Rumba_Dance");
  
          timeout2 = setTimeout(() => {
            setAnimation("Action");
  
            timeout3 = setTimeout(() => {
              setAnimation("Hiphop_Dance");
  
              timeout4 = setTimeout(() => {
                setTimeout(() => { 
                  setAnimation("Action");
  
                  timeout5 = setTimeout(() => {
                    setAnimation("Salsa_Dancing");
  
                    timeout6 = setTimeout(() => {
                      setAnimation("Action");
                      loopTimeout = setTimeout(startSequence, 3000);
                    }, actions["Salsa_Dancing"].getClip().duration * 1000);
  
                  }, 20000); 
  
                }, 20000); 
              }, actions["Hiphop_Dance"].getClip().duration * 1000);
            }, actions["Action"].getClip().duration * 1000);
          }, actions["Rumba_Dance"].getClip().duration * 1000);
        }, 20000);
      }
    };
  
    startSequence();
  
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(timeout5);
      clearTimeout(timeout6);
      clearTimeout(loopTimeout);
    };
  }, [actions]);
  
  
  useFrame(() => {
    const mapping = facialExpressions[facialExpression];

    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
        Object.keys(child.morphTargetDictionary).forEach((key) => {
          let targetValue = mapping?.[key] || 0;

          if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
            targetValue = blink ? 1 : 0;
          }

          if (blink && (key === "eyeWrinkleLeft" || key === "eyeWrinkleRight")) {
            targetValue = 1;
          }

          const index = child.morphTargetDictionary[key];
          if (index !== undefined) {
            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
              child.morphTargetInfluences[index],
              targetValue,
              0.3
            );
          }
        });

        if (lipsync && audio) {
          const appliedMorphTargets = [];
          const currentAudioTime = audio.currentTime;
          lipsync.mouthCues.forEach((mouthCue) => {
            if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
              const correspondingTarget = corresponding[mouthCue.value];
              const index = child.morphTargetDictionary[correspondingTarget];
              if (index !== undefined) {
                child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                  child.morphTargetInfluences[index],
                  1,
                  0.3
                );
                appliedMorphTargets.push(correspondingTarget);
              }
            }
          });

          Object.keys(corresponding).forEach((key) => {
            if (!appliedMorphTargets.includes(corresponding[key])) {
              const index = child.morphTargetDictionary[corresponding[key]];
              if (index !== undefined) {
                child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                  child.morphTargetInfluences[index],
                  0,
                  0.1
                );
              }
            }
          });
        }
      }
    });
  });

  useControls("FacialExpressions", {
    chat: button(() => chat()),
    animation: {
      value: animation,
      options: Object.keys(actions),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
  });


  return <primitive object={scene} {...props} ref={group} />;
}

useGLTF.preload("/models/Character2.glb");