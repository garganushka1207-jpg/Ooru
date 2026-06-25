// OORU app.js (debugged excerpt)
// NOTE: This is your code with syntax errors fixed.

function goToPage(num){

    document.querySelectorAll(".page").forEach(page=>{
        page.classList.remove("active");
    });

    const page=document.getElementById("page"+num);

    if(page){
        page.classList.add("active");
    }

    // Only hide popup
    document.getElementById("starPopup").classList.remove("show");

}

function getStars(){
  try{return JSON.parse(localStorage.getItem("ooru_stars"))||{};}
  catch(e){return {};}
}

function saveStars(data){
  localStorage.setItem("ooru_stars",JSON.stringify(data));
}

function getPoleStar(){
  try{return JSON.parse(localStorage.getItem("ooru_polestar"))||[];}
  catch(e){return [];}
}

function savePoleStar(data){
  localStorage.setItem("ooru_polestar",JSON.stringify(data));
}

function escapeHtml(text){
  const div=document.createElement("div");
  div.textContent=text;
  return div.innerHTML;
}

function saveMemory(toPoleStar){

    const textField = toPoleStar
        ? document.getElementById("poleText")
        : document.getElementById("memoryText");

    const nameField = toPoleStar
        ? document.getElementById("poleName")
        : document.getElementById("memoryName");

    const text = textField.value.trim();
const name = nameField.value.trim();
    // Prevent empty submissions
    if(!text){

        textField.classList.add("shake");

        setTimeout(()=>{
            textField.classList.remove("shake");
        },500);

        return;
    }

    

    if(file){

        reader.readAsDataURL(file);

    }else{

        reader.onload({
            target:{
                result:null
            }
        });

    }

}

function openPoleStar(){
  renderPoleEntries();
  goToPage(4);
}

function renderPoleEntries(){
  const container=document.getElementById("poleEntries");
  const entries=getPoleStar();

  if(entries.length===0){
    container.innerHTML='<p style="text-align:center;color:rgba(255,255,255,.3);padding:20px;">Your Pole Star is waiting for its first light.</p>';
    return;
  }

  let html="";

  for(let i = entries.length - 1; i >= 0; i--){

    const e = entries[i];

    const title =
        e.name && e.name.trim() !== ""
        ? escapeHtml(e.name)
        : "Unnamed Light";

    html += `
    <div class="pole-entry">

        <div class="entry-title">
            ✦ ${title}
        </div>

        <div class="entry-preview">
            Stored safely in your Pole Star
        </div>

        ${e.image ? '<div class="entry-icon">🖼 Memory Attached</div>' : ''}

        <div class="entry-date">
            ${new Date(e.date).toLocaleDateString()}
        </div>

    </div>`;
}

  container.innerHTML=html;
}

let currentPopupEntry=null;
let currentPopupStarId=null;

function showStarPopup(starId, entry){

    currentPopupStarId = starId;
    currentPopupEntry = entry;

    const popupName = document.getElementById("popupName");

    // Show title if provided
    if(entry.name && entry.name.trim() !== ""){

        popupName.textContent = "✦ " + entry.name;

    }else{

        const titles = [

            "A Forgotten Star",
            "A Quiet Memory",
            "A Silent Wish",
            "An Untold Story",
            "A Hidden Light",
            "A Moment in Time",
            "A Piece of Yesterday",
            "An Echo in the Sky"

        ];

        popupName.textContent =
            "✦ " +
            titles[Math.floor(Math.random()*titles.length)];

    }

    // Hide memory text
    document.getElementById("popupText").style.display = "none";

    // Hide image
    document.getElementById("popupImg").style.display = "none";

    // Date only
    document.getElementById("popupDate").textContent =
        "Left here on " +
        new Date(entry.date).toLocaleDateString();

    document.getElementById("starPopup").classList.add("show");

}
function closePopup(){

    document.getElementById("starPopup")
    .classList.remove("show");

    currentPopupEntry = null;

    currentPopupStarId = null;

}

function releaseMemory(){

    if(!currentPopupStarId || !currentPopupEntry) return;

    const stars = getStars();

    // Remove the entire star
    delete stars[currentPopupStarId];

    saveStars(stars);

    if(window.launchShootingStar){

        window.launchShootingStar();

        setTimeout(window.launchShootingStar,200);

        setTimeout(window.launchShootingStar,400);

    }

    closePopup();

    renderStarMarkers();

}
function reliveMemory(){

    if(!currentPopupEntry) return;

    const memory = currentPopupEntry;

    goToPage(3);

    setTimeout(()=>{

        document.getElementById("memoryName").value =
            memory.name || "";

        document.getElementById("memoryText").value =
            memory.text || "";

    },100);

}

function renderStarMarkers(){
  const container=document.getElementById("starMarkers");
  if(!container)return;

  container.innerHTML="";

  const stars=getStars();
  const ids=Object.keys(stars);

  ids.forEach((starId,index)=>{
    const entry = stars[starId];

if(!entry) return;
    const angle=(index/ids.length)*Math.PI*2+0.2;
    const radius=20+(index%7)*8;

    const x=50+radius*Math.cos(angle);
    const y=45+radius*0.6*Math.sin(angle);

    const marker=document.createElement("button");
    marker.className="star-marker";
    marker.style.left=x+"%";
    marker.style.top=y+"%";
    marker.title="A forgotten memory";

    marker.addEventListener("click", () => {
   showStarPopup(starId, entry);
});

    container.appendChild(marker);
  });
  // ---------- Pole Star ----------

const poleStar = document.createElement("button");

poleStar.className = "star-marker pole-star";


poleStar.innerHTML = "";
poleStar.title = "Visit your Pole Star";

poleStar.style.right = "7%";
poleStar.style.top = "10%";
poleStar.style.left = "auto";

poleStar.addEventListener("click", openPoleStar);

container.appendChild(poleStar);
}

document.addEventListener("DOMContentLoaded",renderStarMarkers);
renderStarMarkers();
