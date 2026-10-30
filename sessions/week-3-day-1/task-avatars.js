(()=>{
  const guides=[
    ['task-1','reference-board','Alexx Roy reviewing the character plan'],
    ['task-2','camera','Alexx Roy developing the hero base'],
    ['task-3','storyboard','Alexx Roy pointing to the title task'],
    ['task-4','confident','Alexx Roy framing the A-roll'],
    ['task-5','microphone','Alexx Roy guiding the sound pass'],
    ['task-6','headphones','Alexx Roy listening to the edit'],
    ['task-7','checklist','Alexx Roy calling the final export']
  ];
  for(const [id,pose,label] of guides){
    const header=document.querySelector(`#${id}>header`);
    if(!header)continue;
    const avatar=document.createElement('div');
    avatar.className=`studio-avatar ${pose} w3d2-task-avatar`;
    avatar.setAttribute('role','img');
    avatar.setAttribute('aria-label',label);
    avatar.dataset.avatarTip=header.querySelector('p')?.textContent||'Finish this task, review the output and save your approved version.';
    header.append(avatar);
  }
})();
