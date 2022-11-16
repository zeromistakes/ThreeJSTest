import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import css from "./styles.css";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF3F3F3);
const setup = () => {
    const canvas = document.getElementById('scene');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
    camera.position.x = 0;
    camera.position.y = 40;
    camera.position.z = 0;
    const controls = new OrbitControls(camera, renderer.domElement);
    const light = new THREE.AmbientLight(0x404040, 2);
    scene.add(light);

    const resizeRendererToDisplaySize = (renderer) => {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const render = (time) => {
        time *= 0.001;
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
setup();

const createCube = (scale) => {
    const geometry = new THREE.BoxGeometry(scale, scale, scale);
    const material = new THREE.MeshStandardMaterial({ color: 0xfcba03 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    pushMesh(cube.uuid);
    renderMeshList();
    cube.position.x = getRandCords();
    cube.position.y = getRandCords();
    cube.position.z = getRandCords();
    return cube;
}

const createSphere = (scale) => {
    const geometry = new THREE.SphereGeometry(scale, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xfc0303 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    pushMesh(sphere.uuid);
    renderMeshList();
    sphere.position.x = getRandCords();
    sphere.position.y = getRandCords();
    sphere.position.z = getRandCords();
    return sphere;
}

const createPyramid = (scale) => {
    const geometry = new THREE.CylinderGeometry(0, scale, scale, 3, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xf003fc });
    const pyramid = new THREE.Mesh(geometry, material);
    scene.add(pyramid);
    pushMesh(pyramid.uuid);
    renderMeshList();
    pyramid.position.x = getRandCords();
    pyramid.position.y = getRandCords();
    pyramid.position.z = getRandCords();
    return pyramid;
}

const optionsForm = document.querySelector('.optionsForm');
optionsForm.addEventListener('submit', function ( event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formDataFormatted = {};
    formData.forEach((value, key) => (formDataFormatted[key] = value));

    switch(formDataFormatted.geometry) {
        case 'sphere':
            createSphere(formDataFormatted.scale);
            break;
        case 'cube':
            createCube(formDataFormatted.scale);
            break;
        case 'pyramid':
            createPyramid(formDataFormatted.scale);
            break;
        default:
            createSphere(formDataFormatted.scale);
    }
});

const getRandCords = () => {
    return Math.floor(-20 + Math.random() * 30);
}

let mashes = [];

const pushMesh = (uuid) => {
    mashes.push(uuid);
}


const removeMeshFromScene = (uuid) => {
    const itemToRemove = scene.getObjectByProperty('uuid', uuid);
    scene.remove(itemToRemove);
    mashes = mashes.filter(item => item !== uuid);
    renderMeshList();
}

const renderMeshList = () => {
    const meshList = document.querySelector('.meshList');
    meshList.innerHTML = '';
    mashes.forEach(uuid => {
        const item = document.createElement('div');
        item.innerHTML = uuid;
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = 'delete';
        removeBtn.addEventListener('click', () => {
            removeMeshFromScene(uuid)
        });
        item.appendChild(removeBtn);
        meshList.appendChild(item);
    });
}


