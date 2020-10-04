!function(e){var t={};function n(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(i,s,function(t){return e[t]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){},function(e,t,n){"use strict";n.r(t);const i={nav:document.querySelector("#nav"),menu:document.querySelector("#menu"),likes:document.querySelector("#likes"),activitySection:document.querySelector("#section1"),main:document.querySelector("#main"),likeToggle:document.querySelector("#like"),whenSignedIn:document.getElementById("whenSignedIn"),whenSignedOut:document.getElementById("whenSignedOut"),signInBtn:document.getElementById("signInBtn"),signOutBtn:document.getElementById("signOutBtn"),userDetails:document.getElementById("userDetails"),createAct:document.getElementById("createAct"),actsList:document.getElementById("actsList"),newAct:document.getElementById("newAct")},s=()=>{const e=document.querySelector("#loader");e&&e.parentElement.removeChild(e)};class a{constructor(e="",t=!1){this.key=e,this.data=t}async getResults(){if(this.data)console.log("This activity did not come from API");else try{const e=await fetch("https://www.boredapi.com/api/activity?key="+this.key).then(e=>e.json());return this.title=e.activity,this.type=e.type,this.people=e.participants,this.price=e.price,this.link=e.link,this.access=e.accessibility,this.liked=!1,this.key=e.key,e}catch(e){console.log(e)}}}class c{constructor(){this.likes=[]}addLike(e,t,n){const i={key:e,title:t,type:n};return this.likes.push(i),this.persistData(),!0}deleteLike(e){const t=this.likes.findIndex(t=>t.key===e);return this.likes.splice(t,1),this.persistData(),!1}isLiked(e){return-1!==this.likes.findIndex(t=>t.key===e)}getLast(){return this.likes.length-1}persistData(){localStorage.setItem("likes",JSON.stringify(this.likes))}readStorage(){const e=JSON.parse(localStorage.getItem("likes"));e&&(this.likes=e)}}const l=(e,t)=>{const n=`     \n                <div class="flex justify-between items-center ">\n            <h3 class="text-xl font-bold pl-6 capitalize"><a href="#${e.link}">${e.title}</a></h3>\n                <div class="bg-primary-200 px-6 py-2 cursor-pointer" id="like">\n                    <img class="pointer hover:scale-110 transition-transform" src="assets/like-${t}.svg" alt="" srcset="">\n                </div>\n            </div>\n            <div class="h-1 bg-primary-200"></div>\n                <div class="font-semibold flex flex-col md:flex-row justify-evenly items-center p-3">            \n                    <h4>Categoria: <span class="font-bold capitalize">${e.type}</span></h4>\n                    <img src="assets/${e.type}.svg" heigh="48" width="48">\n                    <h4>Participantes: <span class="font-bold">${e.people}</span></h4>\n                    <img src="assets/participants.svg" heigh="48" width="48">\n                    <h4>Accesibilidad: <span class="font-bold">${Math.round(10*e.access)} / 10</span></h4>\n                    <img src="assets/accesibility.svg" heigh="48" width="48">\n                    <h4>Precio: <span class="font-bold">${Math.round(10*e.price)} / 10</span></h4>\n                    <img src="assets/price.svg" heigh="48" width="48">\n                </div>\n    `;i.activitySection.insertAdjacentHTML("afterbegin",n)},r=()=>{i.activitySection.innerHTML="",window.location.hash=""},o=e=>{const t=`\n            <li>\n              <a href="#${e.key}" class="border-primary-300 border-2 flex flex-row px-6 py-4 justify-evenly">\n                <img src="assets/${e.type}.svg" heigh="48" width="48">\n                <h4 class="text-base p-2">${e.title}</h4>\n              </a>\n            </li>`;i.likes.insertAdjacentHTML("beforeend",t)};n(0);const d={},u=async(e,t)=>{console.log(t),console.log(e);const n=parseInt(e,10);d.act=n?new a(n):new a,r(),s(i.main),i.main.insertAdjacentHTML("afterend",'\n    <svg id="loader" class="animate-spin my-10 mx-auto h-16 w-16 text-center text-primary-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n    <circle class="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\n    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n  </svg> \n    ');try{if(await d.act.getResults(),console.log(d.act.data),null!=d.act.title||1==t){const e=!!d.like&&d.like.isLiked(d.act.key);s(i.main),l(d.act,e)}else console.error("ERROR: Activiy not found, try again")}catch(e){console.error(e)}},h=()=>{d.like||(d.like=new c),d.like.isLiked(d.act.key)?(d.act.liked=d.like.deleteLike(d.act.key),(e=>{const t=document.querySelector(`a[href*="${e}"]`).parentElement;t&&t.parentElement.removeChild(t)})(d.act.key)):(d.act.liked=d.like.addLike(d.act.key,d.act.title,d.act.type),o(d.act)),r(),l(d.act,d.act.liked)},p=firebase.default.auth(),m=new firebase.auth.GoogleAuthProvider;p.onAuthStateChanged(e=>{e?(i.whenSignedIn.hidden=!1,i.whenSignedOut.hidden=!0,i.userDetails.innerHTML=`<h3>Hola <span class=" font-bold"> ${e.displayName}</span>!</h3> <p>ID de Usuario: <span class=" font-bold">${e.uid}</span></p>`):(i.whenSignedIn.hidden=!0,i.whenSignedOut.hidden=!1,i.userDetails.innerHTML="")});const g=firebase.firestore();let y,k,f;p.onAuthStateChanged(e=>{e?(y=g.collection("activities"),i.createAct.onclick=()=>{if(0!=i.newAct.elements.name.value){const t={key:10000001+f,uid:e.uid,uname:e.displayName,title:i.newAct.elements.name.value,type:i.newAct.elements.type.value,people:i.newAct.elements.participants.value,price:i.newAct.elements.price.value/10,access:i.newAct.elements.accesibility.value/10,createdAt:firebase.firestore.FieldValue.serverTimestamp(),link:"",liked:!1};console.log(t),console.log(1==t),u(t.key,t),y.add(t);for(let e=0;e<i.newAct.elements.length;e++)i.newAct.elements[e].value=""}},k=y.orderBy("createdAt").onSnapshot(e=>{f=e.docs.length;const t=e.docs.map(e=>`<li class="list-decimal list-inside m-4"><h4 class="inline-block"><a href="#${e.data().key}" class="font-bold cursor-pointer">${e.data().title}</a>- agregada por <span class="italic">${e.data().uname}</span></h4></li>`);i.actsList.innerHTML=t.join("")})):k&&k()}),i.signInBtn.onclick=()=>p.signInWithPopup(m),i.signOutBtn.onclick=()=>p.signOut(),i.nav.addEventListener("click",e=>{e.target.matches("#likesBtn, #likesBtn *")?i.likes.classList.contains("hidden")?i.likes.classList.remove("hidden"):i.likes.classList.add("hidden"):e.target.matches("#burger, #burger *")&&(i.menu.classList.contains("hidden")?i.menu.classList.remove("hidden"):i.menu.classList.add("hidden"))}),i.main.addEventListener("click",e=>{e.target.matches("#like, #like *")?h():e.target.matches("#generate, #generate *")&&(u(),i.activitySection.classList.contains("hidden")&&i.activitySection.classList.remove("hidden"))}),window.addEventListener("hashchange",(function(){if(d.act){const e=window.location.hash.replace("#","");e>=1e6&&e<=9999999&&u(e)}})),window.addEventListener("load",()=>{d.like=new c,d.like.readStorage(),d.like.likes.forEach(e=>o(e))})}]);