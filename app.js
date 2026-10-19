const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const appNames = [
 ["Edge","e"],["Mail","✉"],["Calendar","▦"],["Photos","▧"],["Settings","⚙"],["Calculator","⌗"],
 ["Notepad","▤"],["Paint","◉"],["Terminal","›_"],["Visual Studio Code","⌘"],["Adobe Photoshop","Ps"],
 ["Spotify","◖"],["Discord","◉"],["Figma","◈"],["CapCut","⌁"],["Blender","♧"],["DaVinci Resolve","◉"],
 ["Word","W"],["Excel","X"],["PowerPoint","P"],["OneNote","N"],["Outlook","O"],["Teams","T"],
 ["Chrome","◉"],["WhatsApp","◔"],["Telegram","➤"],["Steam","◉"],["Epic Games","E"],["GeForce Experience","NVIDIA"]
];
const appGlyphs = {"Edge":"e","Mail":"✉","Calendar":"▦","Photos":"▧","Settings":"⚙","Calculator":"⌗","Notepad":"▤","Paint":"◉","File Explorer":"▰","Terminal":"›_","Visual Studio Code":"⌘","Adobe Photoshop":"Ps","Spotify":"◖","Discord":"◉","Figma":"◈","CapCut":"⌁","Blender":"♧","DaVinci Resolve":"◉","Word":"W","Excel":"X","PowerPoint":"P","OneNote":"N","Outlook":"O","Teams":"T","Chrome":"◉","WhatsApp":"◔","Telegram":"➤","Steam":"◉","Epic Games":"E","GeForce Experience":"N"};
const appIcons = {
 "Edge":"microsoft-edge","Mail":"mail","Calendar":"calendar","Photos":"photos","Settings":"settings","Calculator":"calculator",
 "Notepad":"notepad","Paint":"ms-paint","Terminal":"console","Visual Studio Code":"visual-studio-code-2019","Adobe Photoshop":"adobe-photoshop",
 "Spotify":"spotify","Discord":"discord","Figma":"figma","CapCut":"capcut","Blender":"blender-3d","DaVinci Resolve":"davinci-resolve",
 "Word":"microsoft-word-2019","Excel":"microsoft-excel-2019","PowerPoint":"microsoft-powerpoint-2019","OneNote":"microsoft-onenote-2019","Outlook":"microsoft-outlook-2019","Teams":"microsoft-teams-2019",
 "Chrome":"google-chrome","WhatsApp":"whatsapp","Telegram":"telegram-app","Steam":"steam","Epic Games":"epic-games","GeForce Experience":"nvidia"
};
const appGrid = $("#appGrid");
if(appGrid){
 appNames.forEach(([name,glyph])=>{
  const b=document.createElement("button"); b.className="app-item"; b.dataset.open=name;
  const icon=document.createElement("img"); icon.className="app-icon"; icon.alt=""; icon.loading="lazy";
  const remoteIcons={"Edge":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Microsoft%20Edge%20logo%20%282019%29.svg","Chrome":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Google%20Chrome%20icon%20%28February%202022%29.svg","DaVinci Resolve":"https://commons.wikimedia.org/wiki/Special:Redirect/file/DaVinci_Resolve_17_logo.svg","Paint":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Microsoft_Paint.svg"};
  icon.src=remoteIcons[name]||("https://img.icons8.com/fluency/96/"+(appIcons[name]||"application-window")+".png");
  icon.onerror=()=>{const fallback=document.createElement("span");fallback.className="app-icon app-icon-fallback";fallback.textContent=glyph;icon.replaceWith(fallback)};
  const label=document.createElement("span");label.textContent=name;b.append(icon,label);appGrid.appendChild(b);
 });
}
let activeSpace=1, spaces=1, nextWindowId=1, toastTimer, trackIndex=0, isPlaying=false;
const openWindows=[];
const states={wifi:true,cellular:true,bluetooth:true,hotspot:false,airplane:false,lockscreen:true,touchenabled:true,bell:false,battery:false,night:false,focus:false,keyboard:false,sound:true};
const tracks=[["A quiet afternoon","Hinges Demo"],["Soft geometry","Hinges Demo"],["Pearlescent skies","Hinges Demo"]];
function toast(message){const el=$("#toast");el.textContent=message;el.classList.remove("hidden");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add("hidden"),2400)}
function show(el){el.classList.remove("hidden")}
function hide(el){el.classList.add("hidden")}
function closeOverlays(except){[["#startMenu","start"],["#rightPanel","panel"],["#workspaces","workspaces"],["#powerDialog","power"]].forEach(([sel,key])=>{if(key!==except)hide($(sel))})}
function toggleStart(){const el=$("#startMenu");if(!el.classList.contains("hidden")){hide(el);return}closeOverlays("start");show(el);setTimeout(()=>$("#commandInput").focus(),50)}
function togglePanel(){const el=$("#rightPanel");if(!el.classList.contains("hidden")){hide(el);return}closeOverlays("panel");show(el)}
function toggleWorkspaces(){const el=$("#workspaces");if(!el.classList.contains("hidden")){hide(el);return}closeOverlays("workspaces");show(el);renderWorkspaces()}
function updateDateTime(){
 const now=new Date();
 const zone="Asia/Kolkata";
 const menuDate=$("#clockDateTime");
 if(menuDate){
  const date=new Intl.DateTimeFormat("en-IN",{timeZone:zone,day:"numeric",month:"short"}).format(now);
  const parts=new Intl.DateTimeFormat("en-US",{timeZone:zone,hour:"numeric",minute:"2-digit",hour12:true}).formatToParts(now);
  const hour=parts.find(part=>part.type==="hour")?.value||"";
  const minute=parts.find(part=>part.type==="minute")?.value||"00";
  menuDate.textContent=date+" "+hour+":"+minute;
 }
 const dateDay=$("#dateDay");
 if(dateDay)dateDay.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:zone,weekday:"long"}).format(now).toUpperCase();
 const dateFull=$("#dateFull");
 if(dateFull)dateFull.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:zone,day:"numeric",month:"long",year:"numeric"}).format(now);
}
updateDateTime();setInterval(updateDateTime,15000);
function renderStates(){
 $$("[data-toggle]").forEach(btn=>{const key=btn.dataset.toggle;if(!(key in states))return;const on=states[key];btn.classList.toggle("selected",on);if(btn.classList.contains("quick-tile")){const small=$("small",btn);if(small)small.textContent=on?(key==="wifi"?"Connected":"On"):"Off";}});
}
function toggleState(key){
 if(!(key in states))return;
 states[key]=!states[key];
 if(key==="airplane"&&states.airplane){states.wifi=false;states.bluetooth=false}
 if((key==="wifi"||key==="bluetooth")&&states[key])states.airplane=false;
 if(key==="night")$("#desktop").classList.toggle("night-mode",states.night);
 $("#appGrid").addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)openApp(b.dataset.open)});
