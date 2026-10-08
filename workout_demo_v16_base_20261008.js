/* Workout Demo V14 – isolated enhancement over the existing V13+ prototype.
   No AI API, no network calls, no user health data transmission.
   MET estimates: 2024 Adult Compendium; incline walking: ACSM equation.
   Readable reference links: https://pacompendium.com/adult-compendium/
*/
(function () {
  "use strict";
  const WD_CAT = [
    {id:"g_walk",where:"gym",emoji:"🚶",name:"เดินลู่ทางราบ",type:"cardio",gear:"machine",minutes:20,guide:"เดินตามความเร็วที่ควบคุมได้ ยืนหลังตรง ใช้ราวจับเท่าที่จำเป็น",variants:[["ช้า · 3.2–3.9 กม./ชม.",3.0,"light"],["สบาย · 4.0–4.7 กม./ชม.",3.5,"moderate"],["เร็ว · 4.8–5.5 กม./ชม.",3.8,"moderate"],["เร็วมาก · 5.6–6.3 กม./ชม.",4.8,"moderate"]]},
    {id:"g_incline",where:"gym",emoji:"⛰️",name:"เดินลู่ชัน",type:"cardio",gear:"machine",minutes:20,guide:"ปรับความชันอย่างค่อยเป็นค่อยไป ไม่ฝืนเมื่อหน้ามืดหรือเสียการทรงตัว",incline:true,variants:[["3.2 กม./ชม.",0,"light",3.2],["4.0 กม./ชม.",0,"moderate",4.0],["4.8 กม./ชม.",0,"moderate",4.8]]},
    {id:"g_run",where:"gym",emoji:"🏃",name:"จ็อกกิ้ง / วิ่งลู่",type:"cardio",gear:"machine",minutes:20,guide:"เพิ่มความเร็วเฉพาะเมื่อพร้อมและไม่มีอาการผิดปกติ หลีกเลี่ยงการเร่งเพื่อแข่งตัวเลข",variants:[["จ็อกกิ้งเบา · 7–8 กม./ชม.",6.8,"vigorous"],["วิ่งสม่ำเสมอ · 8–9 กม./ชม.",8.3,"vigorous"]]},
    {id:"g_bike",where:"gym",emoji:"🚴",name:"จักรยานฟิตเนส",type:"cardio",gear:"machine",minutes:20,guide:"ตั้งเบาะให้เหมาะกับช่วงขา ปรับแรงต้านให้ปั่นได้ต่อเนื่อง",variants:[["เบา · 25–30 วัตต์",3.5,"light"],["เบา · 50 วัตต์",4.0,"moderate"],["กลาง · 60 วัตต์",5.0,"moderate"],["ค่อนข้างหนัก · 90–100 วัตต์",6.0,"vigorous"]]},
    {id:"g_ellip",where:"gym",emoji:"🏃",name:"Elliptical",type:"cardio",gear:"machine",minutes:20,guide:"ใช้เครื่องตามคำแนะนำของผู้ผลิต คุมจังหวะและการทรงตัว",variants:[["ปานกลาง",5.0,"moderate"],["หนัก",9.0,"vigorous"]]},
    {id:"g_row",where:"gym",emoji:"🚣",name:"เครื่องกรรเชียงบก",type:"cardio",gear:"machine",minutes:15,guide:"เริ่มจากเรียนรู้จังหวะขา-ลำตัว-แขนก่อนเร่งความหนัก",variants:[["ปานกลาง · ต่ำกว่า 100 วัตต์",5.0,"moderate"],["หนัก · ระดับทั่วไป",7.3,"vigorous"]]},
    {id:"g_weights",where:"gym",emoji:"🏋️",name:"เวทเครื่อง / ดัมเบล",type:"strength",gear:"dumbbell",minutes:20,guide:"เลือกแรงต้านที่ควบคุมท่าได้ พักระหว่างเซตตามความจำเป็น พลังงานคำนวณจากเวลารวม",variants:[["หลายท่าทั่วไป",3.5,"moderate"],["เวทแรงต้านเข้มข้น",6.0,"vigorous"]]},
    {id:"h_walk",where:"home",emoji:"🚶",name:"เดินภายในบ้าน",type:"cardio",gear:"none",minutes:15,guide:"เดินในพื้นที่โล่ง ไม่มีสิ่งกีดขวางและพื้นลื่น",variants:[["เดินสบายในบ้าน",2.3,"light"]]},
    {id:"h_chair",where:"home",emoji:"🪑",name:"ลุกนั่งจากเก้าอี้",type:"strength",gear:"none",minutes:10,guide:"เลือกเก้าอี้มั่นคง ไม่ลื่น เริ่มจำนวนครั้งที่ควบคุมได้ ไม่ฝืนเข่าหรือหลัง",variants:[["ช้า · 6–12 ครั้ง/นาทีช่วงทำจริง",2.8,"light"]]},
    {id:"h_wall",where:"home",emoji:"🤲",name:"Wall Push-up",type:"strength",gear:"none",minutes:10,guide:"ดันกำแพงด้วยแนวลำตัวมั่นคง หากปวดไหล่หรือข้อมือให้หยุด",variants:[["ท่าเบา · ประมาณจากกลุ่ม Calisthenics",2.8,"light"]]},
    {id:"h_bridge",where:"home",emoji:"🧘",name:"Glute Bridge / Core เบา",type:"strength",gear:"none",minutes:10,guide:"เคลื่อนไหวช้าและคุมหลังตามความสามารถ ไม่ใช้แทนคำแนะนำรักษาอาการปวด",variants:[["แกนกลางระดับเบา · ค่าอ้างอิงกลุ่มท่า",2.8,"light"]]},
    {id:"h_body",where:"home",emoji:"💪",name:"Bodyweight Full Body",type:"strength",gear:"none",minutes:20,guide:"สลับท่าพื้นฐาน เช่น squat แบบพอดีตัว wall push-up และท่าแกนกลาง เลือกพักได้",variants:[["หลายท่าทั่วไป",3.0,"moderate"],["Circuit ต่อเนื่อง",6.0,"vigorous"]]},
    {id:"h_cardio",where:"home",emoji:"🎵",name:"Home Cardio ไม่กระโดด",type:"cardio",gear:"none",minutes:15,guide:"เดินย่ำอยู่กับที่และก้าวข้างสลับกัน หยุดหากเวียนศีรษะหรือเสียการทรงตัว",variants:[["ทั่วไป · ค่ากลุ่ม Home Exercise",3.8,"moderate"]]},
    {id:"h_yoga",where:"home",emoji:"🧘",name:"Yoga เบื้องต้น",type:"mobility",gear:"none",minutes:15,guide:"ทำตามช่วงการเคลื่อนไหวที่สบาย ไม่กดฝืนข้อหรือกลั้นหายใจ",variants:[["Hatha / ทั่วไป",2.3,"light"]]},
    {id:"a_stroll",where:"anywhere",emoji:"🌳",name:"เดินเล่นสบาย ๆ",type:"cardio",gear:"none",minutes:20,guide:"เดินบนพื้นสม่ำเสมอในความเร็วสบาย",variants:[["ช้า · ประมาณ 3.2–3.9 กม./ชม.",2.8,"light"]]},
    {id:"a_brisk",where:"anywhere",emoji:"👟",name:"เดินเร็ว",type:"cardio",gear:"none",minutes:20,guide:"เร่งจังหวะที่ยังพูดเป็นประโยคได้ เลือกพื้นที่ปลอดภัย",variants:[["เดินปานกลาง · 4.5–5.5 กม./ชม.",3.8,"moderate"],["เดินเร็ว · 5.6–6.3 กม./ชม.",4.8,"moderate"]]},
    {id:"a_stairs",where:"anywhere",emoji:"🪜",name:"ขึ้นบันไดช้า ๆ",type:"cardio",gear:"none",minutes:10,guide:"ใช้ราวจับเมื่อจำเป็น ห้ามทำหากมีปัญหาการทรงตัวหรืออาการผิดปกติ",variants:[["ขึ้นบันไดช้า",4.5,"moderate"]]},
    {id:"a_stretch",where:"anywhere",emoji:"🙆",name:"ยืดเหยียดช่วงพักงาน",type:"mobility",gear:"none",minutes:10,guide:"ขยับคอ ไหล่ หลัง และขาอย่างนุ่มนวล ไม่ฝืนจุดที่เจ็บ",variants:[["ยืดเหยียดเบา",2.3,"light"]]}
  ];
  const WD_LABELS={gym:"🏋️ ฟิตเนส",home:"🏠 ที่บ้าน",anywhere:"🚶 ทุกที่",cardio:"Cardio",strength:"Strength",mobility:"Mobility",light:"เบา",moderate:"ปานกลาง",vigorous:"หนัก",none:"ไม่ใช้อุปกรณ์",machine:"เครื่องฟิตเนส",dumbbell:"ดัมเบล/เครื่องเวท"};
  const wdUI={where:"gym",type:"all",intensity:"all",maxMinutes:0,gear:"all",selected:null,mode:"plan",planId:null,variant:0,minutes:20,incline:3,sets:3,reps:12};
  const wdRoot=document.getElementById("workoutPage");
  if (!wdRoot || typeof state==="undefined") return;
  if (!Array.isArray(state.workoutPlans)) state.workoutPlans=[];
  if (!Array.isArray(state.workoutLogs)) state.workoutLogs=[];
  function wdDay(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function wdTodayPlans(){return state.workoutPlans.filter(function(x){return x.day===wdDay();});}
  function wdTodayLogs(){return state.workoutLogs.filter(function(x){return x.day===wdDay();});}
  function wdActivity(id){return WD_CAT.find(function(a){return a.id===id;});}
  function wdEscape(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function wdWeight(){return Math.min(350,Math.max(35,Number(state.weight)||80));}
  function wdRisk(){var a=state.assessment||{};return (a.warningSymptom && a.warningSymptom!=="none") || (a.healthCondition && a.healthCondition!=="none");}
  function wdLevel(){var f=String((state.assessment||{}).fitnessLevel||"");return f.includes("เริ่มต้น")?"light":f.includes("ค่อนข้างฟิต")?"vigorous":"moderate";}
  function wdPlace(){var x=String((state.assessment||{}).workoutPlace||"");if(x.includes("ฟิตเนส"))return "gym";if(x.includes("นอกบ้าน")||x.includes("เดิน/วิ่ง"))return "anywhere";if(x.includes("บ้าน"))return "home";return "anywhere";}
  function wdAvailable(){var x=String((state.assessment||{}).workoutTime||"");var m=x.match(/\d+/);return m?Math.max(10,Number(m[0])):30;}
  function wdMet(a,v,incline){var opt=a.variants[Math.max(0,Math.min(a.variants.length-1,v||0))];if(!a.incline)return opt[1];var speedKmH=opt[3]||4;var metresPerMin=speedKmH*1000/60;var grade=Math.max(0,Math.min(10,Number(incline)||0))/100;return (0.1*metresPerMin+1.8*metresPerMin*grade+3.5)/3.5;}
  function wdCalories(a,minutes,variant,incline){
    var met=wdMet(a,variant,incline),hours=Math.max(0,Number(minutes)||0)/60,kg=wdWeight();
    return {met:met,gross:Math.round(met*kg*hours),extra:Math.round(Math.max(0,met-1)*kg*hours)};
  }
  function wdFormat(n){return (Number(n)||0).toLocaleString("th-TH");}
  function wdSuggested(){
    var area=wdPlace(),max=wdAvailable(),level=wdLevel(),base=area==="gym"?[["g_walk",0.62],["g_weights",0.38]]:area==="home"?[["h_walk",0.45],["h_chair",0.28],["h_yoga",0.27]]:[["a_brisk",0.70],["a_stretch",0.30]];
    var blocks=Math.max(1,Math.floor(max/5)),selected=base.slice(0,Math.min(blocks,base.length));
    var durations=selected.map(function(){return 5;});
    for(var n=selected.length;n<blocks;n++)durations[(n-selected.length)%selected.length]+=5;
    return selected.map(function(item,i){var a=wdActivity(item[0]),matched=a.variants.findIndex(function(v){return v[2]===level;}),variant=matched>=0?matched:0;
      return {id:a.id,minutes:durations[i],variant:variant,incline:3};
    });
  }
  function wdSuggestedSum(){var p=wdSuggested();return {mins:p.reduce(function(s,x){return s+x.minutes;},0),gross:p.reduce(function(s,x){return s+wdCalories(wdActivity(x.id),x.minutes,x.variant,x.incline).gross;},0)};}
  function wdNextId(){return "wd_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7);}
  function wdPersist(){state.workout=wdTodayLogs().length>0;persistState();}

  function wdBuildUI(){
    wdRoot.innerHTML=[
      '<div class="wd-shell">',
        '<div class="page-title"><h2>Workout 💪</h2><p>เลือกกิจกรรมที่เข้ากับเวลา สถานที่ และความพร้อมของคุณ</p></div>',
        '<div id="wdSafety"></div>',
        '<div id="wdHero" class="wd-hero"></div>',
        '<div class="wd-titlebar"><h3>แผนที่เลือกวันนี้</h3><small id="wdPlanSum">ยังไม่เลือก</small></div>',
        '<div id="wdPlan" class="card" style="margin-bottom:14px"></div>',
        '<div class="wd-titlebar"><h3>เลือกสถานที่</h3><small>18 กิจกรรม</small></div>',
        '<div class="wd-place-tabs">',
          '<button type="button" data-wd-act="place" data-wd-val="gym"><span class="wd-emoji">🏋️</span>ฟิตเนส</button>',
          '<button type="button" data-wd-act="place" data-wd-val="home"><span class="wd-emoji">🏠</span>ที่บ้าน</button>',
          '<button type="button" data-wd-act="place" data-wd-val="anywhere"><span class="wd-emoji">🚶</span>ทุกที่</button>',
        '</div>',
        '<div class="wd-titlebar"><h3>กรองกิจกรรม</h3><small>เลือกให้ตรงชีวิตจริง</small></div>',
        '<div class="wd-chips" id="wdTypeChips">',
          '<button data-wd-act="type" data-wd-val="all">ทั้งหมด</button>',
          '<button data-wd-act="type" data-wd-val="cardio">Cardio</button>',
          '<button data-wd-act="type" data-wd-val="strength">Strength</button>',
          '<button data-wd-act="type" data-wd-val="mobility">Mobility</button>',
        '</div>',
        '<div class="wd-chips" id="wdIntensityChips">',
          '<button data-wd-act="intensity" data-wd-val="all">ทุกระดับ</button>',
          '<button data-wd-act="intensity" data-wd-val="light">เบา</button>',
          '<button data-wd-act="intensity" data-wd-val="moderate">ปานกลาง</button>',
          '<button data-wd-act="intensity" data-wd-val="vigorous">หนัก</button>',
        '</div>',
        '<div class="wd-filter-head" style="margin-bottom:10px">',
          '<select class="wd-select" id="wdTimeFilter" aria-label="ระยะเวลา"><option value="0">⏱ ทุกระยะเวลา</option><option value="15">ไม่เกิน 15 นาที</option><option value="30">ไม่เกิน 30 นาที</option><option value="45">ไม่เกิน 45 นาที</option></select>',
          '<select class="wd-select" id="wdGearFilter" aria-label="อุปกรณ์"><option value="all">⚙️ ทุกอุปกรณ์</option><option value="none">ไม่ใช้อุปกรณ์</option><option value="machine">เครื่องฟิตเนส</option><option value="dumbbell">ดัมเบล / เวท</option></select>',
        '</div>',
        '<div class="wd-titlebar"><h3>เลือกกิจกรรม</h3><small id="wdResultCount"></small></div>',
        '<div id="wdCatalog"></div>',
        '<div class="wd-titlebar"><h3>บันทึกที่ทำจริงวันนี้</h3><small id="wdActualSummary">0 รายการ</small></div>',
        '<div id="wdLogs" class="card"></div>',
        '<p class="wd-footer-note">Prototype · พลังงานเป็นค่าประมาณจาก 2024 Adult Compendium / สมการ ACSM สำหรับเดินชัน ไม่ใช่ค่าจากสมาร์ตวอตช์ และไม่เพิ่มงบอาหารอัตโนมัติ กิจกรรมบางท่าใช้ค่าทดแทนของกลุ่มท่า ควรปรับตามความพร้อมและหยุดหากมีอาการผิดปกติ</p>',
      '</div>'
    ].join("");
    var modal=document.createElement("div");
    modal.id="wdDetailModal"; modal.className="modal hidden wd-detail-modal";
    modal.innerHTML='<div class="sheet" id="wdDetailSheet"></div>';
    modal.addEventListener("click",function(e){if(e.target===modal)wdCloseDetail();});
    document.getElementById("app").appendChild(modal);
    wdUI.where=wdPlace();
    wdUI.placeInitialized=true;
  }
  function wdMatchedCatalog(){
    return WD_CAT.filter(function(a){
      if(a.where!==wdUI.where)return false;
      if(wdUI.type!=="all"&&a.type!==wdUI.type)return false;
      if(wdUI.intensity!=="all"&&!a.variants.some(function(v){return v[2]===wdUI.intensity;}))return false;
      if(wdUI.maxMinutes&&a.minutes>wdUI.maxMinutes)return false;
      if(wdUI.gear!=="all"&&a.gear!==wdUI.gear)return false;
      return true;
    });
  }
  function wdRecommendedVariant(a){
    var lvl=wdLevel();
    if(wdUI.intensity!=="all"){var exact=a.variants.findIndex(function(x){return x[2]===wdUI.intensity;});if(exact!==-1)return exact;}
    var idx=a.variants.findIndex(function(x){return x[2]===lvl;});
    return idx>=0?idx:0;
  }
  function wdRenderHero(){
    var sum=wdSuggestedSum(), rec=wdSuggested();
    var planDesc=rec.map(function(p){var a=wdActivity(p.id);return a.name+" "+p.minutes+" นาที";}).join(" + ");
    var risk=wdRisk();
    document.getElementById("wdSafety").innerHTML=risk?'<div class="wd-notice danger"><strong>⚠️ ต้องตรวจข้อจำกัดสุขภาพก่อน</strong><div>ข้อมูล Assessment ระบุภาวะหรืออาการที่อาจต้องประเมินก่อนออกกำลัง ระบบจึงไม่จัดแผนอัตโนมัติหรือบันทึกเพื่อเร่งเผาผลาญในเดโมนี้ หากมีหน้ามืด เจ็บหน้าอก หรือหายใจผิดปกติระหว่างออกแรง ให้หยุดและรับการประเมินจากบุคลากรสุขภาพ</div></div>':"";
    document.getElementById("wdHero").innerHTML=
      '<div class="wd-kicker">'+(risk?"WORKOUT SAFETY":"YOUR PERSONALIZED WORKOUT")+'</div>'+
      '<h3>'+(risk?"ตรวจความพร้อมก่อนเริ่ม":wdEscape(wdPlace()==="gym"?"ฟิตเนส: เดินลู่ + เวท":" "+(wdPlace()==="home"?"ที่บ้าน: เดิน + ท่าพื้นฐาน":"ทุกที่: เดิน + ยืดเหยียด")))+'</h3>'+
      '<p>'+(risk?"ยังไม่เสนอโปรแกรมเฉพาะบุคคลเมื่อข้อมูลมีสัญญาณต้องประเมิน":wdEscape(planDesc))+'</p>'+
      '<div class="wd-hero-metrics">'+
        '<div><b>'+wdFormat(wdWeight())+' กก.</b><span>น้ำหนักที่ใช้คำนวณ</span></div>'+
        '<div><b>'+(risk?"—":wdFormat(sum.mins)+" นาที")+'</b><span>เวลาแผนตัวอย่าง</span></div>'+
        '<div><b>'+(risk?"—":"~"+wdFormat(sum.gross))+'</b><span>kcal รวมโดยประมาณ</span></div>'+
      '</div>'+
      '<div style="margin-top:11px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">'+
        '<small style="color:#e4f9e9;font-size:10px">อ้างอิงสถานที่และเวลาใน Assessment</small>'+
        '<button class="wd-small-btn" data-wd-act="suggest" '+(risk?'disabled aria-disabled="true"':"")+'>+ เพิ่มแผนแนะนำ</button>'+
      '</div>';
  }
  function wdRenderPlans(){
    var plans=wdTodayPlans(),logs=wdTodayLogs(),sum=plans.reduce(function(s,p){return s+(Number(p.minutes)||0);},0);
    document.getElementById("wdPlanSum").textContent=plans.length+" กิจกรรม · "+sum+" นาที";
    if(!plans.length){
      document.getElementById("wdPlan").innerHTML='<div class="wd-plan-empty">ยังไม่มีแผนที่เลือก 👇 เลือกกิจกรรมด้านล่าง หรือกด “เพิ่มแผนแนะนำ” เพื่อทดลองระบบ Personalized Workout</div>';
      return;
    }
    document.getElementById("wdPlan").innerHTML=plans.map(function(p){
      var a=wdActivity(p.id);if(!a)return "";
      var c=wdCalories(a,p.minutes,p.variant,p.incline),done=logs.some(function(x){return x.planId===p.planId;});
      return '<div class="wd-plan-row"><div><b>'+a.emoji+' '+wdEscape(a.name)+'</b><p>'+p.minutes+' นาที · ~'+wdFormat(c.gross)+' kcal (รวม)'+(done?' · บันทึกแล้ว ✓':'')+'</p></div>'+
        '<div class="wd-plan-actions">'+
          (done?'<span class="wd-done">ทำแล้ว ✓</span>':'<button class="wd-small-btn" data-wd-act="logplan" data-wd-id="'+p.planId+'">บันทึกจริง</button>')+
          '<button class="wd-small-btn remove" data-wd-act="removeplan" data-wd-id="'+p.planId+'">ลบ</button>'+
        '</div></div>';
    }).join("");
  }
  function wdRenderCatalog(){
    var list=wdMatchedCatalog();
    document.getElementById("wdResultCount").textContent=list.length+" กิจกรรม";
    document.getElementById("wdCatalog").innerHTML=list.length?list.map(function(a){
      var variant=wdRecommendedVariant(a),k=wdCalories(a,a.minutes,variant,3);
      return '<div class="wd-activity-card">'+
        '<div class="wd-activity-icon">'+a.emoji+'</div>'+
        '<div><div class="wd-activity-name">'+wdEscape(a.name)+'</div><div class="wd-activity-description">'+wdEscape(WD_LABELS[a.type])+' · '+wdEscape(WD_LABELS[a.gear])+'</div>'+
        '<div class="wd-pills"><span class="wd-pill">'+wdEscape(WD_LABELS[a.variants[variant][2]])+'</span><span class="wd-pill">'+a.minutes+' นาที</span></div></div>'+
        '<div class="wd-card-side"><strong>~'+wdFormat(k.gross)+'</strong><small>kcal ประมาณ</small><button type="button" data-wd-act="detail" data-wd-id="'+a.id+'">เลือก ›</button></div>'+
        '</div>';
    }).join(""):'<div class="wd-zero">ไม่พบกิจกรรมตรงตัวกรองนี้ ลองปรับเงื่อนไขใหม่</div>';
    Array.prototype.forEach.call(wdRoot.querySelectorAll("[data-wd-act='place'],[data-wd-act='type'],[data-wd-act='intensity']"),function(b){
      var name=b.getAttribute("data-wd-act"),selected=name==="place"?wdUI.where:name==="type"?wdUI.type:wdUI.intensity;
      b.classList.toggle("active",b.getAttribute("data-wd-val")===selected);
      b.setAttribute("aria-pressed",String(b.classList.contains("active")));
    });
    document.getElementById("wdTimeFilter").value=String(wdUI.maxMinutes);
    document.getElementById("wdGearFilter").value=wdUI.gear;
  }
  function wdRenderLogs(){
    var logs=wdTodayLogs(),tot=logs.reduce(function(s,x){return s+(x.gross||0);},0),minutes=logs.reduce(function(s,x){return s+(x.minutes||0);},0);
    document.getElementById("wdActualSummary").textContent=minutes+" นาที · ~"+wdFormat(tot)+" kcal";
    document.getElementById("wdLogs").innerHTML=logs.length?logs.map(function(x){
      var a=wdActivity(x.id);if(!a)return "";
      return '<div class="wd-record"><div><b>'+a.emoji+' '+wdEscape(a.name)+'</b>'+
        '<small>'+x.minutes+' นาที · '+wdEscape(x.intensityLabel||"")+' · ~'+wdFormat(x.gross)+' kcal</small></div>'+
        '<button class="wd-small-btn remove" data-wd-act="removelog" data-wd-id="'+x.logId+'">ลบบันทึก</button></div>';
    }).join(""):'<div class="wd-zero">ยังไม่บันทึกกิจกรรมจริงวันนี้</div>';
  }
  function wdRender(){
    if(!document.getElementById("wdHero"))return;
    wdRenderHero();wdRenderPlans();wdRenderCatalog();wdRenderLogs();
  }

  function wdOpenDetail(id,mode,planId){
    var a=wdActivity(id);if(!a)return;
    var plan=planId?state.workoutPlans.find(function(x){return x.planId===planId;}):null;
    wdUI.selected=id;wdUI.mode=mode||"plan";wdUI.planId=plan?plan.planId:null;
    wdUI.variant=plan?plan.variant:wdRecommendedVariant(a);
    wdUI.minutes=plan?plan.minutes:a.minutes;wdUI.incline=plan?plan.incline:3;
    wdUI.sets=plan?plan.sets:3;wdUI.reps=plan?plan.reps:12;
    var variantOptions=a.variants.map(function(v,i){return '<option value="'+i+'" '+(i===wdUI.variant?"selected":"")+'>'+wdEscape(v[0])+' · '+wdEscape(WD_LABELS[v[2]])+'</option>';}).join("");
    var sheet=document.getElementById("wdDetailSheet");
    sheet.innerHTML=[
      '<div class="sheet-head"><h3>Workout Detail</h3><button class="x" data-wd-modal-act="close" aria-label="ปิด">✕</button></div>',
      '<div class="wd-kicker" style="margin-top:12px;color:#2d7a46">'+wdEscape(WD_LABELS[a.where])+' · '+wdEscape(WD_LABELS[a.type])+'</div>',
      '<div class="wd-detail-title">'+a.emoji+' '+wdEscape(a.name)+'</div>',
      '<p class="wd-detail-sub">ปรับเวลาและระดับกิจกรรม ระบบประมาณพลังงานให้ตามน้ำหนักที่ใช้ใน Assessment</p>',
      '<div class="wd-field"><label for="wdDetailMinutes">เวลา <b id="wdMinuteLabel">'+wdUI.minutes+'</b> นาที</label><input type="range" min="5" max="60" step="5" id="wdDetailMinutes" value="'+wdUI.minutes+'"><div class="wd-range-labels"><span>5 นาที</span><span>60 นาที</span></div></div>',
      '<div class="wd-field"><label for="wdDetailVariant">ระดับกิจกรรม</label><select id="wdDetailVariant">'+variantOptions+'</select></div>',
      a.incline?'<div class="wd-field"><label for="wdDetailIncline">ความชัน <b id="wdInclineLabel">'+wdUI.incline+'</b>%</label><input type="range" min="0" max="10" step="1" id="wdDetailIncline" value="'+wdUI.incline+'"><div class="wd-range-labels"><span>0%</span><span>10%</span></div></div>':"",
      a.type==="strength"?'<div class="wd-field"><label>จำนวนท่า / เซต (ใช้บันทึกประกอบ ไม่ใช้แทนเวลาในการคิด kcal)</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px"><input id="wdSets" type="number" min="1" max="10" step="1" value="'+wdUI.sets+'" aria-label="เซต"><input id="wdReps" type="number" min="1" max="40" step="1" value="'+wdUI.reps+'" aria-label="ครั้งต่อเซต"></div></div>':"",
      '<div class="wd-energy"><div style="font-size:11px;font-weight:800;color:#37754c">พลังงานรวมระหว่างกิจกรรม (ประมาณ)</div><div><strong id="wdGross">—</strong> kcal</div><div class="wd-net">ส่วนที่มากกว่าการพัก ~<b id="wdExtra">—</b> kcal · MET ~<b id="wdMet">—</b></div><p>ตัวเลขเป็นค่าประมาณ ไม่ใช่การวัดจากอุปกรณ์หรือการวินิจฉัย</p></div>',
      '<div class="wd-guide">📘 <b>แนวทางทำกิจกรรม:</b> '+wdEscape(a.guide)+'</div>',
      wdRisk()?'<div class="wd-notice danger">ยังไม่เปิดให้สร้างแผนหรือบันทึกในกรณีมีสัญญาณสุขภาพที่ต้องประเมินก่อน</div>':"",
      '<div class="wd-btnrow">'+
        '<button type="button" class="wd-secondary" data-wd-modal-act="plan" '+(wdRisk()?"disabled":"")+'>+ เพิ่มในแผน</button>'+
        '<button type="button" class="wd-primary" data-wd-modal-act="log" '+(wdRisk()?"disabled":"")+'>✓ บันทึกที่ทำจริง</button>'+
      '</div>',
      '<p style="font-size:10px;color:#748173;line-height:1.5">เลือกลงแผน ≠ ทำเสร็จ ต้องยืนยันเวลาที่ทำจริงก่อนจึงจะปรากฏใน Today และ Progress</p>'
    ].join("");
    document.getElementById("wdDetailModal").classList.remove("hidden");
    wdUpdateDetailNumbers();
  }
  function wdCloseDetail(){document.getElementById("wdDetailModal").classList.add("hidden");wdUI.selected=null;wdUI.planId=null;}
  function wdReadInputs(){
    var el=document.getElementById("wdDetailMinutes");if(el)wdUI.minutes=Math.max(5,Math.min(60,Number(el.value)||5));
    el=document.getElementById("wdDetailVariant");if(el)wdUI.variant=Number(el.value)||0;
    el=document.getElementById("wdDetailIncline");if(el)wdUI.incline=Math.max(0,Math.min(10,Number(el.value)||0));
    el=document.getElementById("wdSets");if(el)wdUI.sets=Math.max(1,Math.min(10,Number(el.value)||3));
    el=document.getElementById("wdReps");if(el)wdUI.reps=Math.max(1,Math.min(40,Number(el.value)||12));
  }
  function wdUpdateDetailNumbers(){
    wdReadInputs();var a=wdActivity(wdUI.selected);if(!a)return;
    var c=wdCalories(a,wdUI.minutes,wdUI.variant,wdUI.incline);
    document.getElementById("wdGross").textContent=wdFormat(c.gross);
    document.getElementById("wdExtra").textContent=wdFormat(c.extra);
    document.getElementById("wdMet").textContent=c.met.toFixed(1);
    document.getElementById("wdMinuteLabel").textContent=wdUI.minutes;
    var il=document.getElementById("wdInclineLabel");if(il)il.textContent=wdUI.incline;
  }
  function wdSavePlan(){
    if(wdRisk()){toast("กรุณาประเมินข้อจำกัดสุขภาพก่อน");return;}
    wdReadInputs();var a=wdActivity(wdUI.selected);if(!a)return;
    state.workoutPlans.push({planId:wdNextId(),day:wdDay(),id:a.id,minutes:wdUI.minutes,variant:wdUI.variant,incline:wdUI.incline,sets:wdUI.sets,reps:wdUI.reps});
    wdPersist();wdCloseDetail();render();toast("เพิ่ม "+a.name+" ในแผนวันนี้แล้ว");
  }
  function wdSaveLog(){
    if(wdRisk()){toast("กรุณาประเมินข้อจำกัดสุขภาพก่อน");return;}
    wdReadInputs();var a=wdActivity(wdUI.selected);if(!a)return;
    var c=wdCalories(a,wdUI.minutes,wdUI.variant,wdUI.incline);
    state.workoutLogs.push({
      logId:wdNextId(),planId:wdUI.planId||null,day:wdDay(),id:a.id,
      minutes:wdUI.minutes,variant:wdUI.variant,incline:wdUI.incline,
      sets:wdUI.sets,reps:wdUI.reps,met:c.met,gross:c.gross,extra:c.extra,
      intensityLabel:a.variants[wdUI.variant][0],loggedAt:new Date().toISOString()
    });
    wdPersist();wdCloseDetail();render();toast("บันทึก "+a.name+" "+wdUI.minutes+" นาทีแล้ว");
  }
  function wdAddSuggested(){
    if(wdRisk()){toast("ต้องตรวจข้อจำกัดสุขภาพก่อน");return;}
    var plans=wdTodayPlans(),added=0;
    wdSuggested().forEach(function(p){
      if(plans.some(function(x){return x.id===p.id;}))return;
      state.workoutPlans.push({planId:wdNextId(),day:wdDay(),id:p.id,minutes:p.minutes,variant:p.variant,incline:p.incline,sets:3,reps:12});
      added++;
    });
    wdPersist();render();toast(added?"เพิ่มแผนที่เข้ากับ Assessment แล้ว":"แผนนี้ถูกเพิ่มแล้ว");
  }
  function wdRemovePlan(planId){state.workoutPlans=state.workoutPlans.filter(function(x){return x.planId!==planId;});wdPersist();render();toast("ลบออกจากแผนแล้ว บันทึกที่ทำจริงยังอยู่");}
  function wdRemoveLog(logId){state.workoutLogs=state.workoutLogs.filter(function(x){return x.logId!==logId;});wdPersist();render();toast("ลบบันทึกกิจกรรมแล้ว");}
  wdBuildUI();
  wdRoot.addEventListener("click",function(e){
    var b=e.target.closest("[data-wd-act]");if(!b)return;
    var action=b.getAttribute("data-wd-act"),v=b.getAttribute("data-wd-val"),id=b.getAttribute("data-wd-id");
    if(action==="place"){wdUI.where=v;wdUI.type="all";wdUI.intensity="all";wdUI.gear="all";wdUI.maxMinutes=0;wdUI.placeManuallyChanged=true;}
    if(action==="type")wdUI.type=v;
    if(action==="intensity")wdUI.intensity=v;
    if(action==="detail"){wdOpenDetail(id,"plan");return;}
    if(action==="suggest"){wdAddSuggested();return;}
    if(action==="logplan"){var p=state.workoutPlans.find(function(x){return x.planId===id;});if(p)wdOpenDetail(p.id,"log",p.planId);return;}
    if(action==="removeplan"){wdRemovePlan(id);return;}
    if(action==="removelog"){wdRemoveLog(id);return;}
    wdRender();
  });
  wdRoot.addEventListener("change",function(e){
    if(e.target.id==="wdTimeFilter")wdUI.maxMinutes=Number(e.target.value)||0;
    if(e.target.id==="wdGearFilter")wdUI.gear=e.target.value;
    wdRender();
  });
  document.getElementById("wdDetailModal").addEventListener("input",function(e){if(e.target.matches("input,select"))wdUpdateDetailNumbers();});
  document.getElementById("wdDetailModal").addEventListener("change",function(e){if(e.target.matches("input,select"))wdUpdateDetailNumbers();});
  document.getElementById("wdDetailModal").addEventListener("click",function(e){
    var b=e.target.closest("[data-wd-modal-act]");if(!b)return;
    var act=b.getAttribute("data-wd-modal-act");
    if(act==="close")wdCloseDetail();
    if(act==="plan")wdSavePlan();
    if(act==="log")wdSaveLog();
  });
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!document.getElementById("wdDetailModal").classList.contains("hidden"))wdCloseDetail();});

  function wdSyncExistingUI(){
    var logs=wdTodayLogs(),plans=wdTodayPlans();
    var gross=logs.reduce(function(s,x){return s+(Number(x.gross)||0);},0);
    var actualMinutes=logs.reduce(function(s,x){return s+(Number(x.minutes)||0);},0);
    var grossText="~"+wdFormat(gross)+" kcal";
    var todayBurn=document.getElementById("todayExerciseOut"),progressBurn=document.getElementById("progressExercise");
    if(todayBurn)todayBurn.textContent=grossText;
    if(progressBurn)progressBurn.textContent=grossText;
    var budgetLabel=document.querySelector("#todayPage .remain span");
    if(budgetLabel)budgetLabel.textContent="คงเหลือตามอาหารที่บันทึก";
    var blocks=document.querySelectorAll("#todayPage .balance-grid .balance-box");
    if(blocks[2]&&blocks[2].querySelector("span"))blocks[2].querySelector("span").textContent="🍽️ กินจริง (ไม่หัก Workout)";
    if(blocks[1]&&blocks[1].querySelector("span"))blocks[1].querySelector("span").textContent="🏃 Workout (รวมโดยประมาณ)";
    var tl=document.getElementById("timeline");
    if(tl){
      Array.prototype.forEach.call(tl.querySelectorAll(".wd-generated-row"),function(el){el.remove();});
      if(logs.length){
        var row=document.createElement("div");row.className="timeline-row wd-generated-row";
        row.innerHTML='<div class="time">วันนี้</div><div><div class="foodname">กิจกรรมที่ทำจริง '+logs.length+' รายการ</div>'+
          '<div class="sub">'+actualMinutes+' นาที · ประมาณการพลังงาน</div></div><div class="kcal">'+grossText+'</div>';
        if(!tl.querySelector(".timeline-row"))tl.innerHTML="";
        tl.appendChild(row);
      }
    }
    var art=document.querySelector("#todayPage .work-art");
    if(art){
      var card=art.closest(".plan-card"),name=card?card.querySelector("h4"):null,meta=card?card.querySelector("p"):null;
      var buttons=card?card.querySelectorAll(".actions button"):[];
      var rec=wdSuggested();
      if(name)name.textContent=plans.length?plans.map(function(x){return (wdActivity(x.id)||{}).name||"กิจกรรม";}).slice(0,2).join(" + "):rec.map(function(x){return (wdActivity(x.id)||{}).name||"กิจกรรม";}).slice(0,2).join(" + ");
      if(meta)meta.textContent=plans.length?plans.reduce(function(s,x){return s+x.minutes;},0)+" นาทีในแผน · ทำจริง "+actualMinutes+" นาที": "แนะนำ "+wdSuggestedSum().mins+" นาที · ทำจริง "+actualMinutes+" นาที";
      if(buttons[0]){buttons[0].textContent="เปิด Workout";buttons[0].onclick=function(){go("workout");};}
      if(buttons[1]){buttons[1].textContent="เปลี่ยนกิจกรรม";buttons[1].onclick=function(){go("workout");};}
    }
    // Never infer a daily energy deficit from an incomplete food log.
    if(typeof loggedMealCount==="function" && loggedMealCount()<3 && (logs.length || (state.workoutLogs||[]).length)){
      var deficit=document.getElementById("progressDeficit"),weekly=document.getElementById("projectedWeeklyLoss");
      if(deficit)deficit.textContent="ข้อมูลไม่ครบ";
      if(weekly)weekly.textContent="—";
      var status=document.getElementById("planVerdict"),projection=document.getElementById("planProjectionText");
      if(status)status.textContent="บันทึกอาหารให้ครบก่อนประเมิน";
      if(projection)projection.textContent="กิจกรรม "+actualMinutes+" นาทีถูกบันทึกแล้ว แต่การประเมินสมดุลพลังงานรายวันยังต้องมีข้อมูลอาหารครบ";
      var badge=document.getElementById("progressDemoBadge");if(badge)badge.classList.add("hidden");
    }
  }
  // Legacy cards previously added exercise energy to food budget and deficit.
  // For this prototype display gross workout kcal separately; do not automatically
  // increase the food budget or estimated deficit from workout logs.
  exerciseBurn=function(){return 0;};
  var wdOldRender=render;
  render=function(){
    wdOldRender();
    if(!wdUI.placeManuallyChanged)wdUI.where=wdPlace();
    wdRender();
    wdSyncExistingUI();
  };
  var wdOldReset=resetToday;
  resetToday=function(){
    wdOldReset();
    state.workoutPlans=state.workoutPlans.filter(function(x){return x.day!==wdDay();});
    state.workoutLogs=state.workoutLogs.filter(function(x){return x.day!==wdDay();});
    wdPersist();render();
  };
  completeWorkout=function(){go("workout");};
  render();
})();
