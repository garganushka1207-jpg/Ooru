// =========================
// OORU STARFIELD (DEBUGGED)
// =========================

(function initStarfield() {

    const container = document.getElementById("starfield");
    if (!container || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(window.innerWidth,window.innerHeight);

    container.appendChild(renderer.domElement);

    const starCount = 4000;

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const geometry = new THREE.BufferGeometry();

    for(let i=0;i<starCount;i++){

        const radius = 300 + Math.random()*400;
        const theta = Math.random()*Math.PI*2;
        const phi = Math.acos(Math.random()*2-1);

        positions[i*3]     = radius*Math.sin(phi)*Math.cos(theta);
        positions[i*3 + 1] = radius*Math.sin(phi)*Math.sin(theta);
        positions[i*3 + 2] = radius*Math.cos(phi);

        const c = 0.5 + Math.random()*0.5;
        const tint = Math.random();

        if(tint < 0.1){
            colors[i*3] = c;
            colors[i*3+1] = c*0.8;
            colors[i*3+2] = c*0.5;
        }else if(tint < 0.2){
            colors[i*3] = c*0.6;
            colors[i*3+1] = c*0.7;
            colors[i*3+2] = c;
        }else{
            colors[i*3] = c;
            colors[i*3+1] = c;
            colors[i*3+2] = c;
        }
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions,3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors,3)
    );

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(16,16,0,16,16,16);
    gradient.addColorStop(0,"rgba(255,255,255,1)");
    gradient.addColorStop(.3,"rgba(255,255,255,.8)");
    gradient.addColorStop(1,"rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,32,32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size:1.8,
        map:texture,
        blending:THREE.AdditiveBlending,
        transparent:true,
        depthWrite:false,
        opacity:.9,
        vertexColors:true
    });

    const stars = new THREE.Points(geometry,material);
    scene.add(stars);

    const galaxyGroup = new THREE.Group();

    for(let g=0;g<6;g++){

        const count = 200;

        const geo = new THREE.BufferGeometry();

        const pos = new Float32Array(count*3);
        const col = new Float32Array(count*3);

        const centerX=(Math.random()-.5)*600;
        const centerY=(Math.random()-.5)*400;
        const centerZ=(Math.random()-.5)*400-200;

        for(let i=0;i<count;i++){

            const r=Math.random()*60;
            const theta=Math.random()*Math.PI*2;
            const phi=Math.acos(Math.random()*2-1);

            pos[i*3]=centerX+r*Math.sin(phi)*Math.cos(theta);
            pos[i*3+1]=centerY+r*Math.sin(phi)*Math.sin(theta);
            pos[i*3+2]=centerZ+r*Math.cos(phi);

            const bright=.1+Math.random()*.3;

            if(g<2){
                col[i*3]=bright*1.2;
                col[i*3+1]=bright*.5;
                col[i*3+2]=bright*.8;
            }else if(g<4){
                col[i*3]=bright*.4;
                col[i*3+1]=bright*.6;
                col[i*3+2]=bright*1.2;
            }else{
                col[i*3]=bright;
                col[i*3+1]=bright*.7;
                col[i*3+2]=bright*.3;
            }
        }

        geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
        geo.setAttribute("color",new THREE.BufferAttribute(col,3));

        galaxyGroup.add(new THREE.Points(
            geo,
            new THREE.PointsMaterial({
                size:2.5,
                map:texture,
                blending:THREE.AdditiveBlending,
                transparent:true,
                depthWrite:false,
                opacity:.25,
                vertexColors:true
            })
        ));
    }

    scene.add(galaxyGroup);

    let time=0;

    function animate(){

        requestAnimationFrame(animate);

        time+=0.002;

        stars.rotation.y += 0.00015;
        galaxyGroup.rotation.y += 0.00005;
        galaxyGroup.rotation.x = Math.sin(time*0.1)*0.02;

        material.size = 1.8 + Math.sin(time*4)*0.08;

        renderer.render(scene,camera);
    }

    animate();

    window.addEventListener("resize",()=>{

        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth,window.innerHeight);

    });

})();
