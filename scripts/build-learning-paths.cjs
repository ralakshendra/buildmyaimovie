const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const paths=JSON.parse(fs.readFileSync(path.join(root,'content/learning-paths.json'),'utf8'));
const schedule=vm.runInNewContext(fs.readFileSync(path.join(root,'library/schedule.js'),'utf8')+';window.BMAI_SESSIONS',{window:{}});
for(const session of schedule.filter(s=>s.session)){
 const route=paths[session.id];if(!route?.prepare?.length||!route.steps?.length)throw Error('Missing catch-up path: '+session.id);
 const source=fs.readFileSync(path.join(root,session.session),'utf8');
 for(const step of route.steps)if(!source.includes('id="'+step.anchor+'"'))throw Error('Missing guide anchor: '+session.id+'#'+step.anchor);
 // Replay details are optional and must be supplied by the owner, never invented.
 if(route.recording){
  const recording=route.recording,url=new URL(recording.url);if(url.protocol!=='https:')throw Error('Recording must use HTTPS');if(!recording.verifiedAccess)throw Error('Verify recording access before registering it');
  if(recording.transcriptUrl&&new URL(recording.transcriptUrl).protocol!=='https:')throw Error('Transcript must use HTTPS');
  if(recording.embedUrl){const embed=new URL(recording.embedUrl);if(embed.protocol!=='https:'||!['www.youtube-nocookie.com','player.vimeo.com','fast.wistia.net','www.loom.com'].includes(embed.hostname))throw Error('Unsupported recording embed provider');}
  for(const chapter of recording.chapters||[])if(!chapter.title||new URL(chapter.url).protocol!=='https:')throw Error('Invalid recording chapter');
 }
}
fs.writeFileSync(path.join(root,'library/learning-paths.js'),'/* Generated from content/learning-paths.json. */\nwindow.BMAI_LEARNING_PATHS='+JSON.stringify(paths,null,2)+';\n');
console.log('Verified source anchors for '+schedule.filter(s=>s.session).length+' catch-up paths.');
