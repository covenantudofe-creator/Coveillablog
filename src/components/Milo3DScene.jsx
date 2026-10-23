import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Creates standard toon/story-shaded materials.
 */
function createMat(colorHex, roughness = 0.55, metalness = 0.05, extraProps = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness,
    metalness,
    ...extraProps,
  });
}

// ----------------------------------------------------------------------------
// Character 1: MILO (7-8 yr old Black boy in blue hoodie & curly hair)
// ----------------------------------------------------------------------------
function createMiloRig() {
  const root = new THREE.Group();
  root.name = "Milo";

  const skinMat = createMat(0x73442a, 0.65);
  const skinDarkMat = createMat(0x562f1a, 0.7);
  const hairMat = createMat(0x181316, 0.9);
  const hoodieMat = createMat(0x2563eb, 0.7);
  const hoodiePocketMat = createMat(0x1d4ed8, 0.75);
  const stringMat = createMat(0xf8fafc, 0.5);
  const pantsMat = createMat(0x1e293b, 0.8);
  const shoeMat = createMat(0x2563eb, 0.6);
  const shoeSoleMat = createMat(0xf8fafc, 0.5);
  const eyeWhiteMat = createMat(0xf8fafc, 0.2);
  const irisMat = createMat(0x3d2011, 0.3);
  const pupilMat = createMat(0x0a0a0a, 0.1);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mouthInnerMat = createMat(0x381515, 0.6);
  const lipMat = createMat(0x522919, 0.7);

  // Pelvis / Hips
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.98;
  root.add(pelvis);

  const pelvisMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.28, 14), pantsMat);
  pelvis.add(pelvisMesh);

  // Left Leg (Hips -> Knee -> Foot)
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.18, -0.1, 0);
  pelvis.add(leftHip);

  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.42, 10), pantsMat);
  leftThigh.position.y = -0.21;
  leftHip.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.42, 0);
  leftHip.add(leftKnee);

  const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.4, 10), pantsMat);
  leftCalf.position.y = -0.2;
  leftKnee.add(leftCalf);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.32), shoeMat);
  leftFoot.position.set(0, -0.42, 0.06);
  const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.34), shoeSoleMat);
  leftSole.position.set(0, -0.48, 0.06);
  leftKnee.add(leftFoot, leftSole);

  // Right Leg
  const rightHip = new THREE.Group();
  rightHip.position.set(0.18, -0.1, 0);
  pelvis.add(rightHip);

  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.42, 10), pantsMat);
  rightThigh.position.y = -0.21;
  rightHip.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.42, 0);
  rightHip.add(rightKnee);

  const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.4, 10), pantsMat);
  rightCalf.position.y = -0.2;
  rightKnee.add(rightCalf);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.32), shoeMat);
  rightFoot.position.set(0, -0.42, 0.06);
  const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.34), shoeSoleMat);
  rightSole.position.set(0, -0.48, 0.06);
  rightKnee.add(rightFoot, rightSole);

  // Spine & Torso
  const spine = new THREE.Group();
  spine.position.y = 0.14;
  pelvis.add(spine);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.64, 14), hoodieMat);
  torso.position.y = 0.32;
  spine.add(torso);

  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.22, 0.1), hoodiePocketMat);
  pouch.position.set(0, 0.22, 0.3);
  spine.add(pouch);

  // Drawstrings
  const stringGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6);
  const lStr = new THREE.Mesh(stringGeom, stringMat);
  lStr.position.set(-0.08, 0.42, 0.34);
  const rStr = new THREE.Mesh(stringGeom, stringMat);
  rStr.position.set(0.08, 0.42, 0.34);
  spine.add(lStr, rStr);

  // Hood draped on back
  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.1, 10, 20, Math.PI), hoodiePocketMat);
  hood.rotation.x = Math.PI * 0.72;
  hood.position.set(0, 0.6, -0.14);
  spine.add(hood);

  // Arms
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.44, 0.54, 0);
  spine.add(leftShoulder);
  const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.38, 10), hoodieMat);
  leftArmMesh.position.y = -0.19;
  leftShoulder.add(leftArmMesh);

  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.38, 0);
  leftShoulder.add(leftElbow);
  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.32, 10), hoodieMat);
  leftForearm.position.y = -0.16;
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), skinMat);
  leftHand.position.y = -0.34;
  leftHand.scale.set(0.9, 1.2, 0.8);
  leftElbow.add(leftForearm, leftHand);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.44, 0.54, 0);
  spine.add(rightShoulder);
  const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.38, 10), hoodieMat);
  rightArmMesh.position.y = -0.19;
  rightShoulder.add(rightArmMesh);

  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.38, 0);
  rightShoulder.add(rightElbow);
  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.32, 10), hoodieMat);
  rightForearm.position.y = -0.16;
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), skinMat);
  rightHand.position.y = -0.34;
  rightHand.scale.set(0.9, 1.2, 0.8);
  rightElbow.add(rightForearm, rightHand);

  // Neck & Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.2, 10), skinMat);
  neck.position.y = 0.68;
  spine.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.82, 0);
  spine.add(headGroup);

  const headGeom = new THREE.SphereGeometry(0.42, 20, 16);
  headGeom.scale(1, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeom, skinMat);
  headMesh.position.y = 0.38;
  headGroup.add(headMesh);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skinDarkMat);
  nose.position.set(0, 0.37, 0.44);
  headGroup.add(nose);

  // Curly afro clusters
  const hairGroup = new THREE.Group();
  hairGroup.position.set(0, 0.48, -0.04);
  headGroup.add(hairGroup);

  const curls = [
    [0, 0.32, -0.02, 0.3], [-0.16, 0.3, 0.06, 0.26], [0.16, 0.3, 0.06, 0.26],
    [0, 0.32, 0.16, 0.24], [-0.2, 0.28, 0.2, 0.2], [0.2, 0.28, 0.2, 0.2],
    [0, 0.34, -0.16, 0.26], [-0.22, 0.26, -0.14, 0.24], [0.22, 0.26, -0.14, 0.24],
    [-0.38, 0.14, 0.06, 0.22], [0.38, 0.14, 0.06, 0.22],
    [-0.38, 0.02, -0.06, 0.22], [0.38, 0.02, -0.06, 0.22],
    [0, 0.14, -0.32, 0.28], [-0.2, 0.1, -0.3, 0.25], [0.2, 0.1, -0.3, 0.25],
  ];
  curls.forEach(([x, y, z, r]) => {
    const c = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), hairMat);
    c.position.set(x, y, z);
    hairGroup.add(c);
  });

  // Eyes
  const makeEye = (isLeft) => {
    const eye = new THREE.Group();
    eye.position.set(isLeft ? -0.16 : 0.16, 0.42, 0.38);
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 10), eyeWhiteMat);
    sclera.scale.set(1.1, 1.1, 0.6);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), irisMat);
    iris.position.set(0, 0, 0.04);
    iris.scale.set(1, 1, 0.3);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 6), pupilMat);
    pupil.position.set(0, 0, 0.055);
    pupil.scale.set(1, 1, 0.2);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), shineMat);
    shine.position.set(0.02, 0.02, 0.065);
    const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.094, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat);
    eyelid.position.set(0, 0.01, 0.02);
    eyelid.rotation.x = -Math.PI * 0.45;
    eye.add(sclera, iris, pupil, shine, eyelid);
    return { eye, eyelid };
  };

  const leftEyeData = makeEye(true);
  const rightEyeData = makeEye(false);
  headGroup.add(leftEyeData.eye, rightEyeData.eye);

  // Eyebrows
  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), hairMat);
  leftBrow.position.set(-0.16, 0.53, 0.41);
  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), hairMat);
  rightBrow.position.set(0.16, 0.53, 0.41);
  headGroup.add(leftBrow, rightBrow);

  // Mouth Rig
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, 0.24, 0.41);
  headGroup.add(mouthGroup);
  const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), mouthInnerMat);
  mouthCavity.scale.set(1.4, 0.4, 0.4);
  mouthCavity.position.set(0, 0, -0.02);
  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.024, 0.03), lipMat);
  upperLip.position.set(0, 0.02, 0.01);
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.03), lipMat);
  lowerLip.position.set(0, -0.02, 0.01);
  mouthGroup.add(mouthCavity, upperLip, lowerLip);

  return {
    root,
    pelvis,
    spine,
    headGroup,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftHand,
    rightHand,
    leftEye: leftEyeData,
    rightEye: rightEyeData,
    leftBrow,
    rightBrow,
    mouthGroup,
    mouthCavity,
  };
}

