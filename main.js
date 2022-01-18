import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

let camera, scene, renderer;

function init() { 
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
	camera.position.setZ(8)
   
	scene = new THREE.Scene();

  //axis
  for (const x of [[2,0,0],[0,2,0],[0,0,2],[-2,0,0],[0,-2,0],[0,0,-2]]) {
    scene.add(line(...x))
  }
 
  //waves
  for (let i = 0; i < 63; i++) {
    let w = fsin(-1000,1000,1,Math.PI/2,1,4) 
    w.rotateY(i*0.1)
    scene.add(w) 
  }

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio / 1)
 
  //orbit controls
  const controls = new OrbitControls(camera, renderer.domElement) 
  //update loop
  renderer.setAnimationLoop( update );

  //canvas
  document.body.appendChild( renderer.domElement );
}

function fsin(startX, endX, amp, displacementX, displacementY, period) {
  const points = []
  let x;

  //a sine wave
  for (let i = startX; i < endX; i+=1) {
    x = i * 0.01
    points.push(new THREE.Vector3(x,amp*Math.sin(period*x + displacementX)+displacementY))
  }

  //construct line from points
  const line = new THREE.BufferGeometry().setFromPoints(points)

  const lineMesh = new THREE.Line(
    line,
    new THREE.LineBasicMaterial({
      color: 0x000ff
    })
  )

  return lineMesh
}

function line(x,y,z) {
  const points = []

  const origin = new Array(3).fill(0)

  points.push(new THREE.Vector3(...origin), new THREE.Vector3(x,y,z))
  const geo = new THREE.BufferGeometry().setFromPoints(points)

  const lineMesh = new THREE.Line(
    geo, 
    new THREE.LineBasicMaterial({
    })
  )
  return lineMesh
}

function update( time ) {
	renderer.render( scene, camera )
}

init()
