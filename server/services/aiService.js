const departments = ['IT Support','Hostel','Maintenance','Library','Accounts','Administration','Academic','Security'];
const categories = ['Network','Hostel','Classroom Equipment','Maintenance','Library','Accounts','Administration','Academic','Security','Other'];

function fallback(text) {
  const s = text.toLowerCase();
  let category='Other', department='Administration', priority='MEDIUM';
  if (/wifi|wi-fi|internet|network|login|computer|laptop/.test(s)) [category,department]=['Network','IT Support'];
  else if (/hostel|dorm|room|fan|water|bed/.test(s)) [category,department]=['Hostel','Hostel'];
  else if (/projector|classroom|desk|blackboard|lecture/.test(s)) [category,department]=['Classroom Equipment','Maintenance'];
  else if (/electric|spark|fire|smoke|wire|leak|broken|repair/.test(s)) [category,department]=['Maintenance','Maintenance'];
  else if (/library|book|reading/.test(s)) [category,department]=['Library','Library'];
  else if (/fee|payment|refund|scholarship/.test(s)) [category,department]=['Accounts','Accounts'];
  else if (/security|threat|harass|unsafe|emergency/.test(s)) [category,department]=['Security','Security'];
  else if (/exam|class|course|teacher|academic/.test(s)) [category,department]=['Academic','Academic'];
  if (/spark|sparking|fire|smoke|gas leak|injur|danger|threat|emergency/.test(s)) priority='CRITICAL';
  else if (/urgent|tomorrow|interview|deadline|days|not working|outage/.test(s)) priority='HIGH';
  else if (/minor|small|noise|slightly/.test(s)) priority='LOW';
  return { category, department, priority, reason:'Suggested using complaint keywords. Review this classification if needed.', fallback:true };
}

export async function classifyComplaint({title, description, location=''}) {
  const text = `${title}\n${description}\n${location}`;
  if (!process.env.OPENAI_API_KEY) return fallback(text);
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`}, body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',response_format:{type:'json_object'},messages:[{role:'system',content:`Classify college helpdesk complaints. Return JSON with category, department, priority, reason only. Categories: ${categories.join(', ')}. Departments: ${departments.join(', ')}. Priority: LOW, MEDIUM, HIGH, CRITICAL. Be concise; sparking electrical equipment, fire, immediate danger are CRITICAL.`},{role:'user',content:text}]})});
    if (!response.ok) throw new Error(`LLM returned ${response.status}`);
    const data=await response.json(); const result=JSON.parse(data.choices[0].message.content);
    if(!categories.includes(result.category)||!departments.includes(result.department)||!['LOW','MEDIUM','HIGH','CRITICAL'].includes(result.priority)||typeof result.reason!=='string') throw new Error('Invalid classifier response');
    return {...result, fallback:false};
  } catch (error) { console.error('AI classification failed:',error.message); return fallback(text); }
}