// ----------------------------------------------------------------------------
// Character 2: MARA (5-6 yr old Black sister with puff buns & coral outfit)
// ----------------------------------------------------------------------------
function createMaraRig() {
  const root = new THREE.Group();
  root.name = "Mara";
  root.scale.set(0.88, 0.88, 0.88);

  const skinMat = createMat(0x7c4930, 0.65);
  const skinDarkMat = createMat(0x5a2f1b, 0.7);
  const hairMat = createMat(0x191417, 0.9);
  const bandMat = createMat(0xfbbf24, 0.5);
  const topMat = createMat(0xec4899, 0.7);
  const collarMat = createMat(0xfdf2f8, 0.5);
  const skirtMat = createMat(0x818cf8, 0.75);
  const shoeMat = createMat(0xbe185d, 0.6);
  const shoeSoleMat = createMat(0xf8fafc, 0.5);
  const eyeWhiteMat = createMat(0xf8fafc, 0.2);
  const irisMat = createMat(0x381e11, 0.3);
  const pupilMat = createMat(0x0a0a0a, 0.1);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mouthInnerMat = createMat(0x3b151b, 0.6);
  const lipMat = createMat(0x6b3026, 0.7);

  const pelvis = new THREE.Group();
  pelvis.position.y = 0.92;
  root.add(pelvis);

  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.38, 14, 1, true), skirtMat);
  skirt.position.y = 0.08;
  pelvis.add(skirt);

  // Left Leg
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.14, -0.08, 0);
  pelvis.add(leftHip);
  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 8), skinMat);
  leftThigh.position.y = -0.19;
  leftHip.add(leftThigh);
  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.38, 0);
  leftHip.add(leftKnee);
  const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.36, 8), skinMat);
  leftCalf.position.y = -0.18;
  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.26), shoeMat);
  leftShoe.position.set(0, -0.38, 0.05);
  const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.04, 0.28), shoeSoleMat);
  leftSole.position.set(0, -0.44, 0.05);
  leftKnee.add(leftCalf, leftShoe, leftSole);

  // Right Leg
  const rightHip = new THREE.Group();
  rightHip.position.set(0.14, -0.08, 0);
  pelvis.add(rightHip);
  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 8), skinMat);
  rightThigh.position.y = -0.19;
  rightHip.add(rightThigh);
  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.38, 0);
  rightHip.add(rightKnee);
  const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.36, 8), skinMat);
  rightCalf.position.y = -0.18;
  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.26), shoeMat);
  rightShoe.position.set(0, -0.38, 0.05);
  const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.04, 0.28), shoeSoleMat);
  rightSole.position.set(0, -0.44, 0.05);
  rightKnee.add(rightCalf, rightShoe, rightSole);

  // Spine & Torso
  const spine = new THREE.Group();
  spine.position.y = 0.18;
  pelvis.add(spine);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.58, 12), topMat);
  torso.position.y = 0.29;
  spine.add(torso);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 14), collarMat);
  collar.rotation.x = Math.PI * 0.5;
  collar.position.set(0, 0.58, 0.02);
  spine.add(collar);

  // Arms
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.36, 0.5, 0);
  spine.add(leftShoulder);
  const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.34, 8), topMat);
  leftArmMesh.position.y = -0.17;
  leftShoulder.add(leftArmMesh);
  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.34, 0);
  leftShoulder.add(leftElbow);
  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.28, 8), skinMat);
  leftForearm.position.y = -0.14;
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), skinMat);
  leftHand.position.y = -0.3;
  leftElbow.add(leftForearm, leftHand);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.36, 0.5, 0);
  spine.add(rightShoulder);
  const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.34, 8), topMat);
  rightArmMesh.position.y = -0.17;
  rightShoulder.add(rightArmMesh);
  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.34, 0);
  rightShoulder.add(rightElbow);
  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.28, 8), skinMat);
  rightForearm.position.y = -0.14;
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), skinMat);
  rightHand.position.y = -0.3;
  rightElbow.add(rightForearm, rightHand);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.74, 0);
  spine.add(headGroup);

  const headGeom = new THREE.SphereGeometry(0.38, 18, 14);
  headGeom.scale(1.02, 1.12, 1.02);
  const headMesh = new THREE.Mesh(headGeom, skinMat);
  headMesh.position.y = 0.34;
  headGroup.add(headMesh);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), skinDarkMat);
  nose.position.set(0, 0.33, 0.4);
  headGroup.add(nose);

  // Hair Base + Two Puffs
  const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.4, 14, 12), hairMat);
  hairBase.position.set(0, 0.38, -0.06);
  headGroup.add(hairBase);

  // Puff Left
  const lBand = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 6, 12), bandMat);
  lBand.position.set(-0.32, 0.68, 0.02);
  lBand.rotation.x = Math.PI * 0.4;
  const lPuff = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), hairMat);
  lPuff.position.set(-0.38, 0.78, 0.02);
  headGroup.add(lBand, lPuff);

  // Puff Right
  const rBand = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 6, 12), bandMat);
  rBand.position.set(0.32, 0.68, 0.02);
  rBand.rotation.x = Math.PI * 0.4;
  const rPuff = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), hairMat);
  rPuff.position.set(0.38, 0.78, 0.02);
  headGroup.add(rBand, rPuff);

  // Eyes
  const makeMaraEye = (isLeft) => {
    const eye = new THREE.Group();
    eye.position.set(isLeft ? -0.14 : 0.14, 0.38, 0.34);
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), eyeWhiteMat);
    sclera.scale.set(1.1, 1.15, 0.6);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 6), irisMat);
    iris.position.set(0, 0, 0.035);
    iris.scale.set(1, 1, 0.3);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), pupilMat);
    pupil.position.set(0, 0, 0.05);
    pupil.scale.set(1, 1, 0.2);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), shineMat);
    shine.position.set(0.018, 0.02, 0.058);
    const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.086, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat);
    eyelid.position.set(0, 0.01, 0.02);
    eyelid.rotation.x = -Math.PI * 0.45;
    eye.add(sclera, iris, pupil, shine, eyelid);
    return { eye, eyelid };
  };

  const leftEyeData = makeMaraEye(true);
  const rightEyeData = makeMaraEye(false);
  headGroup.add(leftEyeData.eye, rightEyeData.eye);

  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.028, 0.03), hairMat);
  leftBrow.position.set(-0.14, 0.49, 0.37);
  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.028, 0.03), hairMat);
  rightBrow.position.set(0.14, 0.49, 0.37);
  headGroup.add(leftBrow, rightBrow);

  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, 0.21, 0.37);
  headGroup.add(mouthGroup);
  const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mouthInnerMat);
  mouthCavity.scale.set(1.4, 0.4, 0.4);
  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.03), lipMat);
  upperLip.position.set(0, 0.018, 0.01);
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.03), lipMat);
  lowerLip.position.set(0, -0.018, 0.01);
  mouthGroup.add(mouthCavity, upperLip, lowerLip);

  return {
    root,
    pelvis,
    spine,
    headGroup,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftHand,
    rightHand,
    leftEye: leftEyeData,
    rightEye: rightEyeData,
    leftBrow,
    rightBrow,
    mouthGroup,
    mouthCavity,
  };
}

