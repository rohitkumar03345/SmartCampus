import { pool } from '../db/pool.js';
const docs = {
 'hostel_rules.txt':'HOSTEL: Report room repairs, water, electricity, fan, and cleanliness issues through SmartCampus. For immediate safety risks contact campus security in person. Keep your room and hostel block details in the ticket.',
 'it_support.txt':'IT SUPPORT: For Wi-Fi, network, or account access issues, restart your device and reconnect to CampusNet. Check whether nearby students are affected. If service remains unavailable, submit a SmartCampus complaint with hostel or building and room details.',
 'library_rules.txt':'LIBRARY: Return borrowed books by the due date shown in your account. Report damaged books, access problems, or facility issues through a SmartCampus library complaint. Quiet study areas should remain silent.',
 'complaint_policy.txt':'COMPLAINT POLICY: Submit one clear ticket per issue, including location and impact. You can follow its status in My Complaints. Staff update the ticket as work progresses. Urgent safety concerns should also be reported directly to campus security.',
 'campus_facilities.txt':'CAMPUS FACILITIES: Report classroom equipment, lighting, water, and maintenance concerns through SmartCampus. Include the building, room number, and a short description. For immediate hazards, contact campus security directly.'
};
export async function seedKnowledge(){for(const [filename,content] of Object.entries(docs)) await pool.query('INSERT INTO knowledge_documents(filename,content) VALUES($1,$2) ON CONFLICT(filename) DO UPDATE SET content=EXCLUDED.content',[filename,content]);}
export async function answerQuestion(question){
 const {rows}=await pool.query('SELECT filename,content FROM knowledge_documents');
 const stop=new Set(['what','when','where','which','who','whom','whose','why','how','should','could','would','there','their','this','that','with','from','have','does','will','your','about','into','and','the','for','are','not','you','can','was','were','its','our','out','campus']);
 const terms=text=>(text.toLowerCase().replace(/wi[\s-]?fi/g,'wifi').match(/[a-z]{3,}/g)||[]).filter(w=>!stop.has(w));
 const words=terms(question);
 const ranked=rows.map(d=>{const content=terms(d.content);const available=new Set(content);const score=words.reduce((n,w)=>n+(available.has(w)?1:0),0);return {...d,score}}).sort((a,b)=>b.score-a.score);
 if(!ranked[0]||ranked[0].score===0)return {answer:'I could not find this information in the campus knowledge base.',source:null};
 const d=ranked[0]; return {answer:d.content.replace(/^[A-Z ]+:\s*/,''),source:d.filename};
}
