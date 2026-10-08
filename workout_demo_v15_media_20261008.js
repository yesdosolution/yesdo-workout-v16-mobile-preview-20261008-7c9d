/* Workout Media V15: own illustrated silent MP4/WebM, embedded only when needed.
 * Small progressive enhancement on top of V14. No AI, tracking or network APIs.
 */
(function(){
  'use strict';
  const clips=[
    {key:'treadmill',exercise:'g_walk',where:'gym',title:'เดินลู่ทางราบ'},
    {key:'bike',exercise:'g_bike',where:'gym',title:'จักรยานฟิตเนส'},
    {key:'chair_squat',exercise:'h_chair',where:'home',title:'ลุกนั่งจากเก้าอี้'},
    {key:'wall_pushup',exercise:'h_wall',where:'home',title:'Wall Push-up'},
    {key:'glute_bridge',exercise:'h_bridge',where:'home',title:'Glute Bridge'},
    {key:'bodyweight',exercise:'h_body',where:'home',title:'Bodyweight Full Body'}
  ];
  const prefix='assets/workouts/';
  const root=document.getElementById('workoutPage');
  const modal=document.getElementById('wdDetailModal');
  if(!root||!modal){console.warn('Workout video enhancement disabled: Workout V14 unavailable');return;}
  const byName=(name)=>clips.find(c=>name&&name.includes(c.title));
  const byId=(id)=>clips.find(c=>c.exercise===id);
  const reducedMotion=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function addGallery(){
    const hero=root.querySelector('#wdHero');
    if(!hero||root.querySelector('.wdm-gallery'))return;
    const wrap=document.createElement('section');
    wrap.className='wdm-gallery';
    wrap.setAttribute('aria-label','คลิปภาพเคลื่อนไหวสาธิตท่า');
    wrap.innerHTML='<div class="wdm-gallery-heading"><h3>▶ ดูท่าสาธิตแบบเคลื่อนไหว</h3><small>6 คลิปของเราเอง</small></div>'+
      '<div class="wdm-gallery-list">'+clips.map(c=>
        '<button class="wdm-gallery-tile" type="button" data-wdm-preview="'+c.exercise+'" aria-label="เปิดสาธิต '+c.title+'">'+
          '<span class="wdm-gallery-figure"><img alt="" loading="lazy" src="'+prefix+c.key+'_thumb.webp"><span class="wdm-playchip">▶ 4 วิ</span></span>'+
          '<b>'+c.title+'</b><small>แตะเพื่อดูท่า</small>'+
        '</button>').join('')+'</div>';
    hero.insertAdjacentElement('afterend',wrap);
  }
  function enrichCatalog(){
    root.querySelectorAll('.wd-activity-card').forEach(card=>{
      const name=card.querySelector('.wd-activity-name')?.textContent||'';
      const clip=byName(name);
      if(!clip||card.querySelector('.wdm-clip-indicator'))return;
      const icon=card.querySelector('.wd-activity-icon');
      if(icon){
        const img=document.createElement('img');
        img.src=prefix+clip.key+'_thumb.webp';img.alt='';img.loading='lazy';
        img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:12px;display:block;';
        icon.replaceChildren(img);
      }
      const pills=card.querySelector('.wd-pills');
      if(pills){const mark=document.createElement('span');mark.className='wdm-clip-indicator';mark.textContent='▶ มีคลิปสาธิต';pills.appendChild(mark);}
    });
  }
  function injectVideo(){
    const sheet=modal.querySelector('#wdDetailSheet');
    if(!sheet||sheet.querySelector('.wdm-media'))return;
    const label=sheet.querySelector('.wd-detail-title')?.textContent||'';
    const clip=byName(label);
    if(!clip)return;
    const subtitle=sheet.querySelector('.wd-detail-sub');
    if(!subtitle)return;
    const block=document.createElement('div');
    block.className='wdm-media';
    block.innerHTML=
      '<div class="wdm-illustration-label">▶ ภาพสาธิตแบบเคลื่อนไหว · ผลิตสำหรับ Prototype นี้</div>'+
      '<div class="wdm-frame">'+
        '<video class="wdm-video" width="960" height="540" muted loop playsinline preload="metadata" poster="'+prefix+clip.key+'_poster.png" aria-label="ภาพเคลื่อนไหวสาธิต '+clip.title+'">'+
          '<source src="'+prefix+clip.key+'.mp4" type="video/mp4">'+
          '<source src="'+prefix+clip.key+'.webm" type="video/webm">'+
          'เบราว์เซอร์นี้ไม่รองรับวิดีโอสาธิต'+
        '</video>'+
        '<button class="wdm-toggle" type="button" aria-label="เล่นหรือหยุดภาพเคลื่อนไหว">▶ เล่นคลิป</button>'+
      '</div>'+
      '<p class="wdm-caption">ภาพสาธิตประกอบการเข้าใจท่าเท่านั้น ไม่ใช่การประเมินฟอร์มหรือคำรับรองว่าปลอดภัยสำหรับทุกคน อ่านวิธีทำด้านล่างและหยุดเมื่อมีอาการผิดปกติ</p>'+
      '<div class="wdm-error" role="status">ไม่สามารถเล่นคลิปได้ในเบราว์เซอร์นี้ ลองเปิดด้วย Chrome/Edge หรือดูภาพนิ่งและวิธีทำด้านล่าง</div>';
    subtitle.insertAdjacentElement('afterend',block);
    const video=block.querySelector('video');
    const toggle=block.querySelector('.wdm-toggle');
    const setButton=()=>{toggle.textContent=video.paused?'▶ เล่นคลิป':'⏸ พักภาพ';toggle.setAttribute('aria-pressed',String(!video.paused));};
    toggle.addEventListener('click',()=>{
      if(!video.paused){video.pause();setButton();return;}
      video.play().then(setButton).catch(()=>{setButton();block.querySelector('.wdm-error').classList.add('visible');});
    });
    video.addEventListener('play',setButton);
    video.addEventListener('pause',setButton);
    video.addEventListener('error',()=>block.querySelector('.wdm-error').classList.add('visible'));
    if(!reducedMotion()){
      video.play().then(setButton).catch(()=>{video.pause();setButton();});
    } else {video.pause();setButton();}
  }
  let pending=false;
  function renderEnhancements(){
    if(pending)return;
    pending=true;
    queueMicrotask(()=>{
      pending=false;
      addGallery();
      enrichCatalog();
      injectVideo();
    });
  }
  root.addEventListener('click',e=>{
    const tile=e.target.closest('[data-wdm-preview]');
    if(!tile)return;
    const clip=byId(tile.getAttribute('data-wdm-preview'));
    if(!clip)return;
    const tab=root.querySelector('[data-wd-act="place"][data-wd-val="'+clip.where+'"]');
    if(tab)tab.click();  // V14 resets category filters when a place is selected.
    const detail=root.querySelector('[data-wd-act="detail"][data-wd-id="'+clip.exercise+'"]');
    if(detail)detail.click();
  });
  const pageObserver=new MutationObserver(renderEnhancements);
  pageObserver.observe(root,{childList:true,subtree:true});
  const modalObserver=new MutationObserver(()=>{
    if(modal.classList.contains('hidden')) {
      const video=modal.querySelector('video.wdm-video');
      if(video&&!video.paused)video.pause();
    } else {renderEnhancements();}
  });
  modalObserver.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){const video=modal.querySelector('video.wdm-video');if(video)video.pause();}
  });
  renderEnhancements();
})();