// ----------------------------------------------------------------------------
// Character 3: MOTHER (Warm, expressive Black woman with cardigan dress)
// ----------------------------------------------------------------------------
function createMotherRig() {
  const root = new THREE.Group();
  root.name = "Mother";
  root.scale.set(1.14, 1.14, 1.14);

  const skinMat = createMat(0x6b3b24, 0.65);
  const hairMat = createMat(0x181316, 0.9);
  const dressMat = createMat(0x881337, 0.7); // Deep rose/burgundy dress
  const cardiganMat = createMat(0xd97706, 0.7); // Warm amber knit cardigan
  const shoeMat = createMat(0x451a03, 0.6);
  const eyeWhiteMat = createMat(0xf8fafc, 0.2);
  const irisMat = createMat(0x381e11, 0.3);
  const pupilMat = createMat(0x0a0a0a, 0.1);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mouthInnerMat = createMat(0x381515, 0.6);
  const lipMat = createMat(0x831843, 0.7);

  const pelvis = new THREE.Group();
  pelvis.position.y = 1.08;
  root.add(pelvis);

  // Long gentle dress skirt
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.52, 0.94, 14), dressMat);
  skirt.position.y = -0.47;
  pelvis.add(skirt);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.26), shoeMat);
  leftFoot.position.set(-0.16, -0.96, 0.06);
  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.26), shoeMat);
  rightFoot.position.set(0.16, -0.96, 0.06);
  pelvis.add(leftFoot, rightFoot);

  // Spine & Torso with Cardigan
  const spine = new THREE.Group();
  spine.position.y = 0.08;
  pelvis.add(spine);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.76, 14), dressMat);
  torso.position.y = 0.38;
  spine.add(torso);

  // Cardigan wrap panels
  const cardL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.12), cardiganMat);
  cardL.position.set(-0.24, 0.38, 0.24);
  const cardR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.12), cardiganMat);
  cardR.position.set(0.24, 0.38, 0.24);
  spine.add(cardL, cardR);

  // Arms
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.44, 0.62, 0);
  spine.add(leftShoulder);
  const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.44, 10), cardiganMat);
  leftArmMesh.position.y = -0.22;
  leftShoulder.add(leftArmMesh);
  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.44, 0);
  leftShoulder.add(leftElbow);
  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.36, 10), skinMat);
  leftForearm.position.y = -0.18;
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
  leftHand.position.y = -0.38;
  leftElbow.add(leftForearm, leftHand);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.44, 0.62, 0);
  spine.add(rightShoulder);
  const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.44, 10), cardiganMat);
  rightArmMesh.position.y = -0.22;
  rightShoulder.add(rightArmMesh);
  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.44, 0);
  rightShoulder.add(rightElbow);
  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.36, 10), skinMat);
  rightForearm.position.y = -0.18;
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
  rightHand.position.y = -0.38;
  rightElbow.add(rightForearm, rightHand);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.9, 0);
  spine.add(headGroup);

  const headGeom = new THREE.SphereGeometry(0.4, 20, 16);
  headGeom.scale(0.98, 1.18, 1.02);
  const headMesh = new THREE.Mesh(headGeom, skinMat);
  headMesh.position.y = 0.36;
  headGroup.add(headMesh);

  // Elegant braided bun hairstyle
  const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 14), hairMat);
  hairBase.position.set(0, 0.42, -0.06);
  const bun = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), hairMat);
  bun.position.set(0, 0.72, -0.12);
  headGroup.add(hairBase, bun);

  // Eyes
  const makeMomEye = (isLeft) => {
    const eye = new THREE.Group();
    eye.position.set(isLeft ? -0.15 : 0.15, 0.4, 0.36);
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.082, 12, 8), eyeWhiteMat);
    sclera.scale.set(1.1, 1.1, 0.6);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 6), irisMat);
    iris.position.set(0, 0, 0.038);
    iris.scale.set(1, 1, 0.3);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), pupilMat);
    pupil.position.set(0, 0, 0.052);
    pupil.scale.set(1, 1, 0.2);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), shineMat);
    shine.position.set(0.02, 0.02, 0.06);
    const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat);
    eyelid.position.set(0, 0.01, 0.02);
    eyelid.rotation.x = -Math.PI * 0.45;
    eye.add(sclera, iris, pupil, shine, eyelid);
    return { eye, eyelid };
  };

  const leftEyeData = makeMomEye(true);
  const rightEyeData = makeMomEye(false);
  headGroup.add(leftEyeData.eye, rightEyeData.eye);

  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), hairMat);
  leftBrow.position.set(-0.15, 0.51, 0.39);
  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), hairMat);
  rightBrow.position.set(0.15, 0.51, 0.39);
  headGroup.add(leftBrow, rightBrow);

  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, 0.22, 0.39);
  headGroup.add(mouthGroup);
  const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mouthInnerMat);
  mouthCavity.scale.set(1.4, 0.4, 0.4);
  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.03), lipMat);
  upperLip.position.set(0, 0.02, 0.01);
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.03), lipMat);
  lowerLip.position.set(0, -0.02, 0.01);
  mouthGroup.add(mouthCavity, upperLip, lowerLip);

  return {
    root,
    pelvis,
    spine,
    headGroup,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftHand,
    rightHand,
    leftEye: leftEyeData,
    rightEye: rightEyeData,
    leftBrow,
    rightBrow,
    mouthGroup,
    mouthCavity,
  };
}

