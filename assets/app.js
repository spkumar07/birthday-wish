
    const form=document.querySelector('#detailsForm');
    const photoInput=document.querySelector('#photo');
    const profilePhotoInput=document.querySelector('#profilePhoto');
    const musicInput=document.querySelector('#music');
    const detailsStep=document.querySelector('#detailsStep');
    const styleStep=document.querySelector('#styleStep');
    const resultStep=document.querySelector('#resultStep');
    let profilePhotoData='';
    let photoData=[];
    let musicData='';
    let musicType='';
    let photoBytes=0;
    let profileBytes=0;
    let musicBytes=0;
    const maxMediaBytes=8*1024*1024;
    let generatedHtml='';
    let savedWebsiteUrl='';
    const value=(id)=>document.querySelector(`#${id}`).value.trim();
    const escapeHtml=(text)=>text.replace(/[&<>"']/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
    const selectedPlan=()=>document.querySelector('input[name="plan"]:checked').value;
    function setPhoto(element,image){element.replaceChildren();if(!image){element.textContent='♡';return}const photo=document.createElement('img');photo.src=image;photo.alt='';element.append(photo)}
    function readAsDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.addEventListener('load',()=>resolve(reader.result),{once:true});reader.addEventListener('error',()=>reject(reader.error||new Error('Could not read this file.')),{once:true});reader.readAsDataURL(file)})}
    function formatDate(date){if(!date)return'';return new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}
    function updatePreview(){const name=value('recipient')||'Someone wonderful';const occasion=document.querySelector('#occasion').value;const date=formatDate(value('date'))||'Your special date goes here';const favorites=value('favorites')||'The little things are what make you, you.';document.querySelector('#miniName').textContent=name;document.querySelector('#miniKicker').textContent=occasion==='Birthday'?'A day all about you':`A little ${occasion.toLowerCase()} love`;document.querySelector('#miniDate').textContent=date;document.querySelector('#miniMessage').textContent=favorites;setPhoto(document.querySelector('#miniPhoto'),profilePhotoData);document.querySelector('#yearsField').classList.toggle('hidden',occasion!=='Anniversary');document.querySelector('#metField').classList.toggle('hidden',occasion==='Birthday')}
    function updateStylePreview(){for(const key of ['Name','Kicker','Date','Message'])document.querySelector(`#style${key}`).textContent=document.querySelector(`#mini${key}`).textContent;setPhoto(document.querySelector('#stylePhoto'),profilePhotoData);const elite=selectedPlan()==='elite';document.querySelector('#selectedPlanName').textContent=elite?'THE LITTLE EXTRA':'THE CLASSIC';document.querySelector('#stylePreview').classList.toggle('elite-active',elite);document.querySelector('#eliteCard').classList.toggle('selected',elite);document.querySelector('#normalCard').classList.toggle('selected',!elite)}
    function setStep(step){detailsStep.classList.toggle('hidden',step!==1);styleStep.classList.toggle('hidden',step!==2);resultStep.classList.toggle('hidden',step!==3);document.querySelector('#intro').classList.toggle('hidden',step===3);for(const[index,id]of['stepOne','stepTwo','stepThree'].entries()){const element=document.querySelector(`#${id}`);element.classList.toggle('active',index+1===step);element.classList.toggle('done',index+1<step)}window.scrollTo({top:0,behavior:'smooth'})}
    function makeQr(target){const payload=target||'Support the developer to make this special';return`https://api.qrserver.com/v1/create-qr-code/?size=280x280&format=png&data=${encodeURIComponent(payload)}`}
    function buildWebsite(supportUrl){const recipient=value('recipient');const occasion=document.querySelector('#occasion').value;const date=formatDate(value('date'));const firstMet=value('firstMet');const years=value('years');const favorites=value('favorites')||`Today is a little reminder of how lucky I am to have you in my life, ${recipient}.`;const promise=value('promise')||`Here's to making many more memories together.\n\nWith love${value('yourName')?`, ${value('yourName')}`:''}.`;
      document.querySelector('#resultKicker').textContent=occasion==='Birthday'?'A day all about you':`A little ${occasion.toLowerCase()} love`;document.querySelector('#resultName').textContent=recipient;document.querySelector('#resultDate').textContent=date;document.querySelector('#resultMessage').textContent=favorites;document.querySelector('#resultPromise').innerHTML=`<span class="promise-label">A promise for the days ahead</span>${escapeHtml(promise).replace(/\n/g,'<br>')}`;setPhoto(document.querySelector('#resultPhoto'),profilePhotoData);
      const memories=[];if(firstMet)memories.push(`<div class="memory"><strong>Where our story began</strong><span>${escapeHtml(firstMet)}</span></div>`);if(occasion==='Anniversary'&&years)memories.push(`<div class="memory"><strong>Still choosing you</strong><span>${escapeHtml(years)} ${years==='1'?'year':'years'} together</span></div>`);document.querySelector('#memoryRow').innerHTML=memories.join('');document.querySelector('#memoryRow').classList.toggle('hidden',memories.length===0);
      const qr=document.querySelector('#supportQr');qr.src=makeQr(supportUrl);qr.alt=supportUrl?'QR code to open the developer support link':'Sample QR code for developer support';const anchor=document.querySelector('#supportAnchor');anchor.classList.toggle('hidden',!supportUrl);if(supportUrl){anchor.href=supportUrl;document.querySelector('#supportCopy').textContent='Scan the code or open the link to support the developer.'}else{anchor.removeAttribute('href');document.querySelector('#supportCopy').textContent='Add a payment link in the style step to make this QR code support the developer directly.'}
      document.querySelector('#tributeSite').classList.toggle('elite-active',selectedPlan()==='elite');document.querySelector('#resultKicker').textContent=occasion==='Birthday'?'Happy Birthday':occasion==='Anniversary'?'Happy Anniversary':'Just Because';setStep(3)}
    function makeWebsiteDocument(styles){
      const copy=document.querySelector('#tributeSite').cloneNode(true);
      const image=copy.querySelector('#resultPhoto img');
      copy.querySelector('#resultPhoto').innerHTML=image?`<img src="${image.src}" alt="">`:'♡';
      const galleryMarkup=photoData.length>1?`<section class="memory-slideshow" aria-label="Photo memories"><div class="slideshow-heading"><p class="eyebrow">Little moments together</p><h3>Our favorite memories</h3></div><div class="slide-frame"><img id="memorySlide" src="${photoData[0].data}" alt="Memory 1 of ${photoData.length}"></div><div class="slideshow-controls"><button class="slide-button" id="previousSlide" type="button" aria-label="Previous memory">←</button><span id="slideCounter" aria-live="polite">1 / ${photoData.length}</span><button class="slide-button" id="nextSlide" type="button" aria-label="Next memory">→</button></div></section>`:'';
      const musicMarkup=musicData?`<section class="memory-music" aria-label="Background music"><div class="music-copy"><span class="music-note" aria-hidden="true">♫</span><div><strong>With love, in the background</strong><small>${escapeHtml(document.querySelector('#musicName').textContent)}</small></div></div><audio class="memory-audio" controls loop preload="none"><source src="${musicData}" type="${escapeHtml(musicType||'audio/mpeg')}"></audio></section>`:'';
      const elite=copy.classList.contains('elite-active');
      if(elite)copy.classList.add('hidden');
      const cardMarkup=copy.outerHTML.replace('<section class="support-section">',`${galleryMarkup}${musicMarkup}<section class="support-section">`);
      const documentText=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(value('recipient'))} — a little website for you</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet"><style>${styles}\nbody{padding:28px 16px}.tribute-site{max-width:820px;margin:0 auto}.elite-active .tribute-hero::after{content:'✳';position:absolute;top:40px;right:15%;color:#ec7259;font-size:30px;animation:twinkle 3s infinite}</style></head><body>${copy.outerHTML}</body></html>`;
      const slideshowScript=photoData.length>1?`<script>(()=>{
        const slides=${JSON.stringify(photoData.map(photo=>photo.data))};
        const image=document.getElementById('memorySlide');
        const counter=document.getElementById('slideCounter');
        let current=0;
        let transitionTimer=0;
        const showSlide=(index)=>{
          current=(index+slides.length)%slides.length;
          image.classList.add('is-changing');
          window.clearTimeout(transitionTimer);
          transitionTimer=window.setTimeout(()=>{
            const nextSource=slides[current];
            image.alt='Memory '+(current+1)+' of '+slides.length;
            counter.textContent=(current+1)+' / '+slides.length;
            if(image.getAttribute('src')!==nextSource)image.src=nextSource;
            image.classList.remove('is-changing');
          },180);
        };
        document.getElementById('previousSlide').addEventListener('click',()=>showSlide(current-1));
        document.getElementById('nextSlide').addEventListener('click',()=>showSlide(current+1));
        const gift=document.getElementById('tributeSite');
        let timer=null;
        const startTimer=()=>{
          if(timer||document.hidden||gift.classList.contains('hidden'))return;
          timer=window.setInterval(()=>showSlide(current+1),4500);
        };
        const observer=new MutationObserver(startTimer);
        observer.observe(gift,{attributes:true,attributeFilter:['class']});
        document.addEventListener('visibilitychange',()=>{
          if(document.hidden){window.clearInterval(timer);timer=null}
          else{startTimer()}
        });
        startTimer();
      })();</scr`+`ipt>`:'';
      if(!elite)return documentText.replace(copy.outerHTML,cardMarkup).replace('</body>',`${slideshowScript}</body>`);
      const story=`<main class="elite-story" id="eliteStory">
        <section class="ready-screen" id="readyScreen">
          <p class="story-eyebrow">A tiny surprise, made with love</p>
          <div class="cat-stage"><span class="cat-sparkle" aria-hidden="true">✦</span><span class="cat-portrait" aria-hidden="true">🐱</span><span class="cat-sparkle" aria-hidden="true">✧</span></div>
          <p class="cat-caption">a very important kitty has a question</p>
          <h1>Your little surprise is ready</h1>
          <p class="story-copy">A small moment, made just for you. Shall we?</p>
          <button class="story-button ready-button" id="readyButton" type="button">Are you ready? <span aria-hidden="true">→</span></button>
        </section>
        <section class="question-screen" id="catQuestion" hidden>
          <div class="question-cat" aria-hidden="true"><span id="catFace">😺</span><i>♡</i></div>
          <p class="story-eyebrow">Before your gift…</p>
          <h1 id="loveQuestion">Do you love them?</h1>
          <p class="story-copy">The kitty needs an honest answer first.</p>
          <div class="choice-buttons" id="choiceButtons"><button class="story-button gift-choice" id="noButton" type="button">Just take my gift</button><button class="story-button love-choice" id="yesButton" type="button">Yes, I love him! <span aria-hidden="true">♡</span></button></div>
          <p class="tease-message" id="teaseMessage" aria-live="polite">Choose wisely, little human…</p>
        </section>
        <section class="love-modal" id="loveModal" role="dialog" aria-modal="true" aria-labelledby="loveModalTitle" hidden>
          <div class="modal-sparkle" aria-hidden="true">✷</div><div class="modal-cat" aria-hidden="true">😻</div>
          <p class="story-eyebrow">the kitty knew</p><h2 id="loveModalTitle">I knew it!</h2>
          <p class="modal-thanks">Thank you for choosing me.</p><p class="modal-copy">Now here's your gift, made with lots of love.</p>
          <button class="story-button reveal-button" id="revealGift" type="button">Open my gift <span aria-hidden="true">→</span></button>
        </section>
      </main>`;
      const storyScript=`<script>(()=>{
        const get=(id)=>document.getElementById(id);
        const lovedPerson=${JSON.stringify(value('yourName')||value('recipient')).replace(/</g,'\\u003c')};
        const ready=get('readyScreen');
        const question=get('catQuestion');
        const modal=get('loveModal');
        const gift=document.getElementById('tributeSite');
        let noCount=0;
        get('readyButton').addEventListener('click',()=>{
          ready.hidden=true;
          question.hidden=false;
          get('loveQuestion').textContent='Do you love '+lovedPerson+'?';
          get('yesButton').focus();
        });
        get('noButton').addEventListener('click',()=>{
          noCount+=1;
          const yesButton=get('yesButton');
          const noButton=get('noButton');
          const sameRow=yesButton.offsetTop===noButton.offsetTop;
          const sizeProperty=sameRow?'offsetWidth':'offsetHeight';
          const positionProperty=sameRow?'offsetLeft':'offsetTop';
          const centerDistance=Math.abs(yesButton[positionProperty]-noButton[positionProperty])+(yesButton[sizeProperty]+noButton[sizeProperty])/2;
          const maxGrowth=Math.max(1,Math.min(2.5,(2*centerDistance-noButton[sizeProperty]*.6)/yesButton[sizeProperty]));
          yesButton.style.setProperty('--choice-grow',Math.min(maxGrowth,1+noCount*.14));
          noButton.style.setProperty('--choice-shrink',Math.max(.6,1-noCount*.1));
          const faces=['😸','😼','😽','😻'];
          get('catFace').textContent=faces[Math.min(noCount-1,faces.length-1)];
          const messages=['Are you sure? My gift is very cute…','The kitty believes in you!','You can say yes whenever you are ready.','I can wait all day for that yes!'];
          get('teaseMessage').textContent=messages[Math.min(noCount-1,messages.length-1)];
        });
        get('yesButton').addEventListener('click',()=>{
          modal.hidden=false;
          get('revealGift').focus();
        });
        get('revealGift').addEventListener('click',()=>{
          modal.hidden=true;
          question.hidden=true;
          gift.classList.remove('hidden');
          gift.scrollIntoView({behavior:'smooth',block:'start'});
        });
      })();</scr`+`ipt>`;
      return documentText.replace(copy.outerHTML,`${story}${cardMarkup}`).replace('</body>',`${slideshowScript}${storyScript}</body>`);
    }
    function supportTarget(){const raw=value('supportUrl');if(!raw)return'';let url;try{url=new URL(raw)}catch{return null}return['https:','http:','upi:'].includes(url.protocol)?url.href:null}
    async function createWebsite(){
      const supportUrl=supportTarget();
      if(supportUrl===null){showToast('Enter a valid website or UPI support link.');return}
      generatedHtml='';
      if(savedWebsiteUrl.startsWith('blob:'))URL.revokeObjectURL(savedWebsiteUrl);
      savedWebsiteUrl='';
      document.querySelector('#openWebsiteLink').classList.add('hidden');
      const buildButton=document.querySelector('#buildButton');
      buildButton.disabled=true;
      buildWebsite(supportUrl);
      document.querySelector('#saveStatus').textContent='Saving your website…';
      try{
        const stylesheet=await fetch('./assets/styles.css');
        if(!stylesheet.ok)throw new Error('Could not load the website styles.');
        generatedHtml=makeWebsiteDocument(await stylesheet.text());
        const response=await fetch('/api/sites',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:value('recipient'),html:generatedHtml})});
        if(!response.ok)throw new Error('Local website saving is unavailable.');
        const result=await response.json();
        savedWebsiteUrl=result.url;
        document.querySelector('#openWebsiteLink').href=savedWebsiteUrl;
        document.querySelector('#openWebsiteLink').classList.remove('hidden');
        document.querySelector('#saveStatus').textContent=`Saved in webs/${result.filename}`;
      }catch(error){
        if(!generatedHtml){document.querySelector('#saveStatus').textContent=error.message;showToast('Could not prepare the website. Start the app with npm start.');buildButton.disabled=false;return}
        savedWebsiteUrl=URL.createObjectURL(new Blob([generatedHtml],{type:'text/html;charset=utf-8'}));
        document.querySelector('#openWebsiteLink').href=savedWebsiteUrl;
        document.querySelector('#openWebsiteLink').classList.remove('hidden');
        document.querySelector('#saveStatus').textContent='Ready in this browser. Download a copy to keep it.';
      }finally{buildButton.disabled=false}
    }
    function downloadWebsite(){
      if(!savedWebsiteUrl){showToast('Build the website before downloading.');return}
      const link=document.createElement('a');
      link.href=savedWebsiteUrl;
      link.download=`${value('recipient').toLowerCase().replace(/[^a-z0-9]+/g,'-')||'little-moments'}.html`;
      document.body.append(link);
      link.click();
      window.setTimeout(()=>link.remove(),1000);
    }
    form.addEventListener('input',updatePreview);form.addEventListener('change',updatePreview);
    document.querySelector('#chooseProfile').addEventListener('click',()=>profilePhotoInput.click());
    profilePhotoInput.addEventListener('change',async()=>{const file=profilePhotoInput.files[0];if(!file)return;if(file.size+photoBytes+musicBytes>maxMediaBytes){profilePhotoInput.value='';showToast('Profile, slideshow and music files together must stay under 8 MB.');return}try{profilePhotoData=await readAsDataUrl(file);profileBytes=file.size;document.querySelector('#profileName').textContent=file.name;setPhoto(document.querySelector('#profilePreview'),profilePhotoData);updatePreview()}catch{showToast('Could not read that profile photo.')}finally{profilePhotoInput.value=''}});
    document.querySelector('#choosePhoto').addEventListener('click',()=>photoInput.click());
    document.querySelector('#chooseMusic').addEventListener('click',()=>musicInput.click());
    photoInput.addEventListener('change',async()=>{const files=Array.from(photoInput.files||[]);if(!files.length)return;if(files.length>8){photoInput.value='';showToast('Choose up to 8 slideshow photos.');return}const totalBytes=files.reduce((total,file)=>total+file.size,0);if(totalBytes+musicBytes+profileBytes>maxMediaBytes){photoInput.value='';showToast('Profile, slideshow and music files together must stay under 8 MB.');return}try{photoData=await Promise.all(files.map(async file=>({data:await readAsDataUrl(file),name:file.name})));photoBytes=totalBytes;document.querySelector('#uploadName').textContent=photoData.length===1?photoData[0].name:`${photoData.length} slideshow photos selected`;setPhoto(document.querySelector('#uploadPreview'),photoData[0]?.data||'');updatePreview()}catch{showToast('Could not read one of those photos.')}finally{photoInput.value=''}});
    musicInput.addEventListener('change',async()=>{const file=musicInput.files[0];if(!file)return;if(file.size+photoBytes+profileBytes>maxMediaBytes){musicInput.value='';showToast('Profile, slideshow and music files together must stay under 8 MB.');return}try{musicData=await readAsDataUrl(file);musicType=file.type||'audio/mpeg';musicBytes=file.size;document.querySelector('#musicName').textContent=file.name}catch{showToast('Could not read that music file.')}finally{musicInput.value=''}});
    form.addEventListener('submit',(event)=>{event.preventDefault();updateStylePreview();setStep(2)});document.querySelectorAll('input[name="plan"]').forEach((input)=>input.addEventListener('change',updateStylePreview));document.querySelector('#backToDetails').addEventListener('click',()=>setStep(1));document.querySelector('#buildButton').addEventListener('click',createWebsite);document.querySelector('#editDetails').addEventListener('click',()=>setStep(2));
    form.addEventListener('reset',()=>{profilePhotoData='';profileBytes=0;document.querySelector('#profileName').textContent='Choose their portrait';setPhoto(document.querySelector('#profilePreview'),'')});
    document.querySelector('#startOverButton').addEventListener('click',()=>{form.reset();photoData=[];musicData='';musicType='';musicBytes=0;photoBytes=0;generatedHtml='';if(savedWebsiteUrl.startsWith('blob:'))URL.revokeObjectURL(savedWebsiteUrl);savedWebsiteUrl='';document.querySelector('#openWebsiteLink').classList.add('hidden');document.querySelector('#saveStatus').textContent='Preparing your website…';document.querySelector('#uploadName').textContent='Bring your favorite moments along';document.querySelector('#musicName').textContent='Choose a song for the memories';document.querySelector('#supportUrl').value='';document.querySelector('input[name="plan"][value="normal"]').checked=true;setPhoto(document.querySelector('#uploadPreview'),'');updatePreview();setStep(1)});document.querySelector('#downloadButton').addEventListener('click',downloadWebsite);
    function showToast(message){const toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');toast.textContent=message;document.body.append(toast);window.setTimeout(()=>toast.remove(),2800)}
  