$$(".desktop-icons [data-open],.taskbar [data-open]").forEach(b=>b.addEventListener("click",()=>openApp(b.dataset.open)));
renderStates();
 const labels={wifi:"Wi-Fi",cellular:"Cellular",bluetooth:"Bluetooth",hotspot:"Personal Hotspot",airplane:"Airplane mode",lockscreen:"Lock Screen",touchenabled:"Enable Touch",bell:"Notifications",battery:"Battery saver",night:"Night light",focus:"Focus mode",keyboard:"Keyboard",sound:"Sound"};
 toast((labels[key]||key)+" "+(states[key]?"turned on":"turned off"));
}
function windowMarkup(name,id){
 if(name==="Calculator")return '<h2>Calculator</h2><div class="calc"><input id="calcDisplay" value="0" aria-label="Calculator display" readonly><div class="calc-keys">'+["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","=","+"].map(x=>'<button data-calc="'+x+'">'+x+'</button>').join("")+'</div></div>';
 if(name==="Terminal")return '<h2>Terminal</h2><div class="demo-terminal"><div>Hinges Terminal · demo shell</div><div>Safe prototype mode. Commands are simulated.</div><div id="terminalHistory">ak@hinges:~$ help<br>Available: help, date, whoami, ls, clear</div><form id="terminalForm"><label>ak@hinges:~$ <input id="terminalInput" autocomplete="off" spellcheck="false" aria-label="Terminal command"></label></form></div>';
 if(name==="Settings")return '<h2>Settings</h2><p>Make Hinges feel like yours.</p><div class="settings-list"><button data-setting="personalization">🎨　Personalization <small>Wallpaper, appearance and accent</small></button><button data-setting="system">◉　System <small>Display, sound and power</small></button><button data-setting="network">⌁　Network & connectivity <small>Wi-Fi and Bluetooth</small></button><button data-setting="about">◇　About Hinges <small>Interactive desktop prototype</small></button></div>';
 if(name==="Calendar")return '<h2>Calendar</h2><p>'+new Date().toLocaleDateString([], {weekday:"long",month:"long",day:"numeric",year:"numeric"})+'</p><div class="calendar-demo">'+buildCalendar()+'</div>';
 if(name==="Files"||name==="File Explorer")return '<h2>'+name+'</h2><p class="muted">Your files, arranged simply.</p><div class="settings-list"><button>📁　Documents <small>12 items</small></button><button>🖼　Pictures <small>8 items</small></button><button>⬇　Downloads <small>4 items</small></button><button>☁　Hinges Drive <small>Nothing synced in this demo</small></button></div>';
 if(name==="Notepad")return '<h2>Notepad</h2><textarea class="note-area" placeholder="Start typing…"></textarea>';
 if(name==="Weather")return '<h2>Weather</h2><p class="weather-large">☀ 28°</p><p>Partly cloudy · A pleasant demo forecast.</p>';
 if(name==="Store")return '<h2>Store</h2><p>Discover apps for your workspace.</p><div class="settings-list"><button data-open="Spotify">◖　Spotify <small>Music</small></button><button data-open="Blender">♧　Blender <small>3D creation</small></button><button data-open="Visual Studio Code">⌘　Visual Studio Code <small>Development</small></button></div>';
 if(name==="Photos")return '<h2>Photos</h2><p>Your visual library will appear here.</p><div class="photo-placeholder">▧</div>';
 if(name==="Paint")return '<h2>Paint</h2><p>A blank canvas for your next idea.</p><canvas class="paint-canvas" width="520" height="230"></canvas>';
 if(name==="Mail"||name==="Outlook")return '<h2>'+name+'</h2><p>Your inbox is quiet. Suspiciously quiet.</p><div class="settings-list"><button>Inbox <small>No new messages</small></button><button>Drafts <small>Nothing here yet</small></button></div>';
 if(name==="Spotify")return '<h2>Spotify</h2><p>Music for the current moment.</p><div class="music-demo"><span>♫</span><strong>'+tracks[trackIndex][0]+'</strong><small>'+tracks[trackIndex][1]+'</small><button id="appPlay">▶ Play / Pause</button></div>';
 if(name==="Chrome"||name==="Edge")return '<h2>'+name+'</h2><div class="browser-bar"><span>⌕</span><input id="browserAddress" placeholder="Search or enter address" value="https://example.com"><button id="browserGo">Go</button></div><div class="browser-content"><span class="browser-logo">'+(name==="Edge"?"e":"◉")+'</span><h3>Welcome to the web</h3><p>This is a safe, local browser mockup. External pages are not loaded in this prototype.</p></div>';
 if(name==="Bin")return '<h2>Bin</h2><p>The Bin is empty.</p>';
 return '<h2>'+name+'</h2><p>This is an interactive Hinges app placeholder. The desktop shell is live; native application integrations can be connected as the OS develops.</p><div class="app-placeholder">'+(appGlyphs[name]||"◇")+'</div><button class="window-action" data-toast="'+name+' is running in demo mode">Test interaction</button>';
}
function buildCalendar(){
 const d=new Date(), year=d.getFullYear(), month=d.getMonth(), first=new Date(year,month,1).getDay(), count=new Date(year,month+1,0).getDate();
 let s='<div class="calendar-grid">'+["S","M","T","W","T","F","S"].map(x=>'<b>'+x+'</b>').join("");
 for(let i=0;i<first;i++)s+='<span></span>';
 for(let n=1;n<=count;n++)s+='<span class="'+(n===d.getDate()?"today":"")+'">'+n+'</span>';
 return s+'</div>';
}
function openApp(name){
 hide($("#startMenu"));hide($("#rightPanel"));hide($("#workspaces"));hide($("#powerDialog"));
 if(name==="Workspaces"){toggleWorkspaces();return}
 if(name==="Notification Centre"){togglePanel();return}
 const id=nextWindowId++;
 const card=document.createElement("article");card.className="window-card";card.dataset.windowId=id;card.dataset.app=name;card.dataset.space=activeSpace;
 card.innerHTML='<header class="window-titlebar"><span class="window-app-dot"></span><strong>'+name+'</strong><button data-minimize="'+id+'" title="Minimize">−</button><button data-maximize="'+id+'" title="Maximize">□</button><button data-close-window="'+id+'" title="Close">×</button></header><div class="window-content">'+windowMarkup(name,id)+'</div>';
 $("#windowLayer").appendChild(card);
 openWindows.push({id,name,space:activeSpace,element:card,minimized:false,maximized:false});
 renderTopBar();
 makeDraggable(card);bindWindow(card);renderWorkspaces();toast(name+" opened");
}
function makeDraggable(card){
 const bar=$(".window-titlebar",card);let startX=0,startY=0,baseX=0,baseY=0,moving=false;
 bar.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;moving=true;startX=e.clientX;startY=e.clientY;const r=card.getBoundingClientRect();baseX=r.left; baseY=r.top;card.style.transform="none";card.style.left=baseX+"px";card.style.top=baseY+"px";bar.setPointerCapture(e.pointerId)});
 bar.addEventListener("pointermove",e=>{if(!moving)return;card.style.left=Math.max(0,Math.min(innerWidth-card.offsetWidth,baseX+e.clientX-startX))+"px";card.style.top=Math.max(0,Math.min(innerHeight-card.offsetHeight-55,baseY+e.clientY-startY))+"px"});
 bar.addEventListener("pointerup",()=>moving=false);bar.addEventListener("pointercancel",()=>moving=false);
}
function bindWindow(card){
 const id=Number(card.dataset.windowId);
 $$("[data-close-window]",card).forEach(b=>b.addEventListener("click",()=>{card.remove();const i=openWindows.findIndex(w=>w.id===id);if(i>=0)openWindows.splice(i,1);renderWorkspaces();renderTopBar()}));
 $$("[data-minimize]",card).forEach(b=>b.addEventListener("click",()=>{card.classList.add("hidden");const w=openWindows.find(x=>x.id===id);if(w)w.minimized=true;renderWorkspaces()}));
 $$("[data-maximize]",card).forEach(b=>b.addEventListener("click",()=>{const w=openWindows.find(x=>x.id===id);if(!w)return;if(w.maximized){card.style.left="";card.style.top="";card.style.width="";card.style.height="";card.style.transform="translate(-50%,-50%)";w.maximized=false}else{card.style.left="12px";card.style.top="12px";card.style.width="calc(100vw - 24px)";card.style.height="calc(100vh - 82px)";card.style.transform="none";w.maximized=true}}));
 $$("[data-calc]",card).forEach(b=>b.addEventListener("click",()=>calcPress(card,b.dataset.calc)));
 const tf=$("#terminalForm",card);if(tf)tf.addEventListener("submit",e=>{e.preventDefault();const input=$("#terminalInput",card),out=$("#terminalHistory",card),cmd=input.value.trim();if(!cmd)return;let answer=({help:"Available: help, date, whoami, ls, clear",date:new Date().toString(),whoami:"ak@hinges",ls:"Desktop  Documents  Downloads  Pictures",clear:""})[cmd]??("Command not found in demo shell: "+cmd);if(cmd==="clear")out.innerHTML="";else out.innerHTML+="<br>ak@hinges:~$ "+escapeHTML(cmd)+"<br>"+escapeHTML(answer);input.value="";});
 $$("[data-setting]",card).forEach(b=>b.addEventListener("click",()=>toast(b.dataset.setting+" settings selected")));
 $$("[data-open]",card).forEach(b=>b.addEventListener("click",()=>openApp(b.dataset.open)));
 $$("[data-toast]",card).forEach(b=>b.addEventListener("click",()=>toast(b.dataset.toast)));
 const play=$("#appPlay",card);if(play)play.addEventListener("click",togglePlayback);
 const go=$("#browserGo",card);if(go)go.addEventListener("click",()=>toast("External browsing is disabled in this prototype"));
 const canvas=$(".paint-canvas",card);if(canvas){const ctx=canvas.getContext("2d");ctx.strokeStyle="#8551cf";ctx.lineWidth=4;let drawing=false;canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY)});canvas.addEventListener("pointermove",e=>{if(!drawing)return;ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke()});canvas.addEventListener("pointerup",()=>drawing=false)}
}
function escapeHTML(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
let calcExpression="";
function calcPress(card,key){const display=$("#calcDisplay",card);if(key==="="){try{if(!/^[0-9+\-*/(). ×÷]+$/.test(calcExpression))throw Error();const safe=calcExpression.replaceAll("×","*").replaceAll("÷","/");const value=Function('"use strict";return ('+safe+')')();calcExpression=String(value);display.value=calcExpression}catch{display.value="Error";calcExpression=""}}else{calcExpression+=key;display.value=calcExpression||"0"}}
function renderWorkspaces(){
 renderTopBar();
 const tabs=$("#spaceTabs");tabs.innerHTML="";
 for(let i=1;i<=spaces;i++){const b=document.createElement("button");b.className="space-tab"+(i===activeSpace?" active":"");b.dataset.space=i;b.textContent="Desktop "+i;b.addEventListener("click",()=>{activeSpace=i;renderWorkspaces();openWindows.forEach(w=>{w.element.classList.toggle("hidden",w.space!==activeSpace||w.minimized)})});b.addEventListener("dragover",e=>e.preventDefault());b.addEventListener("drop",e=>{e.preventDefault();const moving=openWindows.find(x=>x.id===Number(e.dataTransfer.getData("text/plain")));if(moving){moving.space=i;activeSpace=i;renderWorkspaces();openWindows.forEach(w=>w.element.classList.toggle("hidden",w.space!==activeSpace||w.minimized));toast(moving.name+" moved to Desktop "+i)}});tabs.appendChild(b)}
 const add=document.createElement("button");add.className="add-space";add.textContent="＋";add.title="Add desktop";add.addEventListener("click",()=>{spaces++;activeSpace=spaces;renderWorkspaces();openWindows.forEach(w=>w.element.classList.toggle("hidden",w.space!==activeSpace||w.minimized));toast("Desktop "+spaces+" created")});tabs.appendChild(add);
 const canvas=$("#workspaceCanvas");canvas.innerHTML="";
 const wins=openWindows.filter(w=>w.space===activeSpace);
 if(!wins.length){canvas.innerHTML='<div class="empty-workspace"><span>◇</span><strong>Your space, in view.</strong><small>Open an app from Start to see its window here.</small></div>';return}
 wins.forEach(w=>{const b=document.createElement("button");b.className="workspace-card";b.draggable=true;b.innerHTML='<div class="window-preview">'+(appGlyphs[w.name]||"◇")+'</div><strong>'+w.name+(w.minimized?" · Minimized":"")+'</strong>';b.addEventListener("click",()=>{if(w.minimized){w.minimized=false;w.element.classList.remove("hidden")}hide($("#workspaces"));w.element.style.zIndex=String(30+Date.now()%1000)});b.addEventListener("dragstart",e=>e.dataTransfer.setData("text/plain",String(w.id)));b.addEventListener("dragover",e=>e.preventDefault());b.addEventListener("drop",e=>{e.preventDefault();const id=Number(e.dataTransfer.getData("text/plain"));const moving=openWindows.find(x=>x.id===id);if(moving){moving.space=activeSpace;renderWorkspaces();toast(moving.name+" moved to Desktop "+activeSpace)}});canvas.appendChild(b)});
}
$$("[data-close=workspaces]").forEach(b=>b.addEventListener("click",()=>hide($("#workspaces"))));
$("#workspacesButton").addEventListener("click",toggleWorkspaces);
const trayChevron = $("#trayChevron"); if(trayChevron) trayChevron.addEventListener("click",togglePanel);
const weatherButton = $("#weatherButton"); if(weatherButton) weatherButton.addEventListener("click",()=>openApp("Weather"));
$("#openSettings").addEventListener("click",()=>openApp("Settings"));
$("#powerButton").addEventListener("click",()=>{hide($("#startMenu"));show($("#powerDialog"))});
$("#controlPowerButton")?.addEventListener("click",()=>{hide($("#rightPanel"));hide($("#startMenu"));show($("#powerDialog"))});
$("#addControlButton")?.addEventListener("click",()=>toast("Control Centre customization is coming later"));
$$("[data-power]").forEach(b=>b.addEventListener("click",()=>{const action=b.dataset.power;hide($("#powerDialog"));if(action==="cancel")return;if(action==="restart"){openWindows.splice(0).forEach(w=>w.element.remove());$("#windowLayer").innerHTML="";toast("Demo desktop restarted")}else toast(action==="sleep"?"Sleep is simulated in this prototype":"Shut down is simulated in this prototype")}));
$("#clearNotifications").addEventListener("click",()=>{$("#notifications").innerHTML='<div class="empty-notifications">You’re all caught up.</div>';toast("Notifications cleared")});
$("#notifications").addEventListener("click",e=>{const b=e.target.closest(".dismiss-note");if(b)b.closest(".notification").remove()});
$$("[data-toggle]").forEach(b=>b.addEventListener("click",()=>toggleState(b.dataset.toggle)));
$("#volumeSlider").addEventListener("input",e=>{$("#volumeValue").textContent=e.target.value+"%";states.sound=Number(e.target.value)>0;renderStates()});
$("#brightnessSlider").addEventListener("input",e=>{$("#brightnessValue").textContent=e.target.value+"%";$("#desktop").style.filter="brightness("+(.55+Number(e.target.value)/220)+")"});
$("#playTrack").addEventListener("click",togglePlayback);$("#prevTrack").addEventListener("click",()=>changeTrack(-1));$("#nextTrack").addEventListener("click",()=>changeTrack(1));
function togglePlayback(){isPlaying=!isPlaying;$("#playTrack").textContent=isPlaying?"Ⅱ":"▶";$("#trackName").textContent=tracks[trackIndex][0];$("#trackArtist").textContent=isPlaying?tracks[trackIndex][1]+" · Playing":tracks[trackIndex][1]+" · Paused";const appPlay=$("#appPlay");if(appPlay)appPlay.textContent=isPlaying?"Ⅱ Pause":"▶ Play / Pause"}
function changeTrack(n){trackIndex=(trackIndex+n+tracks.length)%tracks.length;$("#trackName").textContent=tracks[trackIndex][0];$("#trackArtist").textContent=tracks[trackIndex][1];isPlaying=true;$("#playTrack").textContent="Ⅱ"}
$("#commandForm").addEventListener("submit",e=>{e.preventDefault();runCommand($("#commandInput").value.trim())});
function runCommand(raw){
 if(!raw)return;const q=raw.toLowerCase();$("#commandInput").value="";
 if(/^[\d\s()+\-*/.%]+$/.test(raw)&&/[+*/()%]/.test(raw)){try{const value=Function('"use strict";return ('+raw.replace(/%/g,"/100")+')')();toast(String(value));return}catch{}}
 const volume=q.match(/^volume\s+(\d{1,3})%?$/);if(volume){const v=Math.max(0,Math.min(100,Number(volume[1])));$("#volumeSlider").value=v;$("#volumeValue").textContent=v+"%";toast("Volume set to "+v+"%");return}
 if(q==="bluetooth off"||q==="bluetooth on"){states.bluetooth=q.endsWith("on");renderStates();toast("Bluetooth "+(states.bluetooth?"turned on":"turned off"));return}
 if(q==="wifi off"||q==="wi-fi off"||q==="wifi on"||q==="wi-fi on"){states.wifi=q.endsWith("on");renderStates();toast("Wi-Fi "+(states.wifi?"turned on":"turned off"));return}
 if(q==="settings"){openApp("Settings");return}if(q==="terminal"||q==="cmd"){openApp("Terminal");return}if(q==="workspaces"||q==="mission control"){toggleWorkspaces();return}if(q==="notification centre"||q==="notifications"){togglePanel();return}if(q==="shutdown"||q==="power"){show($("#powerDialog"));hide($("#startMenu"));return}
 const match=appNames.find(([n])=>n.toLowerCase()===q)||appNames.find(([n])=>n.toLowerCase().includes(q));
 if(match){openApp(match[0]);return}
 if(q==="home"||q==="files"){openApp("Files");return}if(q==="bin"||q==="recycle bin"){openApp("Bin");return}
 if(/\.(pdf|txt|docx?|xlsx?|png|jpe?g|pptx?)$/.test(q)){toast("No matching file in this demo: "+raw);return}
 toast("No command or app found for “"+raw+"”");
}
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){["#startMenu","#rightPanel","#workspaces","#powerDialog"].forEach(s=>hide($(s)));return}
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()===" "){e.preventDefault();toggleStart()}
 if(e.metaKey&&e.key==="Tab"){e.preventDefault();toggleWorkspaces()}
 if(e.key==="F2"&&document.activeElement===$("#desktop"))toggleStart();
});
document.addEventListener("click",e=>{
 if(!e.target.closest("#startMenu,#startButton,#rightPanel,#trayChevron,#clockButton,#workspaces,#workspacesButton,#powerDialog")&&!e.target.closest(".window-card")){hide($("#startMenu"));hide($("#powerDialog"))}
});
renderStates();


