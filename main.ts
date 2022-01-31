import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {Font, FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import remap from './mathremap.ts'
let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer
//Canvas takes up two thirds of avalible space
let rendererSize = 2/3

const fovSlider: HTMLInputElement = document.querySelector('#fov')
const addGraph = document.querySelector('.addgraph')

window.addEventListener("DOMContentLoaded", () => {
  init()
  document.body.removeAttribute('style')
})

addGraph.addEventListener('submit', (e) => {
  e.preventDefault()
  let digits
  let func: string
  const { input }: { input: HTMLInputElement } = e.target
  for (let i = 0; i < input.value.length; i++) {
    func = input.value.substring(0, i)

    if (Number(input.value[i])) {
      digits = input.value.substring(i, input.value.indexOf('x'))
      break
    }
  }
  func = func.trim()
  digits = digits.trim()

  const findNum = input.value.split(' ').filter((i) => Number(i))

  const d = constructFunction(func, digits)
  scene.add(d)

  const cont = document.querySelector("#inputcontainer")
  const entry = document.createElement("div")
  entry.textContent = input.value
  cont.appendChild(entry)
})

function constructFunction(input: string, digits: number) {
  const points: Array<THREE.Vector2> = []
  let x: number
  let y: number
  for (let i = -1000; i < 1000; i += 1) {
    x = i * 0.01
    y = remap[input](digits * x)

    points.push(new THREE.Vector2(x, y))
  }

  //construct graph from points
  const graph = new THREE.BufferGeometry().setFromPoints(points)

  //assign graph a random color
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)

  const lineMesh = new THREE.Line(
    graph,
    new THREE.LineBasicMaterial({
      color: `#${randomColor}`,
    })
  )

  return lineMesh
}
fovSlider.addEventListener('change', (e) => {
  camera.fov = Number(e.target.value)
  camera.updateProjectionMatrix()
  e.target.previousElementSibling.textContent = 'fov: ' + e.target.value
})

let aspect = (window.innerWidth * rendererSize) / window.innerHeight
function init() {
  let fov = 60
  let near = 1
  let far = 1000

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.setZ(8)

  scene = new THREE.Scene()


  //axis
  for (const x of [
    [10, 0, 0],
    [0, 10, 0],
    [0, 0, 10],
    [-10, 0, 0],
    [0, -10, 0],
    [0, 0, -10],
  ]) {
    scene.add(line(...x))
  }
  //let w = fsin(-1000, 1000, 1, Math.PI / 2, 1, 4)
  //scene.add(w)

  //waves
  //for (let i = 0; i < 63; i++) {
  //  let w = fsin(-1000,1000,1,Math.PI/2,1,4)
  //  w.rotateY(i*0.1)
  // scene.add(w)
  //}

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth * rendererSize, window.innerHeight)

  renderer.setPixelRatio(window.devicePixelRatio)

  //orbit controls
  const controls = new OrbitControls(camera, renderer.domElement)
  //update loop
  renderer.setAnimationLoop(update)
  renderer.setClearColor(0xffffff, 1)
  //canvas
  document.querySelector('#container').appendChild(renderer.domElement)
}

function fsin(startX, endX, amp, displacementX, displacementY, period) {
  const points = []
  let x

  //a sine wave
  for (let i = startX; i < endX; i += 1) {
    x = i * 0.01
    points.push(
      new THREE.Vector3(
        x,
        amp * Math.sin(period * x + displacementX) + displacementY
      )
    )
  }

  //construct line from points
  const line = new THREE.BufferGeometry().setFromPoints(points)

  const lineMesh = new THREE.Line(
    line,
    new THREE.LineBasicMaterial({
      color: 0x000ff,
    })
  )

  return lineMesh
}

function line(x, y, z) {
  const points = []

  const origin = new Array(3).fill(0)

  points.push(new THREE.Vector3(...origin), new THREE.Vector3(x, y, z))
  const geo = new THREE.BufferGeometry().setFromPoints(points)

  const lineMesh = new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({
      color: 0x000,
    })
  )
  return lineMesh
}

const loader = new FontLoader()

loader.load("./Helvetica_Regular.json", function(font) {
  const geometry = new TextGeometry("hello", {
    font: font,
    size: 6,
    height: 2
  })
  const textMesh = new THREE.Mesh(geometry, [
    new THREE.MeshPhongMaterial({color: 0xad4000}),
    new THREE.MeshPhongMaterial({color: 0x5c2301})
  ])
  textMesh.castShadow = true
})

function numberLine() {

}

function update(time) {
  renderer.render(scene, camera)
}

window.onresize = function () {
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth * rendererSize, window.innerHeight)
}