// ----------------------------------------------------------------------------
// Character 4: DOCTOR (Dr. Bennett - caring doctor in lab coat & stethoscope)
// ----------------------------------------------------------------------------
function createDoctorRig() {
  const root = new THREE.Group();
  root.name = "Doctor";
  root.scale.set(1.18, 1.18, 1.18);

  const skinMat = createMat(0x6f4028, 0.65);
  const coatMat = createMat(0xf8fafc, 0.5);
  const scrubMat = createMat(0x0d9488, 0.6);
  const pantsMat = createMat(0x334155, 0.8);
  const shoeMat = createMat(0x0f172a, 0.6);
  const hairMat = createMat(0x181316, 0.9);
  const silverMat = createMat(0x94a3b8, 0.3, 0.7);
  const eyeWhiteMat = createMat(0xf8fafc, 0.2);
  const irisMat = createMat(0x381e11, 0.3);
  const pupilMat = createMat(0x0a0a0a, 0.1);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mouthInnerMat = createMat(0x381515, 0.6);
  const lipMat = createMat(0x562f1a, 0.7);

  const pelvis = new THREE.Group();
  pelvis.position.y = 1.08;
  root.add(pelvis);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.88, 10), pantsMat);
  leftLeg.position.set(-0.18, -0.44, 0);
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.88, 10), pantsMat);
  rightLeg.position.set(0.18, -0.44, 0);
  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.3), shoeMat);
  leftFoot.position.set(-0.18, -0.92, 0.06);
  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.3), shoeMat);
  rightFoot.position.set(0.18, -0.92, 0.06);
  pelvis.add(leftLeg, rightLeg, leftFoot, rightFoot);

  const spine = new THREE.Group();
  spine.position.y = 0.1;
  pelvis.add(spine);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.78, 14), scrubMat);
  torso.position.y = 0.39;
  spine.add(torso);

  const coatBack = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.46, 0.88, 14, 1, false, Math.PI * 0.25, Math.PI * 1.5), coatMat);
  coatBack.position.y = 0.36;
  spine.add(coatBack);

  const stethTorus = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 6, 16), createMat(0x1e293b, 0.5));
  stethTorus.rotation.x = Math.PI * 0.45;
  stethTorus.position.set(0, 0.72, 0.12);
  const stethPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10), silverMat);
  stethPiece.rotation.x = Math.PI * 0.5;
  stethPiece.position.set(0.08, 0.52, 0.34);
  spine.add(stethTorus, stethPiece);

  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.46, 0.64, 0);
  spine.add(leftShoulder);
  const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.44, 10), coatMat);
  leftArmMesh.position.y = -0.22;
  leftShoulder.add(leftArmMesh);
  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.44, 0);
  leftShoulder.add(leftElbow);
  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.36, 10), coatMat);
  leftForearm.position.y = -0.18;
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
  leftHand.position.y = -0.38;
  leftElbow.add(leftForearm, leftHand);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.46, 0.64, 0);
  spine.add(rightShoulder);
  const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.44, 10), coatMat);
  rightArmMesh.position.y = -0.22;
  rightShoulder.add(rightArmMesh);
  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.44, 0);
  rightShoulder.add(rightElbow);
  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.36, 10), coatMat);
  rightForearm.position.y = -0.18;
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
  rightHand.position.y = -0.38;
  rightElbow.add(rightForearm, rightHand);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.92, 0);
  spine.add(headGroup);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), skinMat);
  headMesh.scale.set(0.98, 1.15, 1.02);
  headMesh.position.y = 0.36;
  headGroup.add(headMesh);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), hairMat);
  hair.position.set(0, 0.45, -0.05);
  hair.scale.set(1.02, 1.05, 0.98);
  headGroup.add(hair);

  const glassesMat = createMat(0x0f172a, 0.4, 0.5);
  const lGlass = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 6, 14), glassesMat);
  lGlass.position.set(-0.16, 0.4, 0.42);
  const rGlass = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 6, 14), glassesMat);
  rGlass.position.set(0.16, 0.4, 0.42);
  const gBridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.02), glassesMat);
  gBridge.position.set(0, 0.4, 0.43);
  headGroup.add(lGlass, rGlass, gBridge);

  const makeDocEye = (isLeft) => {
    const eye = new THREE.Group();
    eye.position.set(isLeft ? -0.16 : 0.16, 0.4, 0.36);
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), eyeWhiteMat);
    sclera.scale.set(1.1, 1.1, 0.6);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 6), irisMat);
    iris.position.set(0, 0, 0.038);
    iris.scale.set(1, 1, 0.3);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), pupilMat);
    pupil.position.set(0, 0, 0.052);
    pupil.scale.set(1, 1, 0.2);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), shineMat);
    shine.position.set(0.02, 0.02, 0.06);
    const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.086, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat);
    eyelid.position.set(0, 0.01, 0.02);
    eyelid.rotation.x = -Math.PI * 0.45;
    eye.add(sclera, iris, pupil, shine, eyelid);
    return { eye, eyelid };
  };

  const leftEyeData = makeDocEye(true);
  const rightEyeData = makeDocEye(false);
  headGroup.add(leftEyeData.eye, rightEyeData.eye);

  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), hairMat);
  leftBrow.position.set(-0.16, 0.52, 0.39);
  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), hairMat);
  rightBrow.position.set(0.16, 0.52, 0.39);
  headGroup.add(leftBrow, rightBrow);

  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, 0.22, 0.39);
  headGroup.add(mouthGroup);
  const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mouthInnerMat);
  mouthCavity.scale.set(1.4, 0.4, 0.4);
  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.024, 0.03), lipMat);
  upperLip.position.set(0, 0.02, 0.01);
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.03), lipMat);
  lowerLip.position.set(0, -0.02, 0.01);
  mouthGroup.add(mouthCavity, upperLip, lowerLip);

  return {
    root,
    pelvis,
    spine,
    headGroup,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftHand,
    rightHand,
    leftEye: leftEyeData,
    rightEye: rightEyeData,
    leftBrow,
    rightBrow,
    mouthGroup,
    mouthCavity,
  };
}

// ----------------------------------------------------------------------------
// Character 5: THE TALKING MOON (Magical cartoon Moon with expressive animated face)
// ----------------------------------------------------------------------------
function createTalkingMoonRig() {
  const root = new THREE.Group();
  root.name = "TalkingMoon";

  // Glowing sphere base
  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xfff6cc,
    emissive: 0xffe680,
    emissiveIntensity: 0.55,
    roughness: 0.7,
    metalness: 0.05,
  });
  const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 28), moonMat);
  root.add(moonMesh);

  // Soft glowing craters
  const craterMat = createMat(0xedd89a, 0.85);
  const craters = [
    [-0.5, 0.4, 1.25, 0.16],
    [0.6, -0.3, 1.22, 0.2],
    [-0.2, -0.6, 1.24, 0.14],
  ];
  craters.forEach(([cx, cy, cz, cr]) => {
    const c = new THREE.Mesh(new THREE.SphereGeometry(cr, 10, 8), craterMat);
    c.position.set(cx, cy, cz);
    c.scale.z = 0.25;
    root.add(c);
  });

  // Halo aura
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 24, 20),
    new THREE.MeshBasicMaterial({ color: 0xfff8d6, transparent: true, opacity: 0.28, side: THREE.BackSide }),
  );
  root.add(halo);

  // Cartoon Face Group
  const faceGroup = new THREE.Group();
  faceGroup.position.set(0, 0, 1.15);
  root.add(faceGroup);

  // Rosy Cheeks
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xfcb07e, transparent: true, opacity: 0.45 });
  const lCheek = new THREE.Mesh(new THREE.CircleGeometry(0.18, 16), blushMat);
  lCheek.position.set(-0.55, -0.15, 0.22);
  const rCheek = new THREE.Mesh(new THREE.CircleGeometry(0.18, 16), blushMat);
  rCheek.position.set(0.55, -0.15, 0.22);
  faceGroup.add(lCheek, rCheek);

  // Cartoon Eyes (White + Golden Amber Iris + Pupil + Shine + Eyelids)
  const eyeWhiteMat = createMat(0xffffff, 0.2);
  const irisMat = createMat(0xb45309, 0.3);
  const pupilMat = createMat(0x0f172a, 0.1);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyelidMat = createMat(0xfff3b0, 0.6);

  const makeMoonEye = (isLeft) => {
    const eye = new THREE.Group();
    eye.position.set(isLeft ? -0.36 : 0.36, 0.25, 0.2);
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), eyeWhiteMat);
    sclera.scale.set(1.1, 1.15, 0.5);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), irisMat);
    iris.position.set(0, -0.02, 0.06);
    iris.scale.set(1, 1, 0.3);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), pupilMat);
    pupil.position.set(0, -0.02, 0.08);
    pupil.scale.set(1, 1, 0.2);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), shineMat);
    shine.position.set(0.04, 0.03, 0.095);
    const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), eyelidMat);
    eyelid.position.set(0, 0.01, 0.02);
    eyelid.rotation.x = -Math.PI * 0.45;
    eye.add(sclera, iris, pupil, shine, eyelid);
    return { eye, eyelid, iris };
  };

  const leftEyeData = makeMoonEye(true);
  const rightEyeData = makeMoonEye(false);
  faceGroup.add(leftEyeData.eye, rightEyeData.eye);

  // Gentle, wise Eyebrows
  const browMat = createMat(0x78350f, 0.7);
  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.04), browMat);
  leftBrow.position.set(-0.36, 0.48, 0.2);
  leftBrow.rotation.z = -0.06;
  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.04), browMat);
  rightBrow.position.set(0.36, 0.48, 0.2);
  rightBrow.rotation.z = 0.06;
  faceGroup.add(leftBrow, rightBrow);

  // Animated Speaking Mouth Rig
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, -0.32, 0.25);
  faceGroup.add(mouthGroup);

  const mouthInnerMat = createMat(0x450a0a, 0.5);
  const lipMat = createMat(0x9a3412, 0.6);
  const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), mouthInnerMat);
  mouthCavity.scale.set(1.5, 0.4, 0.4);
  mouthCavity.position.set(0, 0, -0.03);

  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.05), lipMat);
  upperLip.position.set(0, 0.03, 0.02);
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.05), lipMat);
  lowerLip.position.set(0, -0.03, 0.02);
  mouthGroup.add(mouthCavity, upperLip, lowerLip);

  return {
    root,
    faceGroup,
    leftEye: leftEyeData,
    rightEye: rightEyeData,
    leftBrow,
    rightBrow,
    mouthGroup,
    mouthCavity,
  };
}