// Floating top-bar interactions and live app indicators.
function renderTopBar(){
 const active = [...openWindows].reverse().find(w=>!w.minimized&&w.space===activeSpace);
 const current = $("#currentApp");
 if(current)current.textContent=active?active.name:"Desktop";
 const apps=$("#backgroundApps");
 if(!apps)return;
 apps.innerHTML="";
 openWindows.filter(w=>w.space===activeSpace).slice(-5).forEach(w=>{
  const b=document.createElement("button");b.className="background-app";b.title=w.name;b.setAttribute("aria-label",w.name);
  const glyph=appGlyphs[w.name]||"◇";
  b.innerHTML='<span>'+escapeHTML(glyph)+'</span>';
  b.addEventListener("click",()=>{if(w.minimized){w.minimized=false;w.element.classList.remove("hidden")}w.element.style.zIndex=String(30+Date.now()%1000)});
  apps.appendChild(b);
 });
}
$("#controlCentreButton").addEventListener("click",togglePanel);


// Wallpaper-first lock screen prototype. This is visual navigation, not authentication.
const desktop = $("#desktop");
const lockScreen = $("#lockScreen");
const lockTime = $("#lockTime");
const lockDate = $("#lockDate");
const lockUnlockHint = $("#lockUnlockHint");
const lockReveal = $("#lockReveal");
const lockSignIn = $("#lockSignIn");
const lockContinue = $("#lockContinue");
const lockBack = $("#lockBack");
function updateLockClock(){
 if(!lockTime||!lockDate)return;
 const now=new Date();
 const zone="Asia/Kolkata";
 lockTime.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:zone,hour:"2-digit",minute:"2-digit",hour12:false}).format(now);
 lockDate.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:zone,weekday:"short",day:"numeric",month:"short"}).format(now).replace(/,/g,"");
}
function revealLockSignIn(){
 if(!lockScreen||lockScreen.classList.contains("is-leaving")||!lockSignIn)return;
 lockSignIn.classList.remove("hidden");
 if(lockReveal){lockReveal.classList.add("hidden");lockReveal.setAttribute("aria-expanded","true");}
}
function returnToLock(){
 if(lockSignIn)lockSignIn.classList.add("hidden");
 if(lockReveal){lockReveal.classList.remove("hidden");lockReveal.setAttribute("aria-expanded","false");}
}
function enterHingesDesktop(){
 if(!lockScreen||!desktop||!desktop.classList.contains("is-locked"))return;
 desktop.classList.remove("is-locked");
 desktop.classList.add("is-unlocking");
 /* Force the browser to commit the starting frame before running the reveal. */
 void desktop.offsetWidth;
 lockScreen.classList.add("is-leaving");
 lockScreen.setAttribute("aria-hidden","true");
 desktop.querySelectorAll(".desktop-icons,.taskbar,.topbar").forEach(el=>{
   el.classList.remove("unlock-arriving");
   void el.offsetWidth;
   el.classList.add("unlock-arriving");
 });
 const wallpaper=desktop.querySelector(".wallpaper");
 if(wallpaper){
   wallpaper.classList.remove("unlock-wallpaper");
   void wallpaper.offsetWidth;
   wallpaper.classList.add("unlock-wallpaper");
 }
 window.setTimeout(()=>{lockScreen.style.display="none";},1700);
}
updateLockClock();
window.setInterval(updateLockClock,15000);
if(lockReveal)lockReveal.addEventListener("click",revealLockSignIn);
if(lockBack)lockBack.addEventListener("click",returnToLock);
if(lockContinue)lockContinue.addEventListener("click",enterHingesDesktop);
if(lockUnlockHint)lockUnlockHint.addEventListener("click",enterHingesDesktop);
{
 let touchStartY=null;
 window.addEventListener("touchstart",e=>{if(e.touches.length===1)touchStartY=e.touches[0].clientY;},{passive:true});
 window.addEventListener("touchend",e=>{if(touchStartY===null)return;const delta=touchStartY-e.changedTouches[0].clientY;touchStartY=null;if(delta>55)enterHingesDesktop();},{passive:true});
 window.addEventListener("wheel",e=>{if(e.deltaY>0)enterHingesDesktop();},{passive:true,capture:true});
 window.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="PageDown"||e.key===" "){if(desktop?.classList.contains("is-locked")){e.preventDefault();enterHingesDesktop();}}});
}
