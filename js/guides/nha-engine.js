/* HLV Sức Khỏe – bộ máy phác thảo mặt bằng nhà ở (bài "Ngôi nhà mơ ước", 25/11/2026).
   Thuần JS, không DOM: NhaEngine.generate(tùy chọn) → các tầng, ô phòng, cửa, cửa sổ; NhaEngine.svgPlan(kết quả, tầng, {furn,dims}) → SVG mặt bằng.
   Quy tắc xếp phòng theo thói quen nhà ở Việt Nam; kích thước là phác thảo, làm tròn. */
(function(){
/* ===== Bộ máy tạo mặt bằng (thuần, không đụng DOM) ===== */
const STRIP=1.1,CORE_A=3.8,CORR=1.2;
const R={
 gara:['Gara ô tô',1,'park'],xe:['Để xe máy',1,'park'],khach:['Phòng khách',1,'live'],bep:['Bếp + ăn',1,'kit'],
 master:['P. ngủ master',0,'bed'],ngu:['Phòng ngủ',0,'bed'],ongba:['P. ngủ ông bà',0,'bed'],lv:['P. làm việc',0,'work'],
 tho:['Phòng thờ',0,'tho'],giat:['Giặt phơi',0,'wet'],wc:['WC',0,'wet'],stair:['Cầu thang',1,'stair'],
 hall:['Hành lang',1,'hall'],sanh:['Sảnh',1,'hall'],shc:['Sinh hoạt chung',1,'live'],gt:['Giếng trời',0,'gt'],
 kho:['Kho',0,'wet'],dn:['P. đa năng',1,'work'],logia:['Lô gia',1,'out'],terr:['Sân thượng',1,'terr']
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
const mk=(t,area,minW,minD,o)=>Object.assign({t,name:R[t][0],area,minW,minD},o||{});
const fx=(t,w,minD,o)=>Object.assign({t,name:R[t][0],fixed:w,minW:w,minD,area:w*minD},o||{});
const isOpen=x=>R[x.t][1]===1;
const cl=x=>x&&Object.assign({},x);

function densityCap(A){const p=[[90,1],[100,.9],[200,.7],[300,.6],[500,.5],[1000,.4]];
 if(A<=90)return 1;if(A>=1000)return .4;
 for(let i=1;i<p.length;i++)if(A<=p[i][0]){const[a0,v0]=p[i-1],[a1,v1]=p[i];return v0+(v1-v0)*(A-a0)/(a1-a0)}}

function ctxOf(o){
 const W=o.W,L=o.L;let side=0,minF,minB;
 if(o.type==='pho'){minF=1.5;minB=L<15?0.8:1.2}
 else if(o.type==='cap4'){side=W>=9?1:0;minF=2.5;minB=1.5}
 else{side=W>=12?2:W>=9?1.2:0.8;minF=4;minB=2}
 let bw=W-2*side;bw=Math.min(bw,o.type==='villa'?15:o.type==='cap4'?14:12);
 return{W,L,side:(W-bw)/2,minF,minB,bw,bx:(W-bw)/2,mode:bw>=7?'B':'A'};
}

function program(o,c){
 const P=o.adults+o.kids+o.elders,k=[0.85,1,1.2][o.comfort]*(o.type==='villa'?1.15:1),big=o.style==='tcd'?1.12:1;
 let park=null;const two=o.cars>1&&c.bw>=6.4;
 if(o.cars>0&&c.bw>=3.2)park=mk('gara',(two?36:19)+o.bikes*1.3,two?6:3.2,5.5,{name:two?'Gara 2 ô tô':'Gara ô tô'});
 if(!park&&o.bikes>0)park=mk('xe',Math.max(5,o.bikes*1.6),2.2,2.2);
 const khach=mk('khach',clamp(14+1.8*P,16,36)*k*big*(park&&c.mode==='A'?0.8:1),3.3,3.6);
 const bep=mk('bep',clamp(10+1.4*P,12,28)*k,3,3);
 const kidRooms=o.kids<=2?o.kids:Math.ceil(o.kids/2)+1;
 const auto=Math.max(1,1+(o.elders>0?1:0)+kidRooms+Math.max(0,o.adults-2));
 const B=o.beds==='auto'?auto:Math.max(1,+o.beds);
 const beds=[mk('master',16*k,3.2,3.6,{ens:true})];
 if(o.elders>0&&B>=2)beds.push(mk('ongba',14*k,3.2,3.4,{ens:true}));
 let n=2;while(beds.length<B)beds.push(mk('ngu',12*k,2.7,3,{name:'Phòng ngủ '+(n++),ens:c.mode==='A'}));
 beds.forEach(b=>{if(b.ens)b.area+=4});
 const lv=o.work?mk('lv',9*k,2.4,2.6):null,tho=o.tho?mk('tho',9,2.4,2.6):null,giat=o.laundry?mk('giat',6,1.8,2):null;
 return{park,khach,bep,beds,auto,B,lv,tho,giat,extra:[lv,tho,giat].filter(Boolean),warnPark:o.cars>0&&!park?1:two||o.cars<2?0:2};
}

function alloc(fl,W){
 const w=fl.map(()=>0);let free=fl.map((_,i)=>i),rem=W;
 for(let it=0;it<12&&free.length;it++){
  const tot=sum(free,i=>Math.max(fl[i].area,0.01));
  free.forEach(i=>w[i]=rem*Math.max(fl[i].area,0.01)/tot);
  const under=free.filter(i=>w[i]<fl[i].minW);
  if(!under.length)break;
  under.forEach(i=>{w[i]=fl[i].minW;rem-=w[i]});
  free=free.filter(i=>!under.includes(i));
 }
 return w;
}
const used=r=>sum(r.fixed,x=>x.fixed)+sum(r.flex,x=>x.minW);
const markStrip=rows=>{rows.forEach((r,i)=>r.strip=i<rows.length-1&&[...r.fixed,...r.flex].some(x=>!isOpen(x)));return rows};
function pack(list,avail,opt){
 const build=red=>{const rows=[];let cur={fixed:(opt.fixed0||[]).map(cl),flex:[]};
  for(const r of list){
   if((cur.flex.length||cur.fixed.length)&&used(cur)+r.minW>avail-(red?STRIP:0)+1e-6){rows.push(cur);cur={fixed:[],flex:[]}}
   cur.flex.push(r);
  }
  if(cur.flex.length||cur.fixed.length)rows.push(cur);return rows};
 let rows=build(false);
 if(rows.length>1&&opt.strip)rows=build(true);
 return opt.strip?markStrip(rows):rows;
}
const single=r=>({fixed:[],flex:[r]});

function ring(rooms,c,backFixed){
 if(c.mode==='A'){
  if(rooms.length>2)return null;
  let f=rooms.find(r=>r.t==='tho')||rooms.find(r=>r.t==='master')||rooms[0],b=rooms.find(r=>r!==f);
  if(f&&f.t==='giat'&&b)[f,b]=[b,f];
  return{rooms,front:f?[single(f)]:[],back:b?[single(b)]:[]};
 }
 const fr={fixed:[],flex:[]},bk={fixed:backFixed(),flex:[]};
 const order=[...rooms].sort((a,b)=>(b.t==='tho')-(a.t==='tho'));
 for(const r of order){
  const okF=used(fr)+r.minW<=c.bw,okB=used(bk)+r.minW<=c.bw;
  if(!okF&&!okB)return null;
  const toF=okF&&(!okB||r.t==='tho'||r.t==='master'||(r.t!=='giat'&&c.bw-used(fr)>=c.bw-used(bk)));
  (toF?fr:bk).flex.push(r);
 }
 return{rooms,front:fr.flex.length?[fr]:[],back:[bk]};
}

function build(o,N,c,p){
 const A=c.mode==='A',multi=N>1;
 const backFixed=()=>{const f=[];if(multi)f.push(fx('stair',2.4,3.8));f.push(fx('wc',1.8,2.2));if(o.gt)f.push(fx('gt',c.bw<9?1.4:1.8,1.5));return f};
 const floors=[];
 if(!multi){
  const g={name:'Tầng 1',lvl:0,front:[],back:[]};
  if(A){
   if(p.park)g.front.push(single(cl(p.park)));
   g.front.push(single(cl(p.khach)));
   const rows=[];if(o.gt)rows.push(single(mk('gt',0.01,1,1.6)));
   [...p.beds,...p.extra].forEach(r=>rows.push(single(cl(r))));
   rows.push({fixed:[fx('wc',1.6,2)],flex:[cl(p.bep)]});
   g.back=markStrip(rows);
  }else{
   g.front=pack([p.park,p.khach].filter(Boolean).map(cl),c.bw,{});
   const last=g.front[g.front.length-1],rest=[];
   for(const b of p.beds){if(!rest.length&&used(last)+b.minW<=c.bw)last.flex.push(cl(b));else rest.push(cl(b))}
   g.back=pack([...rest,...p.extra.map(cl),cl(p.bep)],c.bw,{fixed0:backFixed(),strip:true});
  }
  floors.push(g);return{floors,ok:true};
 }
 const g={name:'Tầng 1',lvl:0,front:[],back:[]};
 const ongba=p.beds.find(b=>b.t==='ongba');
 const ups=[...p.beds.filter(b=>b!==ongba),...(p.lv?[p.lv]:[])].map(cl);
 if(A){
  if(p.park)g.front.push(single(cl(p.park)));
  g.front.push(single(cl(p.khach)));
  const rows=[];if(ongba)rows.push(single(cl(ongba)));
  rows.push({fixed:[fx('wc',1.6,2)],flex:[cl(p.bep)]});
  g.back=markStrip(rows);
 }else{
  g.front=pack([p.park,p.khach].filter(Boolean).map(cl),c.bw,{});
  g.back=pack([ongba,p.bep].filter(Boolean).map(cl),c.bw,{fixed0:backFixed(),strip:true});
 }
 floors.push(g);
 const U=N-1,q=ups.slice();
 for(let i=0;i<U;i++){
  const t=Math.ceil(q.length/(U-i)),take=[];
  while(take.length<t&&q.length&&ring([...take,q[0]],c,backFixed))take.push(q.shift());
  floors.push(Object.assign({name:'Tầng '+(i+2),lvl:i+1},ring(take,c,backFixed)));
 }
 if(q.length)return{floors,ok:false};
 const sp=[p.tho,p.giat].filter(Boolean).map(cl);
 if(sp.length){
  const top=floors[floors.length-1],r=ring(top.rooms.concat(sp),c,backFixed);
  const r2=!r&&p.tho&&p.giat&&top.lvl>0?ring(top.rooms.concat([cl(p.tho)]),c,backFixed):null;
  if(r)Object.assign(top,r);
  else if(r2){Object.assign(top,r2);floors.push(Object.assign({name:'Tầng tum',lvl:floors.length,tum:true},ring([cl(p.giat)],c,backFixed)))}
  else floors.push(Object.assign({name:'Tầng tum',lvl:floors.length,tum:true},ring(sp,c,backFixed)));
 }
 return{floors,ok:true};
}

function natDepth(row,bw){
 const fw=sum(row.fixed,x=>x.fixed),flexW=bw-fw-(row.strip?STRIP:0);
 if(!row.flex.length&&flexW>0.6)row.flex.push(mk(flexW<2.4?'kho':'dn',0.01,0,0,{filler:1}));
 const ws=alloc(row.flex,flexW);let d=1;
 row.fixed.forEach(x=>d=Math.max(d,x.minD));
 row.flex.forEach((x,i)=>{d=Math.max(d,x.minD,Math.min(6.5,x.area/Math.max(ws[i],0.5)))});
 return d;
}
const nat=rows=>sum(rows,r=>r.d);
const stretch=(rows,gap)=>{const t=nat(rows);rows.forEach(r=>r.d+=gap*r.d/t)};

function fill(fl,side,target,c){
 const rows=fl[side],gap=target-nat(rows),ground=fl.lvl===0;
 if(gap<0.05)return;
 if(c.mode==='B'&&side==='back'&&rows.length){
  if(!ground)rows.push({fixed:[],flex:[mk(gap<=1.8?'logia':'terr',1,0,0,{filler:1,name:gap<=1.8?'Lô gia':'Sân thượng (mái tầng dưới)'})],d:gap,filler:1});
  else stretch(rows,gap);return;
 }
 if(!rows.length||gap>=2.2){
  let fd=gap;if(rows.length&&gap>6.5){fd=6.5;stretch(rows,gap-fd)}
  const t=side==='front'?(ground?'sanh':'shc'):(!ground&&fd<2.6&&rows.length?'logia':(ground?'dn':'shc'));
  const cell=mk(t,1,0,0,{filler:1});if(t==='shc'&&side==='back')cell.name='Phòng sinh hoạt';
  const row={fixed:[],flex:[cell],d:fd,filler:1};
  if(side==='front'||t==='logia')rows.push(row);else rows.unshift(row);
 }else stretch(rows,gap);
}

function cellOf(r,x,y,w,d,side,extra){
 const cc={t:r.t,name:r.name,x,y,w,d,side,c:R[r.t][2],open:isOpen(r),target:r.filler?0:r.area,filler:r.filler};
 if(r.ens&&w>=2.6&&d>=2.8){const ew=Math.min(1.6,w*0.42),ed=Math.min(2.2,d*0.48);cc.wc={x,y:side==='front'?y+d-ed:y,w:ew,d:ed}}
 return Object.assign(cc,extra||{});
}

function geo(fl,c,FY,CD,BY,o,F){
 const cells=[],A=c.mode==='A';
 const place=(row,y,side)=>{
  const fw=sum(row.fixed,x=>x.fixed),ws=alloc(row.flex,c.bw-fw-(row.strip?STRIP:0));let x=0;
  const hasSt=row.fixed.some(r=>r.t==='stair'),cap=hasSt?3.8*F:2.4;let grp=null;
  const flush=()=>{if(grp){const dd=row.d-cap,t=dd>=2.2&&grp.w>=2.4?'dn':'kho';cells.push(cellOf(mk(t,0,0,0,{filler:1}),grp.x,y+cap,grp.w,dd,side));grp=null}};
  row.fixed.forEach(r=>{const cut=(r.t==='stair'||r.t==='wc')&&row.d>cap+0.6;
   cells.push(cellOf(r,x,y,r.fixed,cut?cap:row.d,side));
   if(cut){if(grp)grp.w+=r.fixed;else grp={x,w:r.fixed}}else flush();x+=r.fixed});flush();
  row.flex.forEach((r,i)=>{cells.push(cellOf(r,x,y,ws[i],row.d,side));x+=ws[i]});
  if(row.strip)cells.push(cellOf(mk('hall',0,0,0,{filler:1}),c.bw-STRIP,y,STRIP,row.d,side,{strip:1}));
 };
 let y=fl.tum?FY-nat(fl.front):0;
 if(fl.tum&&y>0.05)cells.push(cellOf(mk('terr',0,0,0,{filler:1}),0,0,c.bw,y,'front'));
 fl.front.forEach(r=>{place(r,y,'front');y+=r.d});
 if(CD>0){
  const hn=fl.lvl===0?'sanh':'hall';
  if(A){
   cells.push(cellOf(fx('stair',2.4,CD),0,FY,2.4,CD,'core'));let x=2.4;const cw=c.bw-2.4;
   if(o.gt&&cw-1.1>=1.2){cells.push(cellOf(mk('gt',0,0,0,{filler:1}),x,FY,cw-1.1,CD,'core'));x+=cw-1.1}
   cells.push(cellOf(mk(hn,0,0,0,{filler:1}),x,FY,c.bw-x,CD,'core'));
  }else cells.push(cellOf(mk(hn,0,0,0,{filler:1,name:fl.lvl===0?'Sảnh – hành lang':'Hành lang'}),0,FY,c.bw,CD,'core'));
 }
 y=FY+CD;
 fl.back.forEach(r=>{place(r,y,'back');y+=r.d});
 const BD=FY+CD+BY;
 if(fl.tum&&BD-y>0.05)cells.push(cellOf(mk('terr',0,0,0,{filler:1}),0,y,c.bw,BD-y,'back'));
 return cells;
}

const RANK={hall:0,sanh:0,shc:1,dn:1,khach:2,bep:2,logia:5,xe:4,gara:4};
function openings(cells,c,fl,BD,fy){
 const E=0.02,adj=[],D=[],O=[],Wn=[],warns=[];
 for(let i=0;i<cells.length;i++)for(let j=i+1;j<cells.length;j++){
  const a=cells[i],b=cells[j];
  for(const[p,q]of[[a,b],[b,a]]){
   if(Math.abs(p.y+p.d-q.y)<E){const s0=Math.max(p.x,q.x),s1=Math.min(p.x+p.w,q.x+q.w);if(s1-s0>0.05)adj.push({a:p,b:q,h:1,p:q.y,s0,s1})}
   if(Math.abs(p.x+p.w-q.x)<E){const s0=Math.max(p.y,q.y),s1=Math.min(p.y+p.d,q.y+q.d);if(s1-s0>0.05)adj.push({a:p,b:q,h:0,p:q.x,s0,s1})}
  }
 }
 const seg=(e,s0,s1)=>e.h?[s0,e.p,s1,e.p]:[e.p,s0,e.p,s1];
 const door=(e,cell,w,pos,o2)=>{const len=e.s1-e.s0;w=Math.min(w,len-0.1);if(w<0.55)return;
  const s1=pos==='mid'?e.s0+(len+w)/2:e.s1-0.15,s0=s1-w;
  const n=e.h?[0,cell.y<e.p?-1:1]:[cell.x<e.p?-1:1,0];
  D.push(Object.assign({s:seg(e,s0,s1),n,w},o2||{}))};
 const outer=x=>x.t==='terr'||x.t==='logia';
 for(const e of adj){
  const{a,b}=e,pair=[a.t,b.t].sort().join();
  if(pair==='gara,khach'||pair==='khach,xe'){door(e,a.t==='khach'?a:b,1.4,'mid',{dbl:1});continue}
  if(outer(a)!==outer(b)){const inn=outer(a)?b:a;if(inn.t!=='gt'&&inn.t!=='stair')door(e,inn,inn.open?1.4:1,'mid',{dbl:inn.open?1:0});continue}
  if(a.open&&b.open&&!outer(a))O.push({s:seg(e,e.s0+0.05,e.s1-0.05)});
 }
 for(const cell of cells){
  if(cell.open||cell.t==='gt')continue;
  const cand=adj.filter(e=>(e.a===cell||e.b===cell)).map(e=>({e,o:e.a===cell?e.b:e.a})).filter(z=>z.o.open&&RANK[z.o.t]!==undefined&&!outer(z.o)&&z.e.s1-z.e.s0>=0.75);
  if(cell.t==='wc'&&!cand.length){}
  cand.sort((u,v)=>RANK[u.o.t]-RANK[v.o.t]||(v.e.s1-v.e.s0)-(u.e.s1-u.e.s0));
  if(!cand.length){if(!cell.filler)warns.push(cell.name+' chưa có lối vào hợp lý – hãy thử đổi số tầng hoặc số phòng.');continue}
  door(cand[0].e,cell,/wc|kho/.test(cell.t)?0.7:0.85,'end');
  if(cell.wc){const w=cell.wc,e={h:0,p:w.x+w.w,s0:w.y,s1:w.y+w.d};door(e,{x:w.x,y:w.y},0.65,'mid')}
 }
 const sideWalls=c.side>0.3;
 for(const cell of cells){
  if(['hall','sanh','terr','logia','gt'].includes(cell.t)||cell.strip)continue;
  const ed=[];
  if(cell.y<E)ed.push({h:1,p:0,s0:cell.x,s1:cell.x+cell.w,n:[0,1],front:1});
  if(Math.abs(cell.y+cell.d-BD)<E)ed.push({h:1,p:BD,s0:cell.x,s1:cell.x+cell.w,n:[0,-1],back:1});
  if(sideWalls&&cell.x<E)ed.push({h:0,p:0,s0:cell.y,s1:cell.y+cell.d,n:[1,0]});
  if(sideWalls&&Math.abs(cell.x+cell.w-c.bw)<E)ed.push({h:0,p:c.bw,s0:cell.y,s1:cell.y+cell.d,n:[-1,0]});
  for(const e of ed){
   const len=e.s1-e.s0;
   if(fl.lvl===0&&e.front&&(cell.t==='gara'||cell.t==='xe')){D.push({s:seg(e,e.s0+0.2,e.s1-0.2),gate:1});continue}
   if(fl.lvl===0&&e.front&&cell.t==='khach'){const w=Math.min(1.4,len-0.3),m=(e.s0+e.s1)/2;D.push({s:seg(e,m-w/2,m+w/2),n:e.n,w,dbl:1,ext:1});continue}
   if(fl.lvl===0&&e.back&&cell.t==='bep'&&len>2){const s1=e.s1-0.3;D.push({s:seg(e,s1-0.85,s1),n:e.n,w:0.85,ext:1});
    if(len>3.4){const m=e.s0+(len-1.2)/2;Wn.push({s:seg(e,m-0.6,m+0.6)})}continue}
   if(fl.lvl>0&&!fl.tum&&e.front&&fy>=0.9&&!cell.open&&cell.t!=='wc'&&len>=2){const w=Math.min(1.4,len-0.6),m=(e.s0+e.s1)/2;D.push({s:seg(e,m-w/2,m+w/2),n:e.n,w,dbl:1,ext:1});continue}
   if(cell.t==='stair'&&!e.h)continue;
   const w=Math.min(cell.t==='wc'?0.6:1.5,len*0.5);if(w<0.5)continue;const m=(e.s0+e.s1)/2;
   Wn.push({s:seg(e,m-w/2,m+w/2)});
  }
 }
 return{D,O,Wn,warns};
}

function finish(floors,c,o){
 const multi=floors.length>1,A=c.mode==='A';
 const CD=multi?(A?CORE_A:CORR):(A?0:CORR);
 floors.forEach(fl=>[...fl.front,...fl.back].forEach(r=>r.d=natDepth(r,c.bw)));
 const main=floors.filter(f=>!f.tum);
 let FY=Math.max(...main.map(f=>nat(f.front))),BY=Math.max(...main.map(f=>nat(f.back)));
 floors.filter(f=>f.tum).forEach(f=>{FY=Math.max(FY,nat(f.front));BY=Math.max(BY,nat(f.back))});
 main.forEach(fl=>{fill(fl,'front',FY,c);fill(fl,'back',BY,c)});
 const avail=c.L-c.minF-c.minB;let f=1;
 if(FY+CD+BY>avail){f=Math.max(0.3,(avail-CD)/(FY+BY));floors.forEach(fl=>[...fl.front,...fl.back].forEach(r=>r.d*=f));FY*=f;BY*=f}
 const BD=FY+CD+BY,left=Math.max(0,avail-BD);
 const fy=o.type==='pho'?c.minF+Math.min(left,Math.max(0,3.5-c.minF)):c.minF+left*0.6;
 const by=c.L-BD-fy;
 const out=floors.map(fl=>{
  const cells=geo(fl,c,FY,CD,BY,o,f),op=openings(cells,c,fl,BD,fy);
  return{name:fl.name,lvl:fl.lvl,tum:!!fl.tum,cells,...op,rows:{front:fl.front.map(r=>r.d),back:fl.back.map(r=>r.d)},FY,CD,BY};
 });
 if(o.mirror){
  const mx=x=>c.bw-x;
  out.forEach(fl=>{
   fl.cells.forEach(k=>{k.x=c.bw-k.x-k.w;if(k.wc)k.wc.x=c.bw-k.wc.x-k.wc.w});
   [...fl.D,...fl.O,...fl.Wn].forEach(d=>{d.s=[mx(d.s[0]),d.s[1],mx(d.s[2]),d.s[3]];if(d.n)d.n=[-d.n[0],d.n[1]]});
  });
 }
 return{floors:out,BD,fy,by,f,CD,FY,BY};
}

function generate(o){
 const c=ctxOf(o),warns=[],tips=[];
 if(c.bw<3.4)return{err:'Mặt tiền phần xây dựng chỉ còn '+fmt(c.bw)+' m – quá hẹp để bố trí cầu thang và lối đi. Hãy tăng chiều rộng đất (tối thiểu khoảng 3,5 m).'};
 if(c.L<8)return{err:'Chiều dài đất dưới 8 m quá ngắn để bố trí nhà ở. Hãy tăng chiều dài.'};
 const p=program(o,c),lot=c.W*c.L,cap=densityCap(lot);
 let Ns=o.type==='cap4'?[1]:o.floors!=='auto'?[+o.floors]:(o.type==='villa'?[1,2,3,4]:[2,3,4,5,6,7]);
 if(o.floors!=='auto'&&o.type!=='cap4')for(let n=+o.floors+1;n<=8;n++)Ns.push(n);
 let best=null,bestN=0;
 for(const N of Ns){
  const b=build(o,N,c,p);if(!b.ok)continue;
  const r=finish(b.floors,c,o),dens=c.bw*r.BD/lot;
  const good=r.f>=0.95&&(o.type==='pho'||dens<=cap+0.03);
  if(!best||good&&!best.good||(!best.good&&r.f>best.f+0.02)){best=Object.assign(r,{good,dens});bestN=N}
  if(good||o.floors!=='auto'&&N===+o.floors&&r.f>=0.8)break;
 }
 const r=best;
 if(o.floors!=='auto'&&o.type!=='cap4'&&bestN!==+o.floors)warns.push(`Với ${o.floors} tầng không đủ chỗ cho ${p.B} phòng ngủ trên mảnh đất này, nên phác thảo tự tăng lên ${bestN} tầng.`);
 if(r.f<0.95)warns.push(`Mảnh đất hơi ngắn so với nhu cầu: các phòng bị thu nhỏ khoảng ${Math.round((1-r.f)*100)}%. ${o.type==='cap4'?'Nên chuyển sang nhà phố/nhà vườn 2 tầng hoặc giảm số phòng.':'Hãy tăng số tầng hoặc giảm số phòng.'}`);
 if(r.dens>cap+0.03)warns.push(`Mật độ xây dựng ${pct(r.dens)} vượt mức tham khảo ${pct(cap)} cho lô ${fmt(lot,0)} m² (QCVN 01:2021/BXD). Hãy kiểm tra quy hoạch địa phương; có thể phải lùi thêm sân sau.`);
 if(p.warnPark===1)warns.push('Mặt tiền quá hẹp cho gara ô tô (cần ≥ 3,2 m), phác thảo chuyển sang chỗ để xe máy.');
 if(p.warnPark===2)warns.push('Mặt tiền chưa đủ cho 2 ô tô cạnh nhau, phác thảo bố trí gara 1 ô tô.');
 if(o.gt&&c.mode==='A'&&r.floors.length>1&&c.bw-2.4-1.1<1.2)warns.push('Mặt tiền hẹp nên không đặt được giếng trời giữa nhà; hãy dùng sân sau làm khoảng thông gió.');
 const seen=new Set();
 r.floors.forEach(fl=>{fl.warns.forEach(w=>seen.has(w)||(seen.add(w),warns.push(fl.name+': '+w)));
  fl.cells.forEach(k=>{if(k.target&&!k.open&&k.w*k.d<k.target*0.72&&k.t!=='wc'&&k.t!=='gt')warns.push(`${fl.name}: ${k.name} khá chật (${fmt(k.w*k.d)} m²).`)})});
 const covered=fl=>sum(fl.cells.filter(k=>k.t!=='terr'&&k.t!=='logia'&&!(k.t==='gt'&&fl.lvl>0)),k=>k.w*k.d);
 const stats={lot,cap,foot:c.bw*r.BD,dens:r.dens,total:sum(r.floors,covered),N:r.floors.filter(f=>!f.tum).length,tum:r.floors.some(f=>f.tum),
  beds:p.B,auto:p.auto,wc:sum(r.floors,fl=>sum(fl.cells,k=>(k.t==='wc')+(k.wc?1:0)))};
 return Object.assign(r,{c,p,stats,warns,o});
}
const fmt=(v,d=1)=>(+v).toFixed(d).replace('.',',');
const pct=v=>Math.round(v*100)+'%';

/* ===== Vẽ SVG ===== */
const ESC=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const n3=v=>+v.toFixed(3);
function svgPlan(res,fl,view){
 const c=res.c,W=c.W,L=c.L,fy=res.fy,BD=res.BD,by=res.by;
 const X=x=>n3(c.bx+x),Y=y=>n3(L-fy-y);
 const fs=clamp(Math.max(W,L)/46,0.28,0.7),m={l:2.4,r:2.4,t:1.9,b:2.4},s=[];
 const vb=[-m.l,-m.t,W+m.l+m.r,L+m.t+m.b];
 const rect=(x,y,w,h,cls,ex='')=>`<rect x="${n3(x)}" y="${n3(y)}" width="${n3(Math.max(w,0))}" height="${n3(Math.max(h,0))}" class="${cls}" ${ex}/>`;
 const line=(x1,y1,x2,y2,cls)=>`<line x1="${n3(x1)}" y1="${n3(y1)}" x2="${n3(x2)}" y2="${n3(y2)}" class="${cls}"/>`;
 const txt=(x,y,t,size,cls='lb',ex='')=>`<text x="${n3(x)}" y="${n3(y)}" font-size="${n3(size)}" class="${cls}" ${ex}>${ESC(t)}</text>`;
 const up=fl.lvl>0;
 s.push(rect(-m.l,L+0.3,W+m.l+m.r,1.4,'street'),txt(W/2,L+1.12,'Mặt đường',fs*0.9,'st'));
 s.push(rect(0,0,W,L,up?'yard below':(res.o.type==='pho'?'yard pave':'yard grass')));
 if(!up&&res.o.type==='pho'&&by>0.4)s.push(rect(0,0,W,by,'yard grass'));
 if(!up&&res.o.type!=='pho'){
  const tr=[];const tree=(x,y,r)=>tr.push(`<circle cx="${n3(x)}" cy="${n3(y)}" r="${n3(r)}" class="tree"/><circle cx="${n3(x)}" cy="${n3(y)}" r="${n3(r*0.25)}" class="trunk"/>`);
  if(by>2.2)for(let x=1.4;x<W-1;x+=3.2)tree(x,by/2,Math.min(1,by/3));
  if(fy>3){tree(1.3,L-fy/2,Math.min(1.1,fy/3.5));tree(W-1.3,L-fy/2,Math.min(1.1,fy/3.5))}
  if(c.side>1.6)for(let y=by+1.5;y<L-fy-1;y+=3.4){tree(c.side/2,y,c.side*0.35);tree(W-c.side/2,y,c.side*0.35)}
  s.push(...tr);
  s.push(rect(c.bx+c.bw*0.5-1.4,L-fy,2.8,fy,'path'));
 }
 if(!up&&res.o.type==='pho')s.push(txt(W/2,L-fy/2+fs*0.35,fy>1.2?'Sân trước':'',fs*0.8,'yl'));
 if(by>1.2&&!up)s.push(txt(W/2,by/2+fs*0.35,by>3?'Sân sau – vườn':'Sân sau',fs*0.8,'yl'));
 if(up&&!fl.tum&&fy>=0.9){const bd=Math.min(1.2,fy-0.2);s.push(rect(X(0),Y(0),c.bw,bd,'balc'),txt(X(c.bw/2),Y(0)+bd/2+fs*0.3,'Ban công',fs*0.7,'yl'))}
 s.push(rect(0,0,W,L,'lotline'));
 const cs=fl.cells;
 for(const k of cs)s.push(rect(X(k.x),Y(k.y+k.d),k.w,k.d,'f-'+k.c));
 if(view.furn)for(const k of cs)s.push(furn(k,X,Y,res,fl));
 for(const k of cs){s.push(rect(X(k.x),Y(k.y+k.d),k.w,k.d,'wi'));if(k.wc)s.push(rect(X(k.wc.x),Y(k.wc.y+k.wc.d),k.wc.w,k.wc.d,'f-wet wi'))}
 if(view.furn)for(const k of cs)if(k.wc)s.push(wcFurn({x:X(k.wc.x),y:Y(k.wc.y+k.wc.d),w:k.wc.w,h:k.wc.d}));
 s.push(rect(X(0),Y(BD),c.bw,BD,'we'));
 const S=d=>[X(d.s[0]),Y(d.s[1]),X(d.s[2]),Y(d.s[3])];
 for(const o of fl.O){const[a,b,cc,d]=S(o);s.push(line(a,b,cc,d,'gap'),line(a,b,cc,d,'opn'))}
 for(const w of fl.Wn){const[a,b,cc,d]=S(w),h=b===d,o=0.06;s.push(line(a,b,cc,d,'gapx'),h?line(a,b-o,cc,d-o,'win')+line(a,b+o,cc,d+o,'win'):line(a-o,b,cc-o,d,'win')+line(a+o,b,cc+o,d,'win'))}
 for(const d of fl.D){
  const[a,b,cc,e]=S(d);s.push(line(a,b,cc,e,d.ext||d.gate?'gapx':'gap'));
  if(d.gate){s.push(line(a,b,cc,e,'gate'));continue}
  const nx=d.n[0],ny=-d.n[1];
  const leaf=(hx,hy,ox,oy,w)=>{const lx=hx+nx*w,ly=hy+ny*w,cr=(lx-hx)*(oy-hy)-(ly-hy)*(ox-hx);
   return`<path d="M${n3(hx)} ${n3(hy)}L${n3(lx)} ${n3(ly)}" class="leaf"/><path d="M${n3(lx)} ${n3(ly)}A${n3(w)} ${n3(w)} 0 0 ${cr>0?1:0} ${n3(ox)} ${n3(oy)}" class="arc"/>`};
  if(d.dbl){const mx=(a+cc)/2,my=(b+e)/2,w=Math.hypot(cc-a,e-b)/2;s.push(leaf(a,b,mx,my,w),leaf(cc,e,mx,my,w))}
  else s.push(leaf(cc,e,a,b,Math.hypot(cc-a,e-b)));
 }
 for(const k of cs)s.push(label(k,X,Y,fs,view));
 s.push(dims(res,fl,X,Y,fs,view));
 s.push(compass(res.o.dir,W+1.55,-1.05,0.5,fs));
 return`<svg viewBox="${vb.map(n3).join(' ')}" xmlns="http://www.w3.org/2000/svg" class="plan${view.simple?' simple':''}" role="img" aria-label="${ESC(fl.name)}"><defs><pattern id="hatch" width="0.4" height="0.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="0.4" class="ht"/></pattern></defs>${s.join('')}</svg>`;
}
function label(k,X,Y,fs,view){
 if(k.strip)return'';
 let x0=X(k.x),x1=x0+k.w;const yTop=Y(k.y+k.d),h=k.d;
 if(k.wc){const wx=X(k.wc.x);if(Math.abs(wx-x0)<0.01)x0+=k.wc.w;else x1-=k.wc.w}
 const w=x1-x0;let cy=yTop+h/2;
 if(k.c==='bed'&&h>=3.3)cy=k.side==='front'?yTop+Math.min(h*0.3,h-2.3):yTop+h-Math.min(h*0.3,h-2.3);
 if(['hall','sanh'].includes(k.t)&&(k.w<1.6||k.d<1.6))return'';
 let lines=[k.name],fz=Math.min(fs,w*0.86/(k.name.length*0.54));
 if(fz<fs*0.7&&k.name.includes(' ')){const ws=k.name.split(' ');let best=null;for(let i=1;i<ws.length;i++){const l=[ws.slice(0,i).join(' '),ws.slice(i).join(' ')],mx=Math.max(...l.map(z=>z.length));if(!best||mx<best.mx)best={l,mx}}
  lines=best.l;fz=Math.min(fs,w*0.86/(best.mx*0.54))}
 fz=Math.max(fz,fs*0.5);if(fz*lines.length*1.2>h*0.9)fz=Math.max(fs*0.45,h*0.9/(lines.length*1.2+1));
 const showA=!k.open||['khach','bep','gara','xe','shc','dn'].includes(k.t);
 const sub=showA&&!['terr','gt','stair'].includes(k.t)?fmt(k.w*k.d)+' m²':'';
 const dm=view.dims&&sub&&k.w>1.6?fmt(k.w)+' × '+fmt(k.d):'';
 const extra=(sub?1:0)+(dm?1:0),tot=lines.length*fz*1.15+extra*fz*0.95;
 let y=cy-tot/2+fz*0.85,o='';
 lines.forEach(l=>{o+=`<tspan x="${n3((x0+x1)/2)}" y="${n3(y)}">${ESC(l)}</tspan>`;y+=fz*1.15});
 let out=`<text class="lb" font-size="${n3(fz)}">${o}</text>`;
 if(sub){out+=`<text class="la" x="${n3((x0+x1)/2)}" y="${n3(y-fz*0.1)}" font-size="${n3(fz*0.78)}">${ESC(sub)}</text>`;y+=fz*0.95}
 if(dm)out+=`<text class="la dm" x="${n3((x0+x1)/2)}" y="${n3(y-fz*0.15)}" font-size="${n3(fz*0.68)}">${ESC(dm)}</text>`;
 return out;
}
function dims(res,fl,X,Y,fs,view){
 const c=res.c,W=c.W,L=c.L,o=[],f=fs*0.72;
 const dh=(x1,x2,y,t)=>{o.push(`<line x1="${n3(x1)}" y1="${n3(y)}" x2="${n3(x2)}" y2="${n3(y)}" class="dl"/>`);[x1,x2].forEach(x=>o.push(`<line x1="${n3(x-0.12)}" y1="${n3(y+0.12)}" x2="${n3(x+0.12)}" y2="${n3(y-0.12)}" class="dt"/><line x1="${n3(x)}" y1="${n3(y-0.25)}" x2="${n3(x)}" y2="${n3(y+0.25)}" class="dl"/>`));
  if(x2-x1>f*2.2)o.push(`<text x="${n3((x1+x2)/2)}" y="${n3(y-0.14)}" font-size="${n3(f)}" class="dx">${t}</text>`)};
 const dv=(y1,y2,x,t)=>{o.push(`<line x1="${n3(x)}" y1="${n3(y1)}" x2="${n3(x)}" y2="${n3(y2)}" class="dl"/>`);[y1,y2].forEach(y=>o.push(`<line x1="${n3(x-0.12)}" y1="${n3(y+0.12)}" x2="${n3(x+0.12)}" y2="${n3(y-0.12)}" class="dt"/><line x1="${n3(x-0.25)}" y1="${n3(y)}" x2="${n3(x+0.25)}" y2="${n3(y)}" class="dl"/>`));
  if(y2-y1>f*2.2){const cy=(y1+y2)/2;o.push(`<text x="${n3(x-0.14)}" y="${n3(cy)}" font-size="${n3(f)}" class="dx" transform="rotate(-90 ${n3(x-0.14)} ${n3(cy)})">${t}</text>`)}};
 dh(0,W,-1.05,fmt(W)+' m');
 if(c.bx>0.05)dh(X(0),X(c.bw),-0.45,fmt(c.bw));
 dv(0,L,W+0.75,fmt(L)+' m');
 const ch=[res.fy,...fl.rows.front,fl.CD,...fl.rows.back,res.by];
 if(fl.tum){ch.splice(1,fl.rows.front.length,fl.FY);ch.splice(3,fl.rows.back.length,fl.BY)}
 let y=L;for(const d of ch){if(d>0.05)dv(y-d,y,-0.8,fmt(d));y-=d}
 return o.join('');
}
function compass(dir,cx,cy,r,fs){
 const ang={N:0,NE:45,E:90,SE:135,S:180,SW:225,W:270,NW:315}[dir]||180,rot=180-ang;
 return`<g transform="translate(${n3(cx)} ${n3(cy)}) rotate(${rot})"><circle r="${r}" class="cmp"/><path d="M0 ${-r*0.85}L${r*0.32} ${r*0.45}L0 ${r*0.2}L${-r*0.32} ${r*0.45}Z" class="cmpn"/><text y="${n3(-r-0.12)}" font-size="${n3(fs*0.7)}" class="dx">B</text></g>`;
}
/* Đồ đạc */
function wcFurn(q){const o=[],tx=q.x+q.w-0.32,ty=q.y+0.4;
 if(q.w<0.9||q.h<1.1)return'';
 o.push(`<rect x="${n3(tx-0.22)}" y="${n3(q.y+0.08)}" width="0.44" height="0.18" class="fu"/><ellipse cx="${n3(tx)}" cy="${n3(ty+0.1)}" rx="0.19" ry="0.26" class="fu"/>`);
 o.push(`<rect x="${n3(q.x+0.1)}" y="${n3(q.y+0.08)}" width="0.48" height="0.38" rx="0.06" class="fu"/><circle cx="${n3(q.x+0.34)}" cy="${n3(q.y+0.28)}" r="0.1" class="fu"/>`);
 if(q.h>1.9&&q.w>1.1){const sy=q.y+q.h-0.95;o.push(`<rect x="${n3(q.x+q.w-0.95)}" y="${n3(sy)}" width="0.85" height="0.85" class="fu sh"/><line x1="${n3(q.x+q.w-0.95)}" y1="${n3(sy)}" x2="${n3(q.x+q.w-0.1)}" y2="${n3(sy+0.85)}" class="fu"/>`)}
 return o.join('')}
function furn(k,X,Y,res,fl){
 const x=X(k.x),y=Y(k.y+k.d),w=k.w,h=k.d,o=[];
 const R_=(a,b,c,d,ex='')=>o.push(`<rect x="${n3(a)}" y="${n3(b)}" width="${n3(c)}" height="${n3(d)}" class="fu" ${ex}/>`);
 const C_=(a,b,r,cls='fu')=>o.push(`<circle cx="${n3(a)}" cy="${n3(b)}" r="${n3(r)}" class="${cls}"/>`);
 const farBottom=k.side!=='back';
 switch(k.t){
 case'master':case'ongba':case'ngu':{
  let x0=x,x1=x+w;const wc=k.wc;
  if(wc&&h-2.15<wc.d){const wx=X(wc.x);if(Math.abs(wx-x)<0.01)x0+=wc.w;else x1-=wc.w}
  const uw=x1-x0;let bw=k.t==='ngu'?(uw>=2.6?1.4:1.2):1.8;if(uw<bw+0.3)bw=Math.max(0.9,uw-0.3);
  if(h<2.4||uw<1.2)break;
  const bx=x0+(uw-bw)/2,byy=farBottom?y+h-2.1:y+0.1;R_(bx,byy,bw,2,'rx="0.06"');
  const py=farBottom?y+h-0.5:y+0.2,pn=bw>=1.4?2:1,pw=(bw-0.3)/pn-0.05;
  for(let i=0;i<pn;i++)R_(bx+0.15+i*(pw+0.1),py,pw,0.3,'rx="0.08"');
  o.push(`<line x1="${n3(bx)}" y1="${n3(farBottom?byy+0.75:byy+1.25)}" x2="${n3(bx+bw)}" y2="${n3(farBottom?byy+0.75:byy+1.25)}" class="fu"/>`);
  const free=x1-(bx+bw);if(free>=0.95&&h>=3.2){const wl=Math.min(2,h-2.6>1.2?2:h*0.45);R_(x1-0.65,farBottom?y+h-0.1-wl:y+0.1,0.55,wl)}
  break}
 case'khach':{if(w<2.6||h<2.6)break;const sl=Math.min(2.6,h-0.8);R_(x+0.15,y+(h-sl)/2,0.85,sl,'rx="0.1"');R_(x+0.15,y+(h-sl)/2,0.25,sl);
  R_(x+1.35,y+h/2-0.55,0.6,1.1,'rx="0.05"');if(w>3.4)R_(x+w-0.55,y+h/2-0.9,0.4,1.8);
  if(w>4.6)R_(x+1.2,y+(farBottom?0.15:h-0.95),0.8,0.8,'rx="0.1"');break}
 case'shc':case'dn':{if(w<2.2||h<2.2)break;C_(x+w/2,y+h/2,Math.min(0.9,Math.min(w,h)/2-0.5),'fu rug');if(k.t==='shc')R_(x+w/2-1,y+(farBottom?0.15:h-0.95),2,0.8,'rx="0.1"');break}
 case'bep':{if(w<2.4||h<2.4)break;const cl_=Math.min(w-0.3,4);const cy=farBottom?y+h-0.7:y+0.1;R_(x+w-0.15-cl_,cy,cl_,0.6);
  C_(x+w-0.6,cy+0.3,0.14);C_(x+w-0.95,cy+0.3,0.14);R_(x+w-0.15-cl_+0.3,cy+0.1,0.6,0.4,'rx="0.05"');
  const ty=farBottom?y+(h-0.75)/2-0.45:y+0.7+(h-0.7)/2-0.45;if(h>3.4){R_(x+w/2-0.8,ty,1.6,0.9,'rx="0.06"');
   for(let i=0;i<3;i++){R_(x+w/2-0.7+i*0.55,ty-0.48,0.4,0.38,'rx="0.05"');R_(x+w/2-0.7+i*0.55,ty+1,0.4,0.38,'rx="0.05"')}}break}
 case'gara':{const n=k.name.includes('2')?2:1,cw=1.85,cl2=Math.min(4.6,h-0.6);
  for(let i=0;i<n;i++){const cx=x+(w-n*cw-(n-1)*0.6)/2+i*(cw+0.6),cy=y+(h-cl2)/2;R_(cx,cy,cw,cl2,'rx="0.35"');R_(cx+0.2,cy+cl2*0.22,cw-0.4,cl2*0.2,'rx="0.12"');R_(cx+0.2,cy+cl2*0.62,cw-0.4,cl2*0.14,'rx="0.1"')}
  const fr=w-n*cw-(n-1)*0.6;if(fr>1.6){const nb=Math.min(res.o.bikes,Math.floor((fr/2-0.1)/0.7));for(let i=0;i<nb;i++)R_(x+0.15+i*0.7,y+h/2-0.9,0.5,1.8,'rx="0.25"')}break}
 case'xe':{const nb=Math.min(res.o.bikes,Math.floor((w-0.2)/0.7));for(let i=0;i<nb;i++)R_(x+0.2+i*0.7,y+(h-1.8)/2,0.5,1.8,'rx="0.25"');break}
 case'wc':o.push(wcFurn({x,y,w,h}));break;
 case'stair':{const v=h>=w,L1=v?h:w,S=v?w:h,land=Math.min(1.1,S/2),o2=[];
  const P=(a,b)=>v?[x+a,y+b]:[x+b,y+a];
  const half=S/2;for(let t=land;t<L1-0.15;t+=0.27){const[p1,q1]=P(0.06,t),[p2,q2]=P(S-0.06,t);o2.push(`<line x1="${n3(p1)}" y1="${n3(q1)}" x2="${n3(p2)}" y2="${n3(q2)}" class="fu tr"/>`)}
  const[a1,b1]=P(half,land),[a2,b2]=P(half,L1-0.05);o2.push(`<line x1="${n3(a1)}" y1="${n3(b1)}" x2="${n3(a2)}" y2="${n3(b2)}" class="fu"/>`);
  const pts=[P(half/2,L1-0.3),P(half/2,land/2),P(half*1.5,land/2),P(half*1.5,L1-0.6)];
  o2.push(`<polyline points="${pts.map(p=>n3(p[0])+','+n3(p[1])).join(' ')}" class="arrow"/>`);
  const[e1,e2]=pts[3],[d1,d2]=pts[2];const dx=Math.sign(e1-d1),dy=Math.sign(e2-d2);
  o2.push(`<path d="M${n3(e1-0.14*dy-0.14*dx)} ${n3(e2-0.14*dy-0.14*dx)}L${n3(e1)} ${n3(e2)}L${n3(e1+0.14*dy-0.14*dx)} ${n3(e2-0.14*dy+0.14*dx)}" class="arrow"/>`);
  o.push(...o2);break}
 case'gt':{o.push(`<line x1="${n3(x)}" y1="${n3(y)}" x2="${n3(x+w)}" y2="${n3(y+h)}" class="fu gx"/><line x1="${n3(x+w)}" y1="${n3(y)}" x2="${n3(x)}" y2="${n3(y+h)}" class="fu gx"/>`);if(fl.lvl===0)C_(x+w/2,y+h/2,Math.min(w,h)*0.28,'tree');break}
 case'tho':{if(w<1.8)break;const tw=Math.min(1.8,w-0.4),ty=farBottom?y+h-0.65:y+0.1;R_(x+(w-tw)/2,ty,tw,0.55);for(let i=0;i<3;i++)C_(x+w/2+(i-1)*0.45,ty+0.27,0.09);break}
 case'lv':{if(w<2||h<2)break;const ty=farBottom?y+h-0.7:y+0.1;R_(x+(w-1.4)/2,ty,1.4,0.6);C_(x+w/2,farBottom?ty-0.35:ty+0.95,0.24);R_(x+0.1,y+0.4,0.35,Math.min(2,h-0.8));break}
 case'giat':{if(w<1.4||h<1.4)break;R_(x+0.12,y+0.12,0.6,0.6,'rx="0.05"');C_(x+0.42,y+0.42,0.2);if(w>1.6)R_(x+0.8,y+0.12,0.6,0.6,'rx="0.05"');
  for(let i=1;i<4;i++)o.push(`<line x1="${n3(x+0.2)}" y1="${n3(y+0.8+i*(h-1)/4)}" x2="${n3(x+w-0.2)}" y2="${n3(y+0.8+i*(h-1)/4)}" class="fu dash"/>`);break}
 case'kho':{if(w>1)R_(x+0.08,y+0.08,w-0.16,0.4);break}
 case'logia':case'terr':{if(w>1.6&&h>0.9)C_(x+0.5,y+h/2,Math.min(0.35,h/3),'tree');if(w>3&&h>0.9)C_(x+w-0.5,y+h/2,Math.min(0.35,h/3),'tree');break}
 }
 return o.join('');
}
window.NhaEngine={generate:generate,svgPlan:svgPlan,R:R,densityCap:densityCap};
})();