// ----------------------------------------------------------------------------
// 3D Environments & Props
// ----------------------------------------------------------------------------
function createEnvironmentForScene(sceneId) {
  const envGroup = new THREE.Group();

  if (sceneId === "meet-milo" || sceneId === "family-time") {
    // Warm Cozy Living Room & Garden Play Area
    const floorMat = createMat(0xb45309, 0.7);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), floorMat);
    floor.position.y = -0.1;
    envGroup.add(floor);

    const wallMat = createMat(0xfef3c7, 0.85);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.2), wallMat);
    wall.position.set(0, 3, -5.5);
    envGroup.add(wall);

    // Large sunlit window with soft curtains
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.4, 0.1), createMat(0xffffff, 0.4));
    winFrame.position.set(0, 3.2, -5.4);
    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.2), new THREE.MeshBasicMaterial({ color: 0x93c5fd }));
    winGlass.position.set(0, 3.2, -5.35);
    envGroup.add(winFrame, winGlass);

    const curtainMat = createMat(0xffedd5, 0.9, 0.0, { transparent: true, opacity: 0.85 });
    const leftCurtain = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.4, 0.08), curtainMat);
    leftCurtain.position.set(-1.8, 3.2, -5.3);
    const rightCurtain = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.4, 0.08), curtainMat);
    rightCurtain.position.set(1.8, 3.2, -5.3);
    envGroup.add(leftCurtain, rightCurtain);

    // Scrabble & Play Table
    const tableMat = createMat(0xd97706, 0.6);
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 24), tableMat);
    table.position.set(0, 0.85, 0);
    const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.85, 12), tableMat);
    tableLeg.position.set(0, 0.42, 0);
    envGroup.add(table, tableLeg);

    const tileColors = [0xf59e0b, 0xef4444, 0x3b82f6, 0x10b981];
    for (let i = 0; i < 6; i += 1) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.14), createMat(tileColors[i % 4], 0.5));
      tile.position.set(-0.4 + i * 0.16, 0.92, 0.1 + (i % 2) * 0.08);
      tile.rotation.y = (i - 2.5) * 0.1;
      envGroup.add(tile);
    }
  } else if (sceneId === "the-difficult-news") {
    // Clinic / Office
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), createMat(0xe2e8f0, 0.6));
    floor.position.y = -0.1;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.2), createMat(0xf1f5f9, 0.8));
    wall.position.set(0, 3, -5.5);
    envGroup.add(floor, wall);

    const deskMat = createMat(0x64748b, 0.6);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.4), deskMat);
    desk.position.set(0, 0.9, -1.2);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 1.3), deskMat);
    legL.position.set(-1.7, 0.45, -1.2);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 1.3), deskMat);
    legR.position.set(1.7, 0.45, -1.2);
    envGroup.add(desk, legL, legR);
  } else if (sceneId === "hospital-visit" || sceneId === "saying-goodbye") {
    // Hospital Room
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), createMat(0xe0f2fe, 0.6));
    floor.position.y = -0.1;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.2), createMat(0xf0fdf4, 0.8));
    wall.position.set(0, 3, -5.5);
    envGroup.add(floor, wall);

    // Bed
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 3.2), createMat(0xf1f5f9, 0.5));
    bedFrame.position.set(1.4, 0.45, -0.6);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 3.1), createMat(0xffffff, 0.6));
    mattress.position.set(1.4, 0.75, -0.6);
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.26, 2.2), createMat(0xf472b6, 0.8));
    blanket.position.set(1.4, 0.77, 0.0);
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.55), createMat(0xffffff, 0.7));
    pillow.position.set(1.4, 0.92, -1.8);
    pillow.rotation.x = 0.2;
    envGroup.add(bedFrame, mattress, blanket, pillow);

    // Bedside Table with Daisy Vase
    const sideTable = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16), createMat(0xffffff, 0.5));
    sideTable.position.set(-0.2, 0.4, -1.8);
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12), createMat(0x60a5fa, 0.3));
    vase.position.set(-0.2, 0.97, -1.8);
    const daisy = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), createMat(0xfde047, 0.6));
    daisy.position.set(-0.2, 1.2, -1.8);
    envGroup.add(sideTable, vase, daisy);

    // Chair
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.7), createMat(0x38bdf8, 0.6));
    chair.position.set(-0.35, 0.55, 0.2);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.1), createMat(0x38bdf8, 0.6));
    chairBack.position.set(-0.7, 0.95, 0.2);
    chairBack.rotation.y = Math.PI * 0.5;
    envGroup.add(chair, chairBack);
  } else if (sceneId === "grieving-with-mom" || sceneId === "coping-with-grief") {
    // Bedroom / Settee
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), createMat(0x78350f, 0.7));
    floor.position.y = -0.1;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.2), createMat(0x312e81, 0.9));
    wall.position.set(0, 3, -5.5);
    envGroup.add(floor, wall);

    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 1.2), createMat(0x92400e, 0.7));
    bench.position.set(0, 0.45, 0);
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 1.1), createMat(0xc084fc, 0.8));
    cushion.position.set(0, 0.75, 0);
    envGroup.add(bench, cushion);
  } else if (sceneId === "dear-moon-window" || sceneId === "conversation-with-moon" || sceneId === "intro" || sceneId === "ending") {
    // Night Sky, Window & Room
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), createMat(0x1e1b4b, 0.8));
    floor.position.y = -0.1;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.2), createMat(0x0f172a, 0.9));
    wall.position.set(0, 3, -5.5);
    envGroup.add(floor, wall);

    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 4.0, 0.15), createMat(0x334155, 0.5));
    winFrame.position.set(0, 3.2, -5.4);
    envGroup.add(winFrame);

    // Letter on sill
    const letter = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xfffbeb, emissive: 0xffedd5, emissiveIntensity: 0.25 }),
    );
    letter.position.set(0, 1.35, -0.6);
    envGroup.add(letter);
  } else {
    // sceneId === "hopeful-conclusion": Sunrise Hilltop
    const hillMat = createMat(0x166534, 0.85);
    const hillGeom = new THREE.SphereGeometry(7.5, 32, 20);
    hillGeom.scale(2.2, 0.55, 1.6);
    const hill = new THREE.Mesh(hillGeom, hillMat);
    hill.position.set(0, -3.1, -0.4);
    envGroup.add(hill);

    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 24, 20),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.75 }),
    );
    sunGlow.position.set(0, 2.5, -9);
    envGroup.add(sunGlow);

    const flowerColors = [0xfde047, 0xf472b6, 0x60a5fa, 0xffffff];
    for (let i = 0; i < 20; i += 1) {
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), createMat(flowerColors[i % 4], 0.6));
      const angle = (i / 20) * Math.PI * 2;
      const rad = 1.2 + Math.random() * 2.5;
      fl.position.set(Math.cos(angle) * rad, 0.2 + Math.random() * 0.15, Math.sin(angle) * rad);
      envGroup.add(fl);
    }
  }

  // Twinkling 3D Stars
  const starCount = 40;
  const starMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
  const starGeom = new THREE.OctahedronGeometry(0.065, 0);
  for (let i = 0; i < starCount; i += 1) {
    const s = new THREE.Mesh(starGeom, starMat);
    const theta = Math.random() * Math.PI * 2;
    const r = 4.5 + Math.random() * 5.5;
    const y = 1.6 + Math.random() * 5.0;
    const z = -3.5 - Math.random() * 6.5;
    s.position.set(Math.cos(theta) * r, y, z);
    envGroup.add(s);
  }

  return envGroup;
}

