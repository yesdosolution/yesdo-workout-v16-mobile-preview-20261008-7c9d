/* Guided Workout Session for V16 demo, built on V14 planner and V15 original video assets.
 * All estimates are approximate, logging requires explicit review and confirmation.
 * No AI / no external exercise API / no sales-data transfer.
 */
(function(){
'use strict';
const root=document.getElementById('workoutPage');
const app=document.getElementById('app');
if(!root||!app||typeof state==='undefined'||!Array.isArray(state.workoutPlans))return;
const meta={
 g_walk:{name:'เดินลู่ทางราบ',emoji:'🚶',guide:'เดินบนลู่ด้วยความเร็วที่ควบคุมได้ พูดได้เป็นประโยค และเพิ่มความเร็วทีละน้อย',mets:[3,3.5,3.8,4.8],clip:'treadmill'},
 g_incline:{name:'เดินลู่ชัน',emoji:'⛰️',guide:'เริ่มความชันต่ำ ยืนอย่างมั่นคง หยุดเมื่อหน้ามืดหรือเสียการทรงตัว',mets:[3,3.5,3.8],speed:[3.2,4,4.8]},
 g_run:{name:'จ็อกกิ้ง / วิ่งลู่',emoji:'🏃',guide:'วิ่งในความเร็วที่เหมาะกับความพร้อมและไม่มีอาการผิดปกติ',mets:[6.8,8.3]},
 g_bike:{name:'จักรยานฟิตเนส',emoji:'🚴',guide:'ตั้งเบาะและปรับแรงต้านให้เหมาะ ค่อย ๆ เพิ่มความหนัก',mets:[3.5,4,5,6],clip:'bike'},
 g_ellip:{name:'Elliptical',emoji:'🏃',guide:'ใช้เครื่องตามคำแนะนำของผู้ผลิต คุมการทรงตัว',mets:[5,9]},
 g_row:{name:'เครื่องกรรเชียงบก',emoji:'🚣',guide:'เริ่มเรียนรู้จังหวะขา ลำตัว และแขนก่อนเพิ่มความหนัก',mets:[5,7.3]},
 g_weights:{name:'เวทเครื่อง / ดัมเบล',emoji:'🏋️',guide:'เลือกแรงต้านที่ควบคุมท่าได้ พักระหว่างเซตได้ และให้ผู้ดูแลฟิตเนสช่วยแนะนำเมื่อจำเป็น',mets:[3.5,6],clip:'weight_lift'},
 h_walk:{name:'เดินภายในบ้าน',emoji:'🚶',guide:'เดินในบ้านที่ไม่มีพื้นลื่นหรือสิ่งกีดขวาง',mets:[2.3],clip:'home_walk'},
 h_chair:{name:'ลุกนั่งจากเก้าอี้',emoji:'🪑',guide:'เลือกเก้าอี้ที่มั่นคง ลุกนั่งตามความสามารถ ไม่ฝืนเข่าหรือหลัง',mets:[2.8],clip:'chair_squat'},
 h_wall:{name:'Wall Push-up',emoji:'🤲',guide:'ยืนมั่นคง ค่อย ๆ งอศอกเข้าหากำแพงและดันออก หากปวดไหล่หรือข้อมือให้หยุด',mets:[2.8],clip:'wall_pushup'},
 h_bridge:{name:'Glute Bridge',emoji:'🧘',guide:'นอนหงายงอเข่าและยกสะโพกอย่างควบคุมได้ ไม่ฝืนอาการปวดหลัง',mets:[2.8],clip:'glute_bridge'},
 h_body:{name:'Bodyweight Full Body',emoji:'💪',guide:'สลับท่าพื้นฐานตามความพร้อม เน้นการคุมท่าและพักระหว่างชุด',mets:[3,6],clip:'bodyweight'},
 h_cardio:{name:'Home Cardio ไม่กระโดด',emoji:'🎵',guide:'เดินย่ำอยู่กับที่หรือก้าวข้าง โดยไม่กระโดดและหยุดเมื่อเสียการทรงตัว',mets:[3.8]},
 h_yoga:{name:'Yoga เบื้องต้น',emoji:'🧘',guide:'เคลื่อนไหวช้า ๆ ตามช่วงที่สบาย ไม่กลั้นหายใจหรือดัดจนเจ็บ',mets:[2.3],clip:'gentle_yoga'},
 a_stroll:{name:'เดินเล่นสบาย ๆ',emoji:'🌳',guide:'เดินอย่างผ่อนคลายบนพื้นที่เหมาะสม',mets:[2.8]},
 a_brisk:{name:'เดินเร็ว',emoji:'👟',guide:'เลือกจังหวะที่หายใจแรงขึ้นแต่ยังพูดเป็นประโยคได้',mets:[3.8,4.8],clip:'brisk_walk'},
 a_stairs:{name:'ขึ้นบันไดช้า ๆ',emoji:'🪜',guide:'ใช้ราวจับหากจำเป็น หยุดหากเสียการทรงตัว',mets:[4.5]},
 a_stretch:{name:'ยืดเหยียดช่วงพักงาน',emoji:'🙆',guide:'ขยับไหล่ แขน ขา และลำตัวเบา ๆ ในช่วงไม่เจ็บ',mets:[2.3],clip:'desk_stretch'}
};
const recommended={
 gym:['g_walk','g_weights'],
 home:['h_walk','h_chair','h_yoga'],
 anywhere:['a_brisk','a_stretch']
};
let savedResults=null;
let pendingSwitch=null;
const presenterTrigger=document.getElementById('sidebarTriggerBtn');
const originalTriggerStyle=presenterTrigger?{display:presenterTrigger.style.getPropertyValue('display'),priority:presenterTrigger.style.getPropertyPriority('display')}:null;
function hidePresenterControl(){
 document.body.classList.add('wds-session-open');
 if(presenterTrigger)presenterTrigger.style.setProperty('display','none','important');
}
function restorePresenterControl(){
 document.body.classList.remove('wds-session-open');
 if(presenterTrigger){
   if(originalTriggerStyle&&originalTriggerStyle.display)presenterTrigger.style.setProperty('display',originalTriggerStyle.display,originalTriggerStyle.priority);
   else presenterTrigger.style.removeProperty('display');
 }
}
const screen=document.createElement('section');
screen.id='wdsSession';
screen.className='wds-screen hidden';
screen.setAttribute('aria-label','Workout Session');
screen.setAttribute('role','dialog');
screen.setAttribute('aria-modal','true');
app.appendChild(screen);
function localDay(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function weight(){return Math.max(35,Math.min(350,Number(state.weight)||80));}
function minutes(n){return Math.max(1,Math.min(180,Math.round(Number(n)||0)));}
function number(n){return (Number(n)||0).toLocaleString('th-TH');}
function risky(){const a=state.assessment||{};return Boolean((a.warningSymptom&&a.warningSymptom!=='none')||(a.healthCondition&&a.healthCondition!=='none'));}
function place(){const x=String((state.assessment||{}).workoutPlace||'');if(x.includes('ฟิตเนส'))return 'gym';if(x.includes('นอกบ้าน')||x.includes('เดิน/วิ่ง'))return 'anywhere';if(x.includes('บ้าน'))return 'home';return 'anywhere';}
function dayPlans(){return (state.workoutPlans||[]).filter(p=>p.day===localDay());}
function dayLogs(){return (state.workoutLogs||[]).filter(x=>x.day===localDay());}
function currentDraft(){const s=state.workoutSessionDraft;return s&&s.day===localDay()&&Array.isArray(s.items)?s:null;}
function persist(){if(typeof persistState==='function')persistState();}
function safeMet(item){
 const m=meta[item.id];if(!m)return 0;
 if(item.id==='g_incline'){
   const speed=(m.speed||[3.2])[Math.min(m.speed.length-1,item.variant||0)]||3.2;
   const mpm=speed*1000/60,grade=Math.max(0,Math.min(10,item.incline||0))/100;
   return (0.1*mpm+1.8*mpm*grade+3.5)/3.5;
 }
 return m.mets[Math.max(0,Math.min(m.mets.length-1,item.variant||0))]||m.mets[0];
}
function burn(item){
 const met=safeMet(item),hours=Math.max(0,Number(item.actualMinutes)||0)/60;
 return {met,gross:Math.round(met*weight()*hours),extra:Math.round(Math.max(0,met-1)*weight()*hours)};
}
function draftItemsFrom(plans){
 const logged=new Set(dayLogs().map(x=>x.planId).filter(Boolean));
 return plans.filter(p=>meta[p.id]&&!logged.has(p.planId)).map(p=>({
   planId:String(p.planId),id:p.id,minutes:minutes(p.minutes),
   actualMinutes:minutes(p.minutes),variant:Number(p.variant)||0,
   incline:Number(p.incline)||0,sets:Number(p.sets)||0,reps:Number(p.reps)||0,
   status:'pending'
 }));
}
function openSession(mode='all'){
 if(risky()){toast('มีข้อจำกัดสุขภาพที่ควรประเมินก่อนออกกำลัง');return;}
 let draft=currentDraft();
 if(draft&&mode==='recommended'){
   const ids=new Set(recommended[place()]||recommended.anywhere);
   const same=draft.items.length&&draft.items.every(x=>ids.has(x.id));
   if(!same){
     pendingSwitch={items:draftItemsFrom(dayPlans().filter(x=>ids.has(x.id)))};
     drawSwitch();return;
   }
 }
 if(!draft){
   let plans=dayPlans();
   if(mode==='recommended'){
     const ids=new Set(recommended[place()]||recommended.anywhere);
     plans=plans.filter(p=>ids.has(p.id));
   }
   const items=draftItemsFrom(plans);
   draft={day:localDay(),items,stage:'preview',cursor:0,editing:false};
   state.workoutSessionDraft=draft;
   persist();
 }
 pendingSwitch=null;
 hidePresenterControl();
 screen.classList.remove('hidden');
 draw();
}
function drawSwitch(){
 const old=currentDraft(),fresh=pendingSwitch?.items||[];
 hidePresenterControl();
 screen.classList.remove('hidden');
 screen.innerHTML='<header class="wds-top"><button class="wds-back" data-wds-action="close">‹</button><div class="wds-heading"><strong>เลือกแผนที่จะทำ</strong><small>คุณมี Workout ที่ค้างอยู่</small></div><button class="wds-close" data-wds-action="close">×</button></header>'+
 '<main class="wds-content"><div class="wds-hero"><div class="wds-kicker">WORKOUT CHOICE</div><h2>พบแผนที่ทำค้างอยู่</h2><p>ตอนนี้แผนแนะนำเปลี่ยนไปตามสถานที่/เวลาจาก Assessment เลือกได้ว่าจะกลับไปทำต่อ หรือเริ่มแผนใหม่</p></div>'+
 '<div class="wds-card"><b>แผนที่ทำค้าง</b><p style="font-size:12px;line-height:1.6;color:#687b6d">'+(old?.items.length||0)+' กิจกรรม · ยืนยันว่าทำแล้ว '+(old?.items.filter(x=>x.status==='done').length||0)+' กิจกรรม (ยังไม่ได้ส่งลงบันทึก)</p></div>'+
 '<div class="wds-card"><b>แผนแนะนำล่าสุด</b><p style="font-size:12px;line-height:1.6;color:#687b6d">'+fresh.length+' กิจกรรมที่ยังไม่บันทึก '+(fresh.length?'· '+fresh.map(x=>esc(meta[x.id]?.name||x.id)).join(' + '):'· ไม่มีรายการใหม่')+'</p></div>'+
 '<div class="wds-tip warn">ถ้าเริ่มแผนใหม่ สถานะที่ทำค้างใน Session เดิมจะถูกยกเลิก แต่ Workout ที่ยืนยันบันทึกไปแล้วจะยังอยู่</div></main>'+
 '<footer class="wds-footer"><button class="wds-btn secondary" data-wds-action="continueold">ทำแผนเดิมต่อ</button>'+
 '<button class="wds-btn primary" data-wds-action="switchnew" '+(!fresh.length?'disabled':'')+'>ใช้แผนใหม่ →</button></footer>';
}
function chooseNewPlan(){
 if(!pendingSwitch||!pendingSwitch.items.length)return;
 state.workoutSessionDraft={day:localDay(),items:pendingSwitch.items,stage:'preview',cursor:0,editing:false};
 pendingSwitch=null;savedResults=null;persist();draw();
}
function closeSession(){
 pendingSwitch=null;
 restorePresenterControl();
 pauseVideo();screen.classList.add('hidden');
 if(currentDraft())updateStartButton();
}
function pauseVideo(){screen.querySelectorAll('video').forEach(v=>{try{v.pause();}catch(e){}});}
function discardDraft(){state.workoutSessionDraft=null;persist();savedResults=null;closeSession();updateStartButton();}
function heroStats(items){
 const planned=items.reduce((s,x)=>s+x.minutes,0);
 const estimated=items.reduce((s,x)=>{const c=burn({...x,actualMinutes:x.minutes});return s+c.gross;},0);
 return '<div class="wds-stats"><div class="wds-stat"><strong>'+items.length+'</strong><span>กิจกรรม</span></div>'+
  '<div class="wds-stat"><strong>'+planned+' นาที</strong><span>เวลาตามแผน</span></div>'+
  '<div class="wds-stat"><strong>~'+number(estimated)+'</strong><span>kcal ประมาณ</span></div></div>';
}
function iconOf(item){const m=meta[item.id];return m&&m.clip?'<img loading="lazy" alt="" src="assets/workouts/'+m.clip+'_thumb.webp">':esc(m?.emoji||'🏃');}
function previewHtml(s){
 const items=s.items;
 const allDay=dayPlans().length, logged=dayLogs().length;
 const heading=items.length?'แผนพร้อมแล้ว!':'วันนี้บันทึกแผนนี้แล้ว';
 const name=place()==='gym'?'ฟิตเนส':place()==='home'?'ที่บ้าน':'ทุกที่';
 return '<div class="wds-hero"><div class="wds-kicker">YOUR WORKOUT SESSION</div><h2>'+heading+'</h2><p>เลือกจาก Assessment · '+name+' · แก้ไขเวลาได้ก่อนบันทึกจริง</p>'+heroStats(items)+'</div>'+
  '<h3 class="wds-section-name">ชุดกิจกรรมที่จะทำ</h3>'+
  '<div class="wds-card">'+(items.length?items.map((x,i)=>
     '<div class="wds-planitem"><div class="wds-planicon">'+iconOf(x)+'</div><div><strong>'+(i+1)+'. '+esc(meta[x.id].name)+'</strong>'+
     '<small>'+x.minutes+' นาที · '+(meta[x.id].clip?'มีคลิปสาธิต':'มีคำอธิบายประกอบ')+'</small></div><div class="wds-mins">~'+number(burn({...x,actualMinutes:x.minutes}).gross)+' kcal</div></div>'
   ).join(''):'<p style="font-size:12px;color:#617264;line-height:1.6">วันนี้ไม่เหลือกิจกรรมที่รอบนี้ต้องบันทึกแล้ว กลับไปเลือกกิจกรรมเพิ่มได้</p>')+'</div>'+
  '<div class="wds-tip">💡 <b>วิธีใช้:</b> กดเริ่ม → ดูตัวอย่างการเคลื่อนไหวทีละท่า → เลือกทำเสร็จหรือข้าม → ตรวจเวลาจริง → ยืนยันบันทึกครั้งเดียว</div>'+
  (logged?'<div class="wds-tip">วันนี้มีบันทึก Workout อยู่แล้ว '+logged+' รายการ ระบบจะไม่บันทึกกิจกรรมที่ผูกกับแผนเดิมซ้ำ</div>':'');
}
function videoFor(x){
 const m=meta[x.id];
 if(!m.clip)return '<div class="wds-media"><div class="wds-static-media" role="img" aria-label="ไอคอนประกอบกิจกรรม">'+esc(m.emoji)+'</div></div>'+
 '<div class="wds-media-note">กิจกรรมนี้ยังไม่มีคลิปเฉพาะในเดโม ดูแนวทางทำกิจกรรมด้านล่าง</div>';
 const asset='assets/workouts/'+m.clip;
 return '<div class="wds-media"><video id="wdsVideo" playsinline muted loop preload="metadata" poster="'+asset+'_poster.png" aria-label="ภาพเคลื่อนไหวประกอบ '+esc(m.name)+'">'+
    '<source src="'+asset+'.mp4" type="video/mp4"><source src="'+asset+'.webm" type="video/webm"></video>'+
    '<button type="button" class="wds-video-control" data-wds-action="toggle-video">▶ เล่น</button></div>'+
    '<div class="wds-media-note">ภาพเคลื่อนไหวประกอบการเข้าใจท่า ไม่ใช่การตรวจฟอร์มหรือรับประกันความปลอดภัย</div>';
}

function activeHtml(s){
 const x=s.items[s.cursor],m=meta[x.id];
 if(!x||!m)return '<div class="wds-tip warn">ไม่พบกิจกรรมนี้ กลับไปหน้าแผนแล้วเริ่มใหม่ได้</div>';
 const progress=Math.round(s.cursor/s.items.length*100);
 const next=s.items[s.cursor+1];
 return '<div class="wds-kicker">MOVE '+(s.cursor+1)+' OF '+s.items.length+'</div>'+
    '<div class="wds-bar" role="progressbar" aria-label="ความคืบหน้าแผน" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+progress+'"><span style="width:'+progress+'%"></span></div>'+
    '<div class="wds-active-name">'+esc(m.name)+'</div>'+
    '<div class="wds-activity-sub">ตามแผน '+x.minutes+' นาที · '+(m.clip?'มีคลิปภาพเคลื่อนไหว':'แสดงวิธีทำเป็นข้อความ')+'</div>'+
    videoFor(x)+
    '<div class="wds-card"><div class="wds-time-row"><span class="wds-time-label">เวลาที่ทำจริง</span><span class="wds-timehint">ปรับก่อนกดเสร็จ</span></div>'+
    '<div class="wds-adjust"><button type="button" data-wds-action="minus" aria-label="ลดเวลา 5 นาที">−</button>'+
    '<input id="wdsActualMinutes" inputmode="numeric" type="number" min="1" max="180" step="1" value="'+x.actualMinutes+'" aria-label="เวลาที่ทำจริงหน่วยนาที">'+
    '<button type="button" data-wds-action="plus" aria-label="เพิ่มเวลา 5 นาที">+</button></div>'+
    '<div style="text-align:center;font-size:10px;color:#738678">ถ้าทำไม่ครบให้ใส่เวลาที่ทำจริง ไม่ต้องฝืนทำต่อเพื่อให้ครบตัวเลข</div></div>'+
    '<div class="wds-card"><div class="wds-kicker">HOW TO MOVE</div><p style="font-size:12px;line-height:1.65;color:#57705f;margin:8px 0 0">'+esc(m.guide)+'</p></div>'+
    (next?'<div class="wds-next">ถัดไป: '+esc(meta[next.id]?.name||'กิจกรรมต่อไป')+'</div>':'<div class="wds-next">กิจกรรมสุดท้ายแล้ว · เมื่อกดเสร็จจะเข้าสู่หน้าสรุป</div>')+
    '<div class="wds-tip warn">หยุดเมื่อเวียนหัว เจ็บหน้าอก หายใจผิดปกติ หรือปวดผิดปกติ และรับการประเมินที่เหมาะสม ไม่จำเป็นต้องฝืนทำให้ครบแผน</div>';
}
function completedItems(s){return s.items.filter(x=>x.status==='done'&&Number(x.actualMinutes)>0);}
function summaryStats(s){
 const done=completedItems(s),secs=done.reduce((a,x)=>a+Number(x.actualMinutes),0),k=done.reduce((a,x)=>a+burn(x).gross,0);
 return {done:done.length,skipped:s.items.filter(x=>x.status==='skipped').length,minutes:secs,kcal:k};
}
function summaryHtml(s){
 const totals=summaryStats(s);
 return '<div class="wds-hero"><div class="wds-kicker">WORKOUT REVIEW</div><h2>เช็กที่ทำจริง ก่อนบันทึก</h2><p>รายการที่ข้ามจะไม่ถูกนับ และสามารถกลับไปแก้เวลาของแต่ละกิจกรรมได้</p></div>'+
  '<div class="wds-summary-card"><div><strong>'+totals.done+'/'+s.items.length+'</strong><span>กิจกรรมที่ทำ</span></div>'+
   '<div><strong>'+totals.minutes+'</strong><span>นาทีที่ทำจริง</span></div>'+
   '<div><strong>~'+number(totals.kcal)+'</strong><span>kcal ประมาณ</span></div></div>'+
  '<h3 class="wds-section-name">รายการ Workout ของคุณ</h3>'+
  '<div class="wds-card">'+s.items.map((x,i)=>{
    const done=x.status==='done';
    return '<div class="wds-planitem"><div class="wds-planicon">'+iconOf(x)+'</div><div><strong>'+esc(meta[x.id]?.name||'กิจกรรม')+'</strong>'+
    '<small>'+(done?x.actualMinutes+' นาทีจริง · ~'+number(burn(x).gross)+' kcal':x.status==='skipped'?'ข้ามกิจกรรมนี้':'ยังไม่ได้ยืนยัน')+'</small></div>'+
    '<div><span class="wds-badge '+(done?'':'skip')+'">'+(done?'✓ ทำแล้ว':x.status==='skipped'?'ข้าม':'ยังไม่ทำ')+'</span><br>'+
    '<button type="button" class="wds-edit-link" data-wds-action="edit" data-wds-index="'+i+'" style="margin-top:5px">แก้ไข</button></div></div>';
  }).join('')+'</div>'+
  '<div class="wds-tip">📋 เมื่อกด <b>ยืนยันบันทึก</b> ระบบจะนับเฉพาะกิจกรรมที่ทำจริงเข้าสู่ Today และ Progress ไม่เพิ่มงบอาหารอัตโนมัติ แคลอรีเป็นค่าประมาณจากน้ำหนักและเวลา</div>'+
  (totals.done?'':'<div class="wds-tip warn">ยังไม่มีกิจกรรมที่ยืนยันว่าทำจริง กรุณากลับไปแก้ไขก่อนบันทึก</div>');
}
function savedHtml(){
 const d=savedResults||{done:0,minutes:0,kcal:0};
 return '<div class="wds-hero"><div class="wds-kicker">WORKOUT SAVED</div><h2>บันทึก Workout แล้ว ✓</h2><p>ข้อมูลที่ทำจริงถูกส่งไปยัง Today และ Progress เรียบร้อย</p></div>'+
  '<div class="wds-summary-card"><div><strong>'+d.done+'</strong><span>กิจกรรมที่บันทึก</span></div>'+
  '<div><strong>'+d.minutes+'</strong><span>นาทีทั้งหมด</span></div>'+
  '<div><strong>~'+number(d.kcal)+'</strong><span>kcal ประมาณ</span></div></div>'+
  '<div class="wds-tip">เยี่ยมที่ได้ขยับร่างกายตามความพร้อม ไม่จำเป็นต้องทำทุกท่าจึงถือว่าเป็นวันที่มีความก้าวหน้า</div>'+
  '<div class="wds-card" style="font-size:12px;line-height:1.6;color:#5c7262">วันนี้คุณบันทึกเฉพาะสิ่งที่ทำจริงแล้ว ระบบแสดงพลังงานกิจกรรมแยกจากเป้าพลังงานอาหาร เพื่อหลีกเลี่ยงการนับซ้ำในเดโมนี้</div>';
}
function draw(){
 pauseVideo();
 const d=currentDraft(),stage=savedResults?'saved':d?.stage||'preview';
 if(!d&&!savedResults){closeSession();return;}
 if(d&&(!d.items.length||d.cursor>=d.items.length))d.cursor=0;
 let main,buttons;
 if(stage==='preview'){
   main=previewHtml(d);
   buttons='<button class="wds-btn secondary" data-wds-action="close">เลือกกิจกรรมต่อ</button>'+
      '<button class="wds-btn primary" data-wds-action="start" '+(!d.items.length?'disabled':'')+'>▶ เริ่ม Workout</button>';
 }else if(stage==='active'){
   main=activeHtml(d);
   buttons='<button class="wds-btn secondary" data-wds-action="back">← ย้อนกลับ</button>'+
      '<button class="wds-btn soft" data-wds-action="skip">ข้าม</button>'+
      '<button class="wds-btn primary" data-wds-action="done">ทำเสร็จแล้ว ✓</button>';
 }else if(stage==='summary'){
   main=summaryHtml(d);
   buttons='<button class="wds-btn secondary" data-wds-action="editfirst">กลับไปแก้</button>'+
      '<button class="wds-btn primary" data-wds-action="save" '+(!summaryStats(d).done?'disabled':'')+'>✓ ยืนยันบันทึก Workout</button>';
 }else{
   main=savedHtml();
   buttons='<button class="wds-btn secondary" data-wds-action="today">ดู Today</button>'+
      '<button class="wds-btn primary" data-wds-action="progress">ดู Progress →</button>';
 }
 let title=stage==='preview'?'Workout Plan':stage==='active'?'กำลังออกกำลังกาย':stage==='summary'?'Workout Summary':'Workout Complete';
 let subtitle=stage==='active'?'ทำทีละท่า · บันทึกเวลาจริง':stage==='summary'?'ตรวจรายการก่อนยืนยัน':'Personalized Workout Session';
 screen.innerHTML='<header class="wds-top"><button class="wds-back" type="button" data-wds-action="close" aria-label="กลับหน้า Workout">‹</button>'+
  '<div class="wds-heading"><strong>'+title+'</strong><small>'+subtitle+'</small></div>'+
  '<button class="wds-close" type="button" data-wds-action="close" aria-label="ปิด Workout Session">×</button></header>'+
  '<main class="wds-content" id="wdsScroll">'+main+'</main>'+
  '<footer class="wds-footer">'+buttons+'</footer>';
 const box=screen.querySelector('#wdsScroll');if(box)box.scrollTop=0;
 if(stage==='active'){
   const video=screen.querySelector('#wdsVideo');
   if(video&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
     video.play().then(updateVideoButton).catch(updateVideoButton);
   }else updateVideoButton();
 }
}
function updateVideoButton(){
 const video=screen.querySelector('#wdsVideo'),button=screen.querySelector('[data-wds-action="toggle-video"]');
 if(button&&video){button.textContent=video.paused?'▶ เล่นคลิป':'⏸ หยุดคลิป';button.setAttribute('aria-pressed',String(!video.paused));}
}
function start(){
 const d=currentDraft();if(!d||!d.items.length||risky())return;
 d.stage='active';d.cursor=0;d.editing=false;persist();draw();
}
function readMinute(){
 const el=screen.querySelector('#wdsActualMinutes');
 if(!el)return null;
 const num=Number(el.value);
 if(!Number.isInteger(num)||num<1||num>180){toast('ระบุเวลาที่ทำจริง 1–180 นาที หรือกดข้าม');el.focus();return null;}
 return num;
}
function finishMove(status){
 const d=currentDraft();if(!d||d.stage!=='active'||risky())return;
 const item=d.items[d.cursor];if(!item)return;
 if(status==='done'){const actual=readMinute();if(actual===null)return;item.actualMinutes=actual;item.status='done';}
 if(status==='skipped'){item.actualMinutes=0;item.status='skipped';}
 if(d.editing){d.stage='summary';d.editing=false;}
 else if(d.cursor<d.items.length-1){d.cursor+=1;}
 else{d.stage='summary';}
 persist();draw();
}
function stepBack(){
 const d=currentDraft();if(!d||d.stage!=='active')return;
 if(d.editing){d.stage='summary';d.editing=false;}
 else if(d.cursor>0){d.cursor--;}
 else {d.stage='preview';}
 persist();draw();
}
function editMove(index,fromSummary=true){
 const d=currentDraft();if(!d||!d.items[index])return;
 d.cursor=index;d.stage='active';d.editing=fromSummary;persist();draw();
}
function saveSession(){
 const d=currentDraft();if(!d||d.stage!=='summary'||risky())return;
 const done=completedItems(d);if(!done.length){toast('ยังไม่ได้ยืนยันว่าทำกิจกรรมใดจริง');return;}
 const existing=new Set(dayLogs().map(x=>x.planId).filter(Boolean));
 let logged=0,totalMinutes=0,totalBurn=0;
 done.forEach(x=>{
  if(existing.has(x.planId))return;
  const result=burn(x),m=meta[x.id];
  state.workoutLogs.push({
   logId:'wds_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),
   planId:x.planId,day:localDay(),id:x.id,minutes:x.actualMinutes,variant:x.variant,
   incline:x.incline,sets:x.sets,reps:x.reps,met:result.met,gross:result.gross,extra:result.extra,
   intensityLabel:'Guided Workout Session',loggedAt:new Date().toISOString(),source:'guided_v16'
  });
  existing.add(x.planId);logged++;totalMinutes+=x.actualMinutes;totalBurn+=result.gross;
 });
 if(!logged){toast('กิจกรรมทั้งหมดถูกบันทึกไว้แล้ว');return;}
 savedResults={done:logged,minutes:totalMinutes,kcal:totalBurn};
 state.workoutSessionDraft=null;
 persist();
 if(typeof render==='function')render();
 draw();
 updateStartButton();
}

function updateStartButton(){
 const btn=root.querySelector('#wdsResumeBtn');if(!btn)return;
 const draft=currentDraft(),today=dayPlans(),logged=new Set(dayLogs().map(x=>x.planId));
 const hasUnlogged=today.some(p=>!logged.has(p.planId));
 const shouldShow=Boolean(draft)||hasUnlogged;
 btn.classList.toggle('hidden',!shouldShow);
 btn.textContent=draft?(draft.stage==='preview'?'▶ ดูแผน Workout ที่เลือก':'▶ กลับมาทำ Workout ต่อ'):'▶ เริ่ม Workout จากแผนที่เลือก';
}
function selectSuggested(){
 if(risky())return;
 savedResults=null;
 openSession('recommended');
}
function selectManual(){
 if(risky())return;
 savedResults=null;
 openSession('all');
}
const planElement=root.querySelector('#wdPlan');
if(planElement){
 const btn=document.createElement('button');
 btn.id='wdsResumeBtn';btn.type='button';btn.className='hidden';
 planElement.insertAdjacentElement('afterend',btn);
 btn.addEventListener('click',selectManual);
 new MutationObserver(updateStartButton).observe(planElement,{childList:true});
 updateStartButton();
}
root.addEventListener('click',e=>{
 const button=e.target.closest('[data-wd-act="suggest"]');
 if(button&&!button.disabled){
   // V14 handles the first part of the click and writes the plan;
   // this later bubbling listener opens the session on the same click.
   selectSuggested();
 }
});
screen.addEventListener('click',e=>{
 const btn=e.target.closest('[data-wds-action]');if(!btn)return;
 const action=btn.getAttribute('data-wds-action');
 switch(action){
  case 'close':closeSession();break;
  case 'continueold':pendingSwitch=null;draw();break;
  case 'switchnew':chooseNewPlan();break;
  case 'start':start();break;
  case 'minus':case 'plus':{
   const field=screen.querySelector('#wdsActualMinutes');
   if(field)field.value=Math.max(1,Math.min(180,(Number(field.value)||1)+(action==='plus'?5:-5)));
   break;
  }
  case 'toggle-video':{
   const video=screen.querySelector('#wdsVideo');
   if(video){if(video.paused)video.play().then(updateVideoButton).catch(updateVideoButton);else{video.pause();updateVideoButton();}}
   break;
  }
  case 'done':finishMove('done');break;
  case 'skip':finishMove('skipped');break;
  case 'back':stepBack();break;
  case 'edit':editMove(Number(btn.getAttribute('data-wds-index')),true);break;
  case 'editfirst':editMove(0,true);break;
  case 'save':saveSession();break;
  case 'today':
   closeSession();savedResults=null;if(typeof go==='function')go('today');break;
  case 'progress':
   closeSession();savedResults=null;if(typeof go==='function')go('progress');break;
 }
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!screen.classList.contains('hidden'))closeSession();
});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)pauseVideo();
});
if(state.workoutSessionDraft&&state.workoutSessionDraft.day!==localDay()){
 state.workoutSessionDraft=null;persist();
}
})();
