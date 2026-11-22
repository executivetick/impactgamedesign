/*
 * GameLabJS 0.4.0 - fixed 400x400 canvas
 * Local compatibility runtime for Code.org Game Lab-style JavaScript.
 */
(function(global){
"use strict";

const state = {
  canvas:null, ctx:null, gameRoot:"",
  sprites:[], groups:[],
  animations:Object.create(null),
  keys:Object.create(null), previousKeys:Object.create(null),
  mouseX:0, mouseY:0, mouseDown:false, previousMouseDown:false,
  frameCount:0, frameRate:60, running:false, paused:false,
  runtimeError:null
};

const EXTENSIONS=[".png",".gif",".webp",".jpg",".jpeg"];

function normalizeRoot(root){
  if(!root) return "";
  return root.endsWith("/") ? root : root + "/";
}

function configure(options){
  options=options||{};
  state.canvas=options.canvas||document.getElementById("game");
  if(!state.canvas) throw new Error("GameLabJS: #game canvas not found.");

  // Standard Game Lab logical resolution for EVERY game in this arcade.
  // CSS may display it larger or smaller, but all code runs in 400x400 units.
  state.canvas.width=400;
  state.canvas.height=400;

  state.ctx=state.canvas.getContext("2d");
  state.gameRoot=normalizeRoot(options.gameRoot||"");
  state.canvas.tabIndex=0;
  state.canvas.focus();

  state.canvas.addEventListener("mousemove",function(e){
    const r=state.canvas.getBoundingClientRect();
    state.mouseX=(e.clientX-r.left)*state.canvas.width/r.width;
    state.mouseY=(e.clientY-r.top)*state.canvas.height/r.height;
  });
  state.canvas.addEventListener("mousedown",function(){
    state.mouseDown=true;
    state.canvas.focus();
  });
  window.addEventListener("mouseup",function(){state.mouseDown=false;});
}

function reset(){
  state.sprites.length=0;
  state.groups.length=0;
  state.animations=Object.create(null);
  state.frameCount=0;
  state.running=false;
  state.paused=false;
  state.keys=Object.create(null);
  state.previousKeys=Object.create(null);
  state.previousMouseDown=false;
  state.runtimeError=null;
}

function normalizeKey(k){
  const s=String(k);
  const aliases={ " ":"space", Spacebar:"space", ArrowLeft:"left",
    ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
  return (aliases[s]||s).toLowerCase();
}

window.addEventListener("keydown",function(e){
  const k=normalizeKey(e.key);
  state.keys[k]=true;
  if(["space","left","right","up","down"].includes(k)) e.preventDefault();
});
window.addEventListener("keyup",function(e){state.keys[normalizeKey(e.key)]=false;});

function keyDown(k){return !!state.keys[normalizeKey(k)];}
function keyWentDown(k){const q=normalizeKey(k);return !!state.keys[q]&&!state.previousKeys[q];}
function keyWentUp(k){const q=normalizeKey(k);return !state.keys[q]&&!!state.previousKeys[q];}

function assetCandidates(name){
  const value=String(name);
  if(/\.(png|gif|webp|jpg|jpeg)$/i.test(value))
    return [state.gameRoot+"assets/"+value];
  return EXTENSIONS.map(ext=>state.gameRoot+"assets/"+value+ext);
}

function registerAnimation(name,src){
  if(state.animations[name]) return state.animations[name];

  const record={name:name,image:new Image(),ready:false,failed:false,
                naturalWidth:0,naturalHeight:0,source:null};
  state.animations[name]=record;

  const candidates=src ? [src] : assetCandidates(name);

  function tryLoad(index){
    if(index>=candidates.length){
      record.failed=true;
      console.error("GameLabJS: animation not found:",name,candidates);
      return;
    }

    const img=new Image();

    img.onload=function(){
      record.image=img;
      record.ready=true;
      record.failed=false;
      record.naturalWidth=img.naturalWidth;
      record.naturalHeight=img.naturalHeight;
      record.source=candidates[index];
    };

    img.onerror=function(){tryLoad(index+1);};
    img.src=candidates[index];
  }

  tryLoad(0);
  return record;
}

function registerAnimations(manifest){
  Object.keys(manifest||{}).forEach(function(name){
    registerAnimation(name,manifest[name]);
  });
}

function Sprite(x,y){
  this.x=Number.isFinite(x)?x:200;
  this.y=Number.isFinite(y)?y:200;
  this.velocityX=0; this.velocityY=0;
  this.scale=1; this.rotation=0;
  this.visible=true; this.depth=0; this.lifetime=-1;
  this.width=40; this.height=40;
  this.animationName=null; this.removed=false;
  this.collider={type:"rectangle",offsetX:0,offsetY:0,width:40,height:40}; this._customCollider=false;
}

Sprite.prototype.setAnimation=function(name){
  this.animationName=name;
  const record=state.animations[name]||registerAnimation(name);
  if(record.naturalWidth){
    this.width=record.naturalWidth;
    this.height=record.naturalHeight;
    if(!this._customCollider){
      this.collider.width=this.width;
      this.collider.height=this.height;
    }
  }
  return this;
};

Sprite.prototype.setCollider=function(type,ox,oy,w,h){
  this.collider={
    type:type||"rectangle",
    offsetX:Number(ox)||0,
    offsetY:Number(oy)||0,
    width:Number(w)||this.width,
    height:Number(h)||this.height
  };
  this._customCollider=true;
};

Sprite.prototype.isTouching=function(target){
  if(Array.isArray(target)) return target.some(s=>spriteOverlaps(this,s));
  return spriteOverlaps(this,target);
};

Sprite.prototype.remove=function(){
  this.removed=true;
  const i=state.sprites.indexOf(this);
  if(i>=0) state.sprites.splice(i,1);
};

Sprite.prototype.bounceOff=function(target){
  if(!spriteOverlaps(this,target)) return;
  const dx=this.x-target.x, dy=this.y-target.y;
  if(Math.abs(dx)>Math.abs(dy)) this.velocityX*=-1;
  else this.velocityY*=-1;
};

Sprite.prototype.bounce=function(target){this.bounceOff(target);};

Sprite.prototype.collide=function(target){
  if(!target || target.removed) return false;

  const A=colliderRect(this);
  const B=colliderRect(target);

  const dx=A.x-B.x;
  const dy=A.y-B.y;
  const overlapX=(A.width+B.width)/2-Math.abs(dx);
  const overlapY=(A.height+B.height)/2-Math.abs(dy);

  if(overlapX<=0 || overlapY<=0) return false;

  if(overlapX < overlapY){
    this.x += dx < 0 ? -overlapX : overlapX;
    this.velocityX=0;
  }else{
    this.y += dy < 0 ? -overlapY : overlapY;
    this.velocityY=0;
  }

  return true;
};

Sprite.prototype.displace=function(target){
  if(spriteOverlaps(this,target)){
    target.x+=(this.velocityX||0);
    target.y+=(this.velocityY||0);
  }
};

function createSprite(x,y,width,height){
  const s=new Sprite(x,y);
  if(Number.isFinite(Number(width))) s.width=Number(width);
  if(Number.isFinite(Number(height))) s.height=Number(height);
  s.collider.width=s.width;
  s.collider.height=s.height;
  state.sprites.push(s);
  return s;
}

function Group(){
  const items=[];
  items.add=s=>items.push(s);
  items.remove=s=>{
    const i=items.indexOf(s); if(i>=0) items.splice(i,1);
  };
  items.overlap=(target,callback)=>{
    const targets=Array.isArray(target)?target:[target];
    items.slice().forEach(a=>{
      if(!a||a.removed) return;
      targets.forEach(b=>{
        if(b&&!b.removed&&spriteOverlaps(a,b)&&typeof callback==="function")
          callback(a,b);
      });
    });
  };
  items.setVelocityYEach=v=>items.forEach(s=>s.velocityY=v);
  items.setVelocityXEach=v=>items.forEach(s=>s.velocityX=v);
  items.setVisibleEach=v=>items.forEach(s=>s.visible=v);
  items.destroyEach=()=>{
    items.slice().forEach(s=>s.remove());
    items.length=0;
  };
  state.groups.push(items);
  return items;
}

function colliderRect(s){
  const c=s.collider||{};
  return {
    x:s.x+(c.offsetX||0),
    y:s.y+(c.offsetY||0),
    width:(c.width||s.width)*Math.abs(s.scale),
    height:(c.height||s.height)*Math.abs(s.scale)
  };
}

function spriteOverlaps(a,b){
  if(!a||!b||a.removed||b.removed) return false;
  if(Array.isArray(b)) return b.some(x=>spriteOverlaps(a,x));
  const A=colliderRect(a),B=colliderRect(b);
  return Math.abs(A.x-B.x)*2 < A.width+B.width &&
         Math.abs(A.y-B.y)*2 < A.height+B.height;
}

function background(value){
  state.ctx.fillStyle=value;
  state.ctx.fillRect(0,0,state.canvas.width,state.canvas.height);
}
function fill(v){state.ctx.fillStyle=v;}
function stroke(v){state.ctx.strokeStyle=v;}
function strokeWeight(v){state.ctx.lineWidth=v;}
function noStroke(){state.ctx.strokeStyle="transparent";}
function noFill(){state.ctx.fillStyle="transparent";}
function rect(x,y,w,h){state.ctx.fillRect(x,y,w,h);}
function ellipse(x,y,w,h){
  state.ctx.beginPath();
  state.ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);
  state.ctx.fill();
}
function line(x1,y1,x2,y2){
  state.ctx.beginPath();
  state.ctx.moveTo(x1,y1); state.ctx.lineTo(x2,y2); state.ctx.stroke();
}
function text(v,x,y){state.ctx.fillText(String(v),x,y);}
function textSize(v){state.ctx.font=v+"px Arial";}

function drawSprite(s){
  if(!s||s.removed||!s.visible) return;
  const record=state.animations[s.animationName];
  if(!record||!record.ready) return;

  const w=record.naturalWidth*Math.abs(s.scale);
  const h=record.naturalHeight*Math.abs(s.scale);

  state.ctx.save();
  state.ctx.translate(s.x,s.y);
  state.ctx.rotate((s.rotation||0)*Math.PI/180);
  state.ctx.drawImage(record.image,-w/2,-h/2,w,h);
  state.ctx.restore();
}

function drawSprites(group){
  const list=Array.isArray(group)?group.slice():state.sprites.slice();
  list.filter(s=>s&&!s.removed&&s.visible)
      .sort((a,b)=>(a.depth||0)-(b.depth||0))
      .forEach(drawSprite);
}

function randomNumber(min,max){
  return Math.floor(Math.random()*(Number(max)-Number(min)+1))+Number(min);
}
function constrain(v,low,high){return Math.max(low,Math.min(high,v));}

// Game Lab math helpers.
// Pong uses abs() to make the ball's horizontal speed positive/negative
// after paddle collisions. Expose these as globals just like Game Lab.
function abs(value){return Math.abs(Number(value));}
function round(value){return Math.round(Number(value));}
function floor(value){return Math.floor(Number(value));}
function ceil(value){return Math.ceil(Number(value));}
function sqrt(value){return Math.sqrt(Number(value));}
function sq(value){return Number(value)*Number(value);}
function min(a,b){return Math.min(Number(a),Number(b));}
function max(a,b){return Math.max(Number(a),Number(b));}
function dist(x1,y1,x2,y2){
  const dx=Number(x2)-Number(x1);
  const dy=Number(y2)-Number(y1);
  return Math.sqrt(dx*dx+dy*dy);
}
function mouseDown(){return state.mouseDown;}

function mouseIsOver(sprite){
  if(!sprite||sprite.removed||!sprite.visible) return false;
  const w=(sprite.width||40)*Math.abs(sprite.scale||1);
  const h=(sprite.height||40)*Math.abs(sprite.scale||1);
  return state.mouseX>=sprite.x-w/2 &&
         state.mouseX<=sprite.x+w/2 &&
         state.mouseY>=sprite.y-h/2 &&
         state.mouseY<=sprite.y+h/2;
}

function mouseWentDown(button){
  const b=String(button||"leftButton").toLowerCase();
  if(b!=="leftbutton") return false;
  return state.mouseDown && !state.previousMouseDown;
}

const World={};
Object.defineProperty(World,"frameCount",{get:()=>state.frameCount});
Object.defineProperty(World,"frameRate",{get:()=>state.frameRate,set:v=>{
  if(Number.isFinite(v)&&v>0) state.frameRate=v;
}});
Object.defineProperty(World,"mouseX",{get:()=>state.mouseX});
Object.defineProperty(World,"mouseY",{get:()=>state.mouseY});

function assetsReady(){
  const records=Object.values(state.animations);
  return records.every(r=>r.ready||r.failed);
}

function drawRuntimeError(error){
  const ctx=state.ctx;
  const message=error && error.message ? error.message : String(error);

  ctx.save();
  ctx.fillStyle="#080808";
  ctx.fillRect(0,0,state.canvas.width,state.canvas.height);

  ctx.fillStyle="#ff7777";
  ctx.font="bold 18px Arial";
  ctx.textAlign="left";
  ctx.fillText("GameLabJS Error",16,32);

  ctx.fillStyle="#ffffff";
  ctx.font="13px Arial";
  const safeMessage=message.length>58 ? message.slice(0,55)+"..." : message;
  ctx.fillText(safeMessage,16,58);
  ctx.fillStyle="#aaaaaa";
  ctx.fillText("Check the browser console for details.",16,82);
  ctx.restore();
}

function run(){
  if(state.running) return;
  state.running=true;

  function frame(){
    if(!state.running) return;

    if(assetsReady()){
      if(!state.runtimeError){
        updatePhysics();

        try{
          if(typeof global.draw==="function") global.draw();
          state.previousKeys=Object.assign({},state.keys);
          state.previousMouseDown=state.mouseDown;
          state.frameCount++;
        }catch(error){
          state.runtimeError=error;
          console.error("GameLabJS runtime error:",error);
        }
      }

      if(state.runtimeError){
        drawRuntimeError(state.runtimeError);
      }
    } else {
      // Keep the screen useful while waiting for the game's initial assets.
      state.ctx.fillStyle="#000";
      state.ctx.fillRect(0,0,state.canvas.width,state.canvas.height);
      state.ctx.fillStyle="#fff";
      state.ctx.font="20px Arial";
      state.ctx.textAlign="center";
      state.ctx.fillText("Loading game...",state.canvas.width/2,state.canvas.height/2);
      state.ctx.textAlign="left";
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function updatePhysics(){
  state.sprites.slice().forEach(s=>{
    if(!s||s.removed) return;
    s.x+=Number(s.velocityX)||0;
    s.y+=Number(s.velocityY)||0;
    if(s.lifetime>0){
      s.lifetime--;
      if(s.lifetime<=0) s.remove();
    }
  });

  state.groups.forEach(g=>{
    for(let i=g.length-1;i>=0;i--) if(!g[i]||g[i].removed) g.splice(i,1);
  });
}

function stop(){state.running=false;}

global.GameLabJS={
  version:"0.4.0",
  width:400,
  height:400,
  configure,reset,
  registerAnimation,registerAnimations,
  run,stop,
  getState:()=>state
};

Object.assign(global,{
  createSprite,Group,randomNumber,constrain,
  abs,round,floor,ceil,sqrt,sq,min,max,dist,
  keyDown,keyWentDown,keyWentUp,
  background,fill,stroke,strokeWeight,noStroke,noFill,
  rect,ellipse,line,text,textSize,drawSprites,
  mouseDown,mouseIsOver,mouseWentDown,World
});

})(window);