// ----------------------------------------------------------------------------
// Main Milo3DScene Component
// ----------------------------------------------------------------------------
export default function Milo3DScene({
  sceneId = "meet-milo",
  talking = "",
  isSpeaking = false,
  speechProgress = 0,
  cameraMode = "cinematic",
  zoomLevel = 1.0,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    talking,
    isSpeaking,
    speechProgress,
    sceneId,
    cameraMode,
    zoomLevel,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  });

  const [webGLSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const testCanvas = document.createElement("canvas");
      return Boolean(testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    stateRef.current.talking = talking;
    stateRef.current.isSpeaking = isSpeaking;
    stateRef.current.speechProgress = speechProgress;
    stateRef.current.sceneId = sceneId;
    stateRef.current.cameraMode = cameraMode;
    stateRef.current.zoomLevel = zoomLevel;
  }, [talking, isSpeaking, speechProgress, sceneId, cameraMode, zoomLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webGLSupported) return undefined;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();

    const bgColors = {
      "meet-milo": 0x1e1b4b,
      "family-time": 0xfef3c7,
      "the-difficult-news": 0xf1f5f9,
      "hospital-visit": 0xf0fdf4,
      "saying-goodbye": 0x312e81,
      "grieving-with-mom": 0x0f172a,
      "dear-moon-window": 0x0b132b,
      "conversation-with-moon": 0x070d1e,
      "coping-with-grief": 0x111827,
      "hopeful-conclusion": 0x1e293b,
      "intro": 0x090e1f,
      "ending": 0x060914,
    };
    scene.background = new THREE.Color(bgColors[sceneId] || 0x0f172a);

    const camera = new THREE.PerspectiveCamera(38 / (zoomLevel || 1.0), width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.innerHTML = "";
      container.appendChild(renderer.domElement);
    } catch {
      return undefined;
    }

    // Lights
    const ambient = new THREE.AmbientLight(0xffedd5, 0.95);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.35);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.75);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    // Environment
    const env = createEnvironmentForScene(sceneId);
    scene.add(env);

    // Character Cast Construction
    const milo = createMiloRig();
    scene.add(milo.root);

    let mara = null;
    let mother = null;
    let doctor = null;
    let moon = null;

    if (["meet-milo", "family-time", "the-difficult-news", "hospital-visit", "saying-goodbye"].includes(sceneId)) {
      mara = createMaraRig();
      scene.add(mara.root);
    }

    if (["family-time", "the-difficult-news", "saying-goodbye", "grieving-with-mom"].includes(sceneId)) {
      mother = createMotherRig();
      scene.add(mother.root);
    }

    if (sceneId === "the-difficult-news") {
      doctor = createDoctorRig();
      scene.add(doctor.root);
    }

    // Talking Moon in nighttime and conversational scenes
    if (["dear-moon-window", "conversation-with-moon", "coping-with-grief", "intro", "ending"].includes(sceneId)) {
      moon = createTalkingMoonRig();
      if (sceneId === "conversation-with-moon") {
        moon.root.position.set(1.8, 3.2, -4.5);
      } else if (sceneId === "intro") {
        moon.root.position.set(0, 2.2, -4.8);
      } else if (sceneId === "ending") {
        moon.root.position.set(1.5, 3.6, -5.5);
      } else {
        moon.root.position.set(2.4, 3.8, -6.5);
      }
      scene.add(moon.root);
    }

    // Staging and initial placement
    if (sceneId === "meet-milo") {
      milo.root.position.set(-1.8, 0, 0);
      mara.root.position.set(1.8, 0, 0);
    } else if (sceneId === "family-time") {
      milo.root.position.set(-0.9, 0, 0.3);
      mara.root.position.set(0.9, 0, 0.3);
      mother.root.position.set(0, 0, -0.6);
    } else if (sceneId === "the-difficult-news") {
      doctor.root.position.set(1.2, 0, -1.0);
      doctor.root.rotation.y = -0.4;
      mother.root.position.set(-0.8, 0, -0.6);
      mother.root.rotation.y = 0.4;
      milo.root.position.set(-1.6, 0, 0.2);
      milo.root.rotation.y = 0.55;
      mara.root.position.set(-0.2, 0, 0.2);
      mara.root.rotation.y = -0.3;
    } else if (sceneId === "hospital-visit") {
      mara.root.position.set(1.4, 0.65, -0.6);
      mara.root.rotation.x = -Math.PI * 0.45;
      milo.root.position.set(-0.35, 0, 0.2);
      milo.root.rotation.y = 0.65;
      milo.pelvis.position.y = 0.55;
      milo.leftHip.rotation.x = -Math.PI * 0.5;
      milo.rightHip.rotation.x = -Math.PI * 0.5;
    } else if (sceneId === "saying-goodbye") {
      mara.root.position.set(1.4, 0.65, -0.6);
      mara.root.rotation.x = -Math.PI * 0.45;
      milo.root.position.set(-0.4, 0, 0.1);
      milo.root.rotation.y = 0.65;
      mother.root.position.set(0.3, 0, -0.4);
      mother.root.rotation.y = 0.45;
    } else if (sceneId === "grieving-with-mom") {
      milo.root.position.set(-0.4, 0, 0);
      milo.root.rotation.y = 0.25;
      milo.pelvis.position.y = 0.65;
      milo.leftHip.rotation.x = -Math.PI * 0.45;
      milo.rightHip.rotation.x = -Math.PI * 0.45;

      mother.root.position.set(0.4, 0, 0);
      mother.root.rotation.y = -0.25;
      mother.pelvis.position.y = 0.65;
    } else if (sceneId === "dear-moon-window" || sceneId === "conversation-with-moon") {
      milo.root.position.set(-0.2, 0, -0.3);
      milo.root.rotation.y = 0.35;
    } else if (sceneId === "hopeful-conclusion") {
      milo.root.position.set(0, 0.1, 0.1);
      milo.root.rotation.y = 0.05;
    } else if (sceneId === "ending") {
      milo.root.position.set(-0.6, 0.1, 0.2);
      milo.root.rotation.y = 0.35;
    }

    // Pointer events
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      stateRef.current.mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.fov = 38 / (stateRef.current.zoomLevel || 1.0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation variables
    let animId;
    const clock = new THREE.Clock();
    let blinkTimer = 3.0;
    let isBlinking = false;
    let blinkProgress = 0;

    const cameraTarget = new THREE.Vector3(0, 1.45, 0);
    const cameraPosTarget = new THREE.Vector3(0, 1.8, 5.2);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const { mouse, talking: currentTalking, isSpeaking: speechActive, cameraMode: currentCamMode, zoomLevel: zL } = stateRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Update camera FOV with zoom
      camera.fov = THREE.MathUtils.lerp(camera.fov, 38 / (zL || 1.0), 0.08);
      camera.updateProjectionMatrix();

      // ------------------------------------------------------------------------
      // Camera Director
      // ------------------------------------------------------------------------
      if (currentCamMode === "cinematic") {
        if (sceneId === "intro") {
          // Slow dramatic pan up to the rising Moon
          cameraPosTarget.set(0, 2.0 + Math.sin(time * 0.3) * 0.2, 5.8 - time * 0.1);
          cameraTarget.set(0, 2.0, 0);
        } else if (sceneId === "ending") {
          // Slow pull back showing Milo and Moon in peace
          cameraPosTarget.set(0, 2.2, 6.4 + Math.sin(time * 0.1) * 0.3);
          cameraTarget.set(0, 1.6, 0);
        } else if (currentTalking === "Moon" && moon) {
          cameraPosTarget.set(moon.root.position.x * 0.7, moon.root.position.y * 0.85, 3.8);
          cameraTarget.set(moon.root.position.x, moon.root.position.y, moon.root.position.z);
        } else if (currentTalking === "Milo") {
          cameraPosTarget.set(milo.root.position.x * 0.7, 1.85, 3.8);
          cameraTarget.set(milo.root.position.x, 1.45, milo.root.position.z);
        } else if (currentTalking === "Mara" && mara) {
          cameraPosTarget.set(mara.root.position.x * 0.7, 1.7, 3.6);
          cameraTarget.set(mara.root.position.x, 1.35, mara.root.position.z);
        } else if (currentTalking === "Mother" && mother) {
          cameraPosTarget.set(mother.root.position.x * 0.6, 2.0, 4.0);
          cameraTarget.set(mother.root.position.x, 1.65, mother.root.position.z);
        } else if (currentTalking === "Doctor" && doctor) {
          cameraPosTarget.set(doctor.root.position.x * 0.6, 2.05, 4.0);
          cameraTarget.set(doctor.root.position.x, 1.65, doctor.root.position.z);
        } else {
          cameraPosTarget.set(Math.sin(time * 0.25) * 0.35, 1.85, 5.2);
          cameraTarget.set(0, 1.45, 0);
        }

        camera.position.lerp(cameraPosTarget, 0.04);
        camera.lookAt(cameraTarget);
      } else {
        // Free Orbit Mode
        camera.position.x = mouse.x * 1.6;
        camera.position.y = 1.8 + mouse.y * 0.8;
        camera.position.z = 5.2;
        camera.lookAt(0, 1.45, 0);
      }

      // ------------------------------------------------------------------------
      // Procedural Coordinated Character Actions
      // ------------------------------------------------------------------------
      // Universal Blinking
      blinkTimer -= delta;
      if (blinkTimer <= 0) {
        isBlinking = true;
        blinkProgress = 0;
        blinkTimer = 3.2 + Math.random() * 3.5;
      }
      if (isBlinking) {
        blinkProgress += delta * 9.0;
        const blinkPhase = Math.sin(Math.min(Math.PI, blinkProgress * Math.PI));
        const eyelidRot = -Math.PI * 0.45 + blinkPhase * (Math.PI * 0.45);
        milo.leftEye.eyelid.rotation.x = eyelidRot;
        milo.rightEye.eyelid.rotation.x = eyelidRot;
        if (mara) {
          mara.leftEye.eyelid.rotation.x = eyelidRot;
          mara.rightEye.eyelid.rotation.x = eyelidRot;
        }
        if (mother) {
          mother.leftEye.eyelid.rotation.x = eyelidRot;
          mother.rightEye.eyelid.rotation.x = eyelidRot;
        }
        if (doctor) {
          doctor.leftEye.eyelid.rotation.x = eyelidRot;
          doctor.rightEye.eyelid.rotation.x = eyelidRot;
        }
        if (moon) {
          moon.leftEye.eyelid.rotation.x = eyelidRot;
          moon.rightEye.eyelid.rotation.x = eyelidRot;
        }
        if (blinkProgress >= 1.0) isBlinking = false;
      }

      // 1. Milo Actions & Lip-Sync
      const miloIsTalking = currentTalking === "Milo" && speechActive;
      milo.spine.position.y = 0.14 + Math.sin(time * 2.0) * 0.015;

      if (miloIsTalking) {
        const osc = Math.abs(Math.sin(time * 15.0) * Math.cos(time * 8.0));
        milo.mouthGroup.scale.set(1.0 + Math.sin(time * 10.0) * 0.3, 0.5 + osc * 1.8, 1.0);
        milo.headGroup.rotation.x = Math.sin(time * 8.0) * 0.04;
        milo.headGroup.rotation.z = Math.sin(time * 4.0) * 0.03;
      } else {
        milo.mouthGroup.scale.lerp(new THREE.Vector3(1, 0.35, 1), 0.15);
      }

      // 2. Physical interactions by scene
      if (sceneId === "meet-milo") {
        // Running toward each other, then holding hands and walking together
        const meetPhase = Math.min(1.0, time / 3.5);
        if (meetPhase < 0.9) {
          // Running cycle toward center
          const runFreq = time * 8.0;
          milo.root.position.x = THREE.MathUtils.lerp(-1.8, -0.45, meetPhase);
          milo.leftHip.rotation.x = Math.sin(runFreq) * 0.65;
          milo.rightHip.rotation.x = Math.sin(runFreq + Math.PI) * 0.65;
          milo.leftShoulder.rotation.x = Math.sin(runFreq + Math.PI) * 0.55;
          milo.rightShoulder.rotation.x = Math.sin(runFreq) * 0.55;

          mara.root.position.x = THREE.MathUtils.lerp(1.8, 0.45, meetPhase);
          mara.leftHip.rotation.x = Math.sin(runFreq + Math.PI) * 0.65;
          mara.rightHip.rotation.x = Math.sin(runFreq) * 0.65;
          mara.leftShoulder.rotation.x = Math.sin(runFreq) * 0.55;
          mara.rightShoulder.rotation.x = Math.sin(runFreq + Math.PI) * 0.55;
        } else {
          // Standing & Holding Hands
          milo.root.position.x = -0.42;
          mara.root.position.x = 0.42;
          milo.leftHip.rotation.x = 0;
          milo.rightHip.rotation.x = 0;
          mara.leftHip.rotation.x = 0;
          mara.rightHip.rotation.x = 0;

          // Joined hands in the center
          milo.rightShoulder.rotation.set(-0.35, 0, -0.35);
          milo.rightElbow.rotation.set(-0.2, 0, -0.15);
          mara.leftShoulder.rotation.set(-0.35, 0, 0.35);
          mara.leftElbow.rotation.set(-0.2, 0, 0.15);

          // Waving to viewer with outer arms
          milo.leftShoulder.rotation.x = -1.2 + Math.sin(time * 4.0) * 0.15;
          milo.leftShoulder.rotation.z = 0.4 + Math.sin(time * 6.0) * 0.2;
          mara.rightShoulder.rotation.x = -1.2 + Math.sin(time * 4.5) * 0.15;
          mara.rightShoulder.rotation.z = -0.4 + Math.sin(time * 6.0) * 0.2;
        }
      } else if (sceneId === "family-time" && mother) {
        // Mother embraces Milo and Mara in a warm family hug
        mother.root.position.z = THREE.MathUtils.lerp(-0.6, -0.1, Math.min(1.0, time / 2.5));
        mother.spine.rotation.x = 0.2;
        // Mother's arms wrap around children
        mother.leftShoulder.rotation.set(-0.7, 0.3, 0.55);
        mother.rightShoulder.rotation.set(-0.7, -0.3, -0.55);

        // Milo and Mara lean into the hug
        milo.root.position.x = -0.65;
        milo.root.rotation.y = 0.45;
        milo.rightShoulder.rotation.set(-0.8, -0.2, -0.4);

        mara.root.position.x = 0.65;
        mara.root.rotation.y = -0.45;
        mara.leftShoulder.rotation.set(-0.8, 0.2, 0.4);
      } else if ((sceneId === "hospital-visit" || sceneId === "saying-goodbye") && mara) {
        // Holding Mara's hand by the hospital bed
        milo.rightShoulder.rotation.set(-0.8, -0.3, -0.35);
        milo.headGroup.rotation.set(0.12, 0.55, 0); // Looking tenderly at Mara

        mara.headGroup.rotation.set(0.1, -0.45, 0); // Mara gazing back at Milo
        mara.leftShoulder.rotation.set(-0.5, 0.2, 0.3); // Hand meeting Milo's
      } else if (sceneId === "grieving-with-mom" && mother) {
        // Milo crying & wiping tears; Mother hugging and comforting him
        const cryCycle = Math.sin(time * 5.0);
        milo.headGroup.rotation.set(0.35, 0.1, cryCycle * 0.04);
        milo.rightShoulder.rotation.set(-1.25, -0.25, -0.35); // Hand to eye wiping tear
        milo.rightElbow.rotation.set(-0.8, 0, 0);

        // Mother's comforting arm around Milo
        mother.leftShoulder.rotation.set(-0.75, 0.35, 0.5);
        mother.headGroup.rotation.set(0.2, -0.25, 0);
      } else if (sceneId === "dear-moon-window" || sceneId === "conversation-with-moon") {
        // Milo points up to the Moon & looks up into its face
        milo.rightShoulder.rotation.set(-1.45, 0, -0.35); // Pointing to Moon
        milo.rightElbow.rotation.set(0, 0, 0);
        milo.headGroup.rotation.set(-0.45, 0.42, 0); // Looking up at Moon
      } else if (sceneId === "hopeful-conclusion" || sceneId === "ending") {
        milo.headGroup.rotation.set(-0.15, 0.2, 0);
        milo.rightShoulder.rotation.set(-1.2 + Math.sin(time * 3.5) * 0.12, 0, -0.4);
      }

      // Mara Lip-Sync & speech
      if (mara) {
        const maraIsTalking = currentTalking === "Mara" && speechActive;
        mara.spine.position.y = 0.18 + Math.sin(time * 2.2 + 0.5) * 0.012;
        if (maraIsTalking) {
          const osc = Math.abs(Math.sin(time * 16.0) * Math.cos(time * 8.5));
          mara.mouthGroup.scale.set(1.0 + Math.sin(time * 11.0) * 0.3, 0.5 + osc * 1.9, 1.0);
          mara.headGroup.rotation.x = Math.sin(time * 8.0) * 0.035;
        } else {
          mara.mouthGroup.scale.lerp(new THREE.Vector3(1, 0.35, 1), 0.15);
        }
      }

      // Mother Lip-Sync & speech
      if (mother) {
        const momIsTalking = currentTalking === "Mother" && speechActive;
        mother.spine.position.y = 0.08 + Math.sin(time * 1.8 + 1.0) * 0.012;
        if (momIsTalking) {
          const osc = Math.abs(Math.sin(time * 14.0) * Math.cos(time * 7.0));
          mother.mouthGroup.scale.set(1.0 + Math.sin(time * 9.0) * 0.25, 0.5 + osc * 1.7, 1.0);
          mother.headGroup.rotation.x = Math.sin(time * 7.0) * 0.03;
        } else {
          mother.mouthGroup.scale.lerp(new THREE.Vector3(1, 0.35, 1), 0.15);
        }
      }

      // Doctor Lip-Sync & speech
      if (doctor) {
        const docIsTalking = currentTalking === "Doctor" && speechActive;
        if (docIsTalking) {
          const osc = Math.abs(Math.sin(time * 13.0) * Math.cos(time * 6.5));
          doctor.mouthGroup.scale.set(1.0 + Math.sin(time * 8.0) * 0.2, 0.5 + osc * 1.6, 1.0);
          doctor.headGroup.rotation.x = Math.sin(time * 6.0) * 0.03;
        } else {
          doctor.mouthGroup.scale.lerp(new THREE.Vector3(1, 0.35, 1), 0.15);
        }
      }

      // The Talking Moon Actions & Lip-Sync
      if (moon) {
        // Floating bob
        moon.root.position.y += Math.sin(time * 0.8) * 0.003;
        moon.root.rotation.z = Math.sin(time * 0.5) * 0.02;

        const moonIsTalking = currentTalking === "Moon" && speechActive;
        if (moonIsTalking) {
          const osc = Math.abs(Math.sin(time * 12.0) * Math.cos(time * 6.0));
          moon.mouthGroup.scale.set(1.1 + Math.sin(time * 8.0) * 0.3, 0.6 + osc * 2.1, 1.0);
          moon.faceGroup.position.y = Math.sin(time * 4.0) * 0.02;
          moon.leftBrow.position.y = 0.48 + Math.sin(time * 3.5) * 0.04;
          moon.rightBrow.position.y = 0.48 + Math.sin(time * 3.5) * 0.04;
        } else {
          moon.mouthGroup.scale.lerp(new THREE.Vector3(1.0, 0.35, 1.0), 0.12);
          moon.leftBrow.position.y = 0.48;
          moon.rightBrow.position.y = 0.48;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [sceneId, webGLSupported, zoomLevel]);

  if (!webGLSupported) {
    return (
      <div className="milo-3d-fallback" role="img" aria-label="3D animation unavailable">
        <p>WebGL is required for 3D cartoon animations. Displaying visual fallback.</p>
      </div>
    );
  }

  return (
    <div
      className="milo-3d-canvas-wrap"
      ref={mountRef}
      role="region"
      aria-label={`Animated 3D Cartoon: ${sceneId.replaceAll("-", " ")}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "460px",
        overflow: "hidden",
        touchAction: "none",
      }}
    />
  );
}
