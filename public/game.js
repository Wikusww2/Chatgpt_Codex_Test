(()=>{
const WIDTH=512, HEIGHT=480, TILE=16;
const params=new URLSearchParams(location.search);
let seed=params.get('seed')||Math.random().toString(36).slice(2);
const headless=params.get('headless')==='1';

function cyrb128(str){let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;for(let i=0,k;i<str.length;i++){k=str.charCodeAt(i);h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);return[(h1^h2^h3^h4)>>>0];}
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}}
let rng=mulberry32(cyrb128(seed)[0]);

function makeImage(svg){const img=new Image();img.src='data:image/svg+xml,'+encodeURIComponent(svg);return img;}
const playerImg=makeImage('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#f5a623"/><rect x="4" y="4" width="3" height="3" fill="#000"/><rect x="9" y="4" width="3" height="3" fill="#000"/></svg>');
const enemyImg=makeImage('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#e74c3c"/><rect x="3" y="5" width="10" height="3" fill="#000"/></svg>');
const tileImg=makeImage('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#7f8c8d"/><rect width="16" height="4" fill="#95a5a6"/></svg>');
const starImg=makeImage('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill="#f1c40f"/></svg>');

const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
function resize(){const scale=Math.max(1,Math.floor(Math.min(window.innerWidth/WIDTH,window.innerHeight/HEIGHT)));canvas.style.width=WIDTH*scale+'px';canvas.style.height=HEIGHT*scale+'px';}
resize();window.addEventListener('resize',resize);

const STEP=1/60, MAX_STEPS=5, GRAVITY=800;
let keys={};
addEventListener('keydown',e=>{if(e.code==='ArrowLeft')keys.left=true;if(e.code==='ArrowRight')keys.right=true;if(e.code==='Space')keys.jump=true;if(e.code==='Enter')paused=!paused;if(e.code==='KeyR')reset();if(e.code==='KeyN'){seed=Math.random().toString(36).slice(2);rng=mulberry32(cyrb128(seed)[0]);reset();}});
addEventListener('keyup',e=>{if(e.code==='ArrowLeft')keys.left=false;if(e.code==='ArrowRight')keys.right=false;if(e.code==='Space')keys.jump=false;});

const WORLD_W=256, WORLD_H=30;
let level,player,camera,paused=false,score=0,lives=3;

function generate(){level={tiles:new Uint8Array(WORLD_W*WORLD_H),enemies:[],stars:[]};for(let x=0;x<WORLD_W;x++){level.tiles[(WORLD_H-1)*WORLD_W+x]=1;}let x=10;while(x<WORLD_W-10){let gap=3+Math.floor(rng()*5);x+=gap;let width=3+Math.floor(rng()*6);let y=WORLD_H-(4+Math.floor(rng()*8));for(let i=0;i<width&&x+i<WORLD_W;i++){level.tiles[y*WORLD_W+x+i]=1;}if(rng()<0.3){level.enemies.push({x:(x+width/2)*TILE,y:(y-1)*TILE,w:14,h:14,vx:rng()<0.5?-30:30,vy:0,alive:true,onGround:false});}if(rng()<0.4){level.stars.push({x:(x+width/2)*TILE,y:(y-5)*TILE,w:10,h:10,collected:false});}x+=width;}
player={x:32,y:(WORLD_H-2)*TILE-16,w:14,h:14,vx:0,vy:0,onGround:false,coyote:0,jumpBuf:0};camera=0;}
function reset(){generate();score=0;lives=3;}
reset();

function tilesInRect(x,y,w,h){const res=[];let x0=Math.floor(x/TILE),x1=Math.floor((x+w-1)/TILE);let y0=Math.floor(y/TILE),y1=Math.floor((y+h-1)/TILE);for(let ty=y0;ty<=y1;ty++){for(let tx=x0;tx<=x1;tx++){if(level.tiles[ty*WORLD_W+tx])res.push({x:tx,y:ty});}}return res;}
function moveEntity(e){e.vy+=GRAVITY*STEP;e.x+=e.vx*STEP;let tiles=tilesInRect(e.x,e.y,e.w,e.h);for(const t of tiles){let tx=t.x*TILE;if(e.vx>0)e.x=tx-e.w;else if(e.vx<0)e.x=tx+TILE;e.vx=0;}e.y+=e.vy*STEP;tiles=tilesInRect(e.x,e.y,e.w,e.h);e.onGround=false;for(const t of tiles){let ty=t.y*TILE;if(e.vy>0){e.y=ty-e.h;e.vy=0;e.onGround=true;}else if(e.vy<0){e.y=ty+TILE;e.vy=0;}}}
function rectOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

function update(){if(keys.left)player.vx=Math.max(player.vx-200*STEP,-60);if(keys.right)player.vx=Math.min(player.vx+200*STEP,60);if(!keys.left&&!keys.right)player.vx*=0.8;if(player.onGround)player.coyote=0.1;else player.coyote=Math.max(0,player.coyote-STEP);if(keys.jump)player.jumpBuf=0.1;else player.jumpBuf=Math.max(0,player.jumpBuf-STEP);if(player.jumpBuf>0&&player.coyote>0){player.vy=-170;player.jumpBuf=0;player.coyote=0;}moveEntity(player);camera=Math.max(0,Math.min(player.x-WIDTH/2,WORLD_W*TILE-WIDTH));for(const e of level.enemies){if(!e.alive)continue;e.vx=e.vx>0?30:-30;moveEntity(e);let ahead=e.vx>0?e.x+e.w+1:e.x-1;let foot=e.y+e.h+1;let tx=Math.floor(ahead/TILE),ty=Math.floor(foot/TILE);if(!level.tiles[ty*WORLD_W+tx])e.vx=-e.vx;if(rectOverlap(player,e)){if(player.vy>0&&player.y+player.h-4<e.y){e.alive=false;player.vy=-120;score+=100;}else{lives--;resetPlayer();}}}
for(const s of level.stars){if(!s.collected&&rectOverlap(player,s)){s.collected=true;score+=50;}}
if(player.y>HEIGHT){lives--;resetPlayer();}
}
function resetPlayer(){player.x=32;player.y=(WORLD_H-2)*TILE-16;player.vx=0;player.vy=0;}

function render(){ctx.fillStyle='#000';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.save();ctx.translate(-camera,0);for(let y=0;y<WORLD_H;y++){for(let x=0;x<WORLD_W;x++){if(level.tiles[y*WORLD_W+x])ctx.drawImage(tileImg,x*TILE,y*TILE);}}for(const s of level.stars){if(!s.collected)ctx.drawImage(starImg,Math.floor(s.x),Math.floor(s.y));}for(const e of level.enemies){if(e.alive)ctx.drawImage(enemyImg,Math.floor(e.x),Math.floor(e.y));}ctx.drawImage(playerImg,Math.floor(player.x),Math.floor(player.y));ctx.restore();ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.fillText(`Lives:${lives} Score:${score} Seed:${seed}`,4,10);}
let acc=0,last=0;
function frame(t){if(paused){last=t;requestAnimationFrame(frame);return;}acc+=(t-last)/1000;last=t;if(acc>STEP*MAX_STEPS)acc=STEP*MAX_STEPS;while(acc>=STEP){update();acc-=STEP;}render();requestAnimationFrame(frame);} 
function run(){if(headless){for(let i=0;i<600;i++)update();console.log('headless run complete',{x:player.x.toFixed(2),y:player.y.toFixed(2)});}else{requestAnimationFrame(frame);}}
run();
})();
