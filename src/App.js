import { useState, useRef } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const now = new Date();
const CM = now.getMonth(), CY = now.getFullYear();
const mkKey = (m,y) => `${y}-${String(m+1).padStart(2,'0')}`;

const USERS = ['jayant','pooja','aarna','thulasi','kkram'];
const DEFAULT_PWD = 'rent@blr';

const C = {
  bg:'#F7F8FA', card:'#FFFFFF', border:'#E8EAED', borderLt:'#F0F1F3',
  text:'#1A1D23', text2:'#6B7280', text3:'#9CA3AF',
  primary:'#4F46E5', primaryLt:'#EEF2FF',
  green:'#059669', greenLt:'#ECFDF5', red:'#DC2626', redLt:'#FEF2F2',
  amber:'#D97706', amberLt:'#FFFBEB', sidebar:'#1E2330',
};
const BCOLORS = ['#4F46E5','#059669','#0891B2','#9333EA','#DC2626','#D97706','#DB2777','#0D9488'];
const CAT_COLORS = {'Plumbing':'#0891B2','Electrician':'#D97706','Security':'#9333EA','BBMP':'#DC2626','BESCOM':'#EA580C','BWSSB':'#059669','Other':'#6B7280'};
const REPAIR_CATS = ['Plumbing','Electrician','Security','BBMP','BESCOM','BWSSB','Other'];

const INIT_BUILDINGS = [
  { id:1, name:"Sunset Apartments",  address:"12 Sunset Blvd, Miami FL" },
  { id:2, name:"Oakwood Residences", address:"45 Oak Street, Orlando FL" },
  { id:3, name:"Harbor View",        address:"8 Harbor Lane, Tampa FL" },
];

const genTenants = () => Array.from({length:30},(_,i)=>{
  const rent=[800,950,1000,1100,1200,1250,1300,1400,1500][i%9];
  const bld=INIT_BUILDINGS[Math.floor(i/10)];
  const leaseEnd=new Date(CY+(i%2===0?1:0),(i*2+3)%12,1);
  return { id:i+1, unit:`${Math.floor(i/10)+1}0${(i%10)+1}`, name:`Tenant ${i+1}`,
    phone:`555-${String(1000+i*7).slice(-4)}`, email:`tenant${i+1}@email.com`,
    rent, leaseEnd:leaseEnd.toISOString().slice(0,10), buildingId:bld.id };
});

// ── SHARED STYLES ──
const sharedInp = {border:`1px solid ${C.border}`,borderRadius:8,padding:'9px 12px',fontSize:14,background:'#fff',color:C.text,width:'100%',boxSizing:'border-box',outline:'none'};

// ── LOGIN ──────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [user,setUser]=useState('');
  const [pwd,setPwd]=useState('');
  const [err,setErr]=useState('');
  const attempt=()=>{
    const u=user.trim().toLowerCase();
    if(!USERS.includes(u)){setErr('Username not found.');return;}
    const pwds=JSON.parse(localStorage.getItem('manne_pwds')||'{}');
    const expected=pwds[u]||DEFAULT_PWD;
    if(pwd!==expected){setErr('Incorrect password.');return;}
    localStorage.setItem('manne_auth',JSON.stringify({user:u,ts:Date.now()}));
    onLogin(u);
  };
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1E2330 0%,#2D3550 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'}}>
      <div style={{background:'#fff',borderRadius:16,padding:'40px 36px',width:360,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:32,fontWeight:800,color:C.primary,letterSpacing:-1}}>Manne</div>
          <div style={{fontSize:13,color:C.text2,marginTop:4}}>Property Manager · Sign in</div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.text2,display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:.5}}>Username</label>
          <input value={user} onChange={e=>{setUser(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&attempt()}
            placeholder="Enter your username" style={sharedInp}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,fontWeight:600,color:C.text2,display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:.5}}>Password</label>
          <input type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&attempt()}
            placeholder="Enter your password" style={sharedInp}/>
        </div>
        {err&&<div style={{background:'#FEF2F2',color:C.red,fontSize:13,padding:'10px 14px',borderRadius:8,marginBottom:14,fontWeight:500}}>{err}</div>}
        <button onClick={attempt} style={{width:'100%',background:C.primary,color:'#fff',border:'none',borderRadius:8,padding:'12px',fontSize:15,fontWeight:600,cursor:'pointer'}}>Sign in</button>
        <div style={{textAlign:'center',fontSize:12,color:C.text2,marginTop:16}}>Contact admin if you need access.</div>
      </div>
    </div>
  );
}

// ── CHANGE PASSWORD MODAL ──────────────────────────────────
function ChangePasswordModal({user,onClose}) {
  const [cur,setCur]=useState('');
  const [n1,setN1]=useState('');
  const [n2,setN2]=useState('');
  const [err,setErr]=useState('');
  const [ok,setOk]=useState(false);
  const save=()=>{
    const pwds=JSON.parse(localStorage.getItem('manne_pwds')||'{}');
    const expected=pwds[user]||DEFAULT_PWD;
    if(cur!==expected){setErr('Current password is incorrect.');return;}
    if(n1.length<6){setErr('New password must be at least 6 characters.');return;}
    if(n1!==n2){setErr('New passwords do not match.');return;}
    pwds[user]=n1;
    localStorage.setItem('manne_pwds',JSON.stringify(pwds));
    setOk(true);setErr('');
  };
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:14,padding:'28px',width:340,boxShadow:'0 10px 40px rgba(0,0,0,0.2)'}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:18}}>Change password</div>
        {ok
          ? <div style={{background:C.greenLt,color:C.green,padding:'12px',borderRadius:8,marginBottom:16,fontWeight:500}}>Password updated successfully!</div>
          : <>
              {[['Current password',cur,setCur],['New password',n1,setN1],['Confirm new password',n2,setN2]].map(([lbl,val,set])=>(
                <div key={lbl} style={{marginBottom:12}}>
                  <label style={{fontSize:12,fontWeight:600,color:C.text2,display:'block',marginBottom:5}}>{lbl}</label>
                  <input type="password" value={val} onChange={e=>{set(e.target.value);setErr('');}} style={sharedInp}/>
                </div>
              ))}
              {err&&<div style={{background:C.redLt,color:C.red,fontSize:13,padding:'10px',borderRadius:8,marginBottom:12}}>{err}</div>}
            </>
        }
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 16px',cursor:'pointer',fontSize:13,background:'#fff'}}>Close</button>
          {!ok&&<button onClick={save} style={{background:C.primary,color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer',fontSize:13,fontWeight:600}}>Update</button>}
        </div>
      </div>
    </div>
  );
}

// ── DONUT ──────────────────────────────────────────────────
function Donut({slices,centerTop,centerBot,size=260,outerR,innerR,labels=true}) {
  const r=outerR||size*0.42, ri=innerR||size*0.26, cx=size/2, cy=size/2;
  const tot=slices.reduce((s,x)=>s+x.value,0)||1;
  const isFull=slices.filter(s=>s.value>0).length===1;
  let cum=0;
  const paths=slices.map(s=>{
    if(isFull&&s.value===tot) return {full:true,...s};
    if(!s.value) return null;
    const st=(cum/tot)*Math.PI*2-Math.PI/2; cum+=s.value;
    const en=(cum/tot)*Math.PI*2-Math.PI/2; const mid=(st+en)/2;
    const p=(a,rad)=>[cx+rad*Math.cos(a),cy+rad*Math.sin(a)];
    const[x1,y1]=p(st,r),[x2,y2]=p(en,r),[ix1,iy1]=p(st,ri),[ix2,iy2]=p(en,ri);
    const lg=s.value/tot>0.5?1:0;
    const[lx,ly]=p(mid,r+24);
    return {d:`M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} L${ix2},${iy2} A${ri},${ri} 0 ${lg},0 ${ix1},${iy1}Z`,
      color:s.color,value:s.value,lx,ly,mid,pct:Math.round(s.value/tot*100)};
  }).filter(Boolean);
  const fmt=v=>v>=1000000?`$${(v/1000000).toFixed(1)}M`:v>=10000?`$${(v/1000).toFixed(0)}K`:`$${v.toLocaleString()}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:'visible'}}>
      {paths.map((p,i)=>p.full
        ?<g key={i}><circle cx={cx} cy={cy} r={r} fill={p.color}/><circle cx={cx} cy={cy} r={ri} fill={C.card}/></g>
        :<g key={i}>
          <path d={p.d} fill={p.color} stroke={C.card} strokeWidth={3}/>
          {labels&&p.pct>=6&&<>
            <line x1={cx+(r+3)*Math.cos(p.mid)} y1={cy+(r+3)*Math.sin(p.mid)} x2={cx+(r+16)*Math.cos(p.mid)} y2={cy+(r+16)*Math.sin(p.mid)} stroke={p.color} strokeWidth={1.5}/>
            <text x={p.lx} y={p.ly-3} textAnchor="middle" style={{fontSize:11,fontWeight:700,fill:p.color}}>{fmt(p.value)}</text>
            <text x={p.lx} y={p.ly+10} textAnchor="middle" style={{fontSize:9,fill:C.text3}}>{p.pct}%</text>
          </>}
        </g>
      )}
      {centerTop&&<text x={cx} y={cy-6} textAnchor="middle" style={{fontSize:size*0.1,fontWeight:800,fill:C.text}}>{centerTop}</text>}
      {centerBot&&<text x={cx} y={cy+size*0.07} textAnchor="middle" style={{fontSize:size*0.045,fill:C.text2}}>{centerBot}</text>}
    </svg>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────
function Dashboard({currentUser, onLogout}) {
  const [tenants,setTenants]=useState(genTenants);
  const [payments,setPayments]=useState({});
  const [repairs,setRepairs]=useState({});
  const [buildings,setBuildings]=useState(INIT_BUILDINGS);
  const [propDocs,setPropDocs]=useState({});
  const [tenantDocs,setTenantDocs]=useState({});
  const [view,setView]=useState('dashboard');
  const [selMonth,setSelMonth]=useState(CM);
  const [selYear,setSelYear]=useState(CY);
  const [panel,setPanel]=useState(null);
  const [filterSt,setFilterSt]=useState('all');
  const [searchQ,setSearchQ]=useState('');
  const [filterBld,setFilterBld]=useState(0);
  const [repForm,setRepForm]=useState({tid:'',cat:'Plumbing',text:''});
  const [showChangePwd,setShowChangePwd]=useState(false);

  const mk=mkKey(selMonth,selYear);
  const getPay=tid=>payments[mk]?.[tid]||{status:'unpaid',amount:0,date:''};

  const totalExp=tenants.reduce((s,t)=>s+t.rent,0);
  const totalColl=tenants.reduce((s,t)=>{const p=getPay(t.id);return s+(p.status==='paid'?t.rent:p.status==='partial'?Number(p.amount)||0:0);},0);
  const paidCnt=tenants.filter(t=>getPay(t.id).status==='paid').length;
  const partCnt=tenants.filter(t=>getPay(t.id).status==='partial').length;
  const unpaidCnt=tenants.filter(t=>getPay(t.id).status==='unpaid').length;
  const progress=Math.round((totalColl/totalExp)*100)||0;
  const soon=tenants.filter(t=>{const d=new Date(t.leaseEnd),diff=(d-now)/86400000;return diff>=0&&diff<=60;});
  const allRepairs=Object.entries(repairs).flatMap(([tid,list])=>list.map(r=>({...r,tenantId:Number(tid),tenant:tenants.find(t=>t.id===Number(tid))})));
  const openRep=allRepairs.filter(r=>r.status==='open');

  const setPay=(tid,status,amt,date)=>{
    const t=tenants.find(x=>x.id===tid);
    const val=status==='paid'?{status:'paid',amount:t.rent,date:now.toISOString().slice(0,10)}
      :status==='partial'?{status:'partial',amount:Number(amt),date:date||now.toISOString().slice(0,10)}
      :{status:'unpaid',amount:0,date:''};
    setPayments(p=>({...p,[mk]:{...p[mk],[tid]:val}}));
  };
  const addRepair=(tid,text,cat)=>{if(!text.trim())return;setRepairs(prev=>({...prev,[tid]:[...(prev[tid]||[]),{id:Date.now(),text:text.trim(),cat:cat||'Other',date:now.toISOString().slice(0,10),status:'open'}]}));};
  const toggleRep=(tid,iid)=>setRepairs(prev=>({...prev,[tid]:prev[tid].map(i=>i.id===iid?{...i,status:i.status==='open'?'resolved':'open'}:i)}));
  const upDoc=(setter,id,files)=>{const docs=Array.from(files).map(f=>({name:f.name,url:URL.createObjectURL(f),date:now.toISOString().slice(0,10)}));setter(prev=>({...prev,[id]:[...(prev[id]||[]),...docs]}));};
  const rmDoc=(setter,id,idx)=>setter(prev=>({...prev,[id]:prev[id].filter((_,i)=>i!==idx)}));

  const exportCSV=()=>{
    const rows=[['Building','Unit','Tenant','Rent','Status','Amount Paid','Date','Lease End']];
    tenants.forEach(t=>{const p=getPay(t.id);const b=buildings.find(x=>x.id===t.buildingId);rows.push([b?.name,t.unit,t.name,t.rent,p.status,p.amount||'',p.date,t.leaseEnd]);});
    const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(rows.map(r=>r.join(',')).join('\n'));a.download=`rent_${mk}.csv`;a.click();
  };

  const filtered=tenants.filter(t=>{const p=getPay(t.id);return (filterSt==='all'||p.status===filterSt)&&(filterBld===0||t.buildingId===filterBld)&&(t.name.toLowerCase().includes(searchQ.toLowerCase())||t.unit.includes(searchQ));});

  const fmt=v=>v>=1000000?`$${(v/1000000).toFixed(1)}M`:v>=10000?`$${(v/1000).toFixed(0)}K`:`$${v.toLocaleString()}`;
  const sc=s=>s==='paid'?C.green:s==='partial'?C.amber:C.red;
  const sbg=s=>s==='paid'?C.greenLt:s==='partial'?C.amberLt:C.redLt;
  const badge=s=>({display:'inline-block',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,background:sbg(s),color:sc(s)});
  const btn=(variant)=>{
    const base={borderRadius:8,padding:'7px 14px',cursor:'pointer',fontSize:13,fontWeight:500,border:'1px solid transparent',whiteSpace:'nowrap'};
    if(variant==='primary') return {...base,background:C.primary,color:'#fff'};
    if(variant==='green')   return {...base,background:C.green,color:'#fff'};
    if(variant==='red')     return {...base,background:'#fff',color:C.red,border:`1px solid ${C.border}`};
    return {...base,background:'#fff',color:C.text,border:`1px solid ${C.border}`};
  };
  const smbtn=(c)=>({borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:12,fontWeight:500,background:'#fff',color:c||C.text2,border:`1px solid ${C.border}`,whiteSpace:'nowrap'});
  const inp={...sharedInp};
  const card={background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px',boxShadow:'0 1px 2px rgba(0,0,0,0.04)'};

  // ── INLINE PANELS ──
  const PanelEditTenant=({data})=>{
    const [f,setF]=useState({...data});
    const tDocs=tenantDocs[data.id]||[];
    const fileRef=useRef();
    return (
      <div style={{...card,marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.borderLt}`}}>
          <span style={{fontWeight:600,fontSize:16}}>Edit tenant · Unit {f.unit}</span>
          <button style={btn()} onClick={()=>setPanel(null)}>Close</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[['name','Name','text'],['phone','Phone','text'],['email','Email','email'],['rent','Monthly rent ($)','number'],['leaseEnd','Lease end date','date']].map(([k,lbl,type])=>(
            <div key={k}>
              <label style={{fontSize:12,color:C.text2,display:'block',marginBottom:5,fontWeight:500}}>{lbl}</label>
              <input type={type} value={f[k]||''} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} style={inp}/>
            </div>
          ))}
          <div>
            <label style={{fontSize:12,color:C.text2,display:'block',marginBottom:5,fontWeight:500}}>Building</label>
            <select value={f.buildingId} onChange={e=>setF(x=>({...x,buildingId:Number(e.target.value)}))} style={inp}>
              {buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${C.borderLt}`}}>
          <label style={{fontSize:13,fontWeight:600,display:'block',marginBottom:10}}>Payment · {MONTHS[selMonth]} {selYear}</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <button style={btn('green')} onClick={()=>{setPay(f.id,'paid');setPanel(null);}}>Mark paid</button>
            <button style={btn('red')} onClick={()=>{setPay(f.id,'unpaid');setPanel(null);}}>Mark unpaid</button>
            <input type="number" placeholder="Partial $" id="pa" style={{...inp,width:110}}/>
            <input type="date" defaultValue={now.toISOString().slice(0,10)} id="pd" style={{...inp,width:150}}/>
            <button style={btn()} onClick={()=>{const a=document.getElementById('pa').value,d=document.getElementById('pd').value;if(a){setPay(f.id,'partial',a,d);setPanel(null);}}}>Save partial</button>
          </div>
        </div>
        <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${C.borderLt}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <label style={{fontSize:13,fontWeight:600}}>Lease & documents</label>
            <button style={btn()} onClick={()=>fileRef.current.click()}>Upload file</button>
          </div>
          <input ref={fileRef} type="file" multiple style={{display:'none'}} onChange={e=>{upDoc(setTenantDocs,data.id,e.target.files);e.target.value='';}}/>
          {tDocs.length===0&&<div style={{fontSize:13,color:C.text3}}>No documents uploaded.</div>}
          {tDocs.map((d,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:C.bg,borderRadius:8,marginBottom:6}}>
              <a href={d.url} download={d.name} style={{fontSize:13,color:C.primary,textDecoration:'none',fontWeight:500}}>📄 {d.name}</a>
              <button style={smbtn(C.red)} onClick={()=>rmDoc(setTenantDocs,data.id,i)}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
          <button style={btn()} onClick={()=>setPanel(null)}>Cancel</button>
          <button style={btn('primary')} onClick={()=>{setTenants(prev=>prev.map(t=>t.id===f.id?{...t,...f,rent:Number(f.rent),buildingId:Number(f.buildingId)}:t));setPanel(null);}}>Save changes</button>
        </div>
      </div>
    );
  };

  const PanelEditBuilding=({data})=>{
    const isNew=!data.id;
    const [f,setF]=useState({...data});
    const save=()=>{
      if(!f.name?.trim()||!f.address?.trim())return alert('Fill in name and address.');
      if(isNew){const id=Math.max(0,...buildings.map(b=>b.id))+1;setBuildings(p=>[...p,{id,name:f.name.trim(),address:f.address.trim()}]);}
      else setBuildings(p=>p.map(b=>b.id===f.id?{...b,...f}:b));
      setPanel(null);
    };
    return (
      <div style={{...card,marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.borderLt}`}}>
          <span style={{fontWeight:600,fontSize:16}}>{isNew?'Add building':'Edit building'}</span>
          <button style={btn()} onClick={()=>setPanel(null)}>Close</button>
        </div>
        {[['name','Building name'],['address','Address']].map(([k,lbl])=>(
          <div key={k} style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.text2,display:'block',marginBottom:5,fontWeight:500}}>{lbl}</label>
            <input value={f[k]||''} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} style={inp}/>
          </div>
        ))}
        <div style={{display:'flex',gap:8,justifyContent:'space-between'}}>
          <div>{!isNew&&<button style={btn('red')} onClick={()=>{if(window.confirm('Delete?')){setBuildings(p=>p.filter(b=>b.id!==f.id));setPanel(null);}}}>Delete</button>}</div>
          <div style={{display:'flex',gap:8}}>
            <button style={btn()} onClick={()=>setPanel(null)}>Cancel</button>
            <button style={btn('primary')} onClick={save}>{isNew?'Add':'Save'}</button>
          </div>
        </div>
      </div>
    );
  };

  const NAV=[['dashboard','Dashboard','▦'],['tenants','Tenants','◫'],['repairs','Repairs','⚙'],['documents','Documents','▤']];

  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',color:C.text,background:C.bg,minHeight:'100vh',display:'flex'}}>
      {showChangePwd&&<ChangePasswordModal user={currentUser} onClose={()=>setShowChangePwd(false)}/>}

      {/* SIDEBAR */}
      <div style={{width:220,background:C.sidebar,color:'#fff',flexShrink:0,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'24px 24px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:20,fontWeight:700,letterSpacing:-0.5}}>Manne</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:2}}>Property Manager</div>
        </div>
        <div style={{padding:'12px 0',flex:1}}>
          {NAV.map(([v,label,icon])=>(
            <button key={v} onClick={()=>{setView(v);setPanel(null);}} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'11px 24px',border:'none',background:view===v?'rgba(255,255,255,0.1)':'transparent',color:view===v?'#fff':'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:14,fontWeight:view===v?600:400,borderLeft:view===v?`3px solid ${C.primary}`:'3px solid transparent',textAlign:'left'}}>
              <span style={{fontSize:16,width:18}}>{icon}</span>{label}
            </button>
          ))}
        </div>
        <div style={{padding:'20px 24px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:2,textTransform:'uppercase',letterSpacing:.5}}>Signed in as</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:12,textTransform:'capitalize'}}>{currentUser}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:6}}>Collection this month</div>
          <div style={{fontSize:26,fontWeight:700,color:progress>=80?'#34D399':progress>=50?'#FCD34D':'#F87171'}}>{progress}%</div>
          <div style={{height:4,borderRadius:2,background:'rgba(255,255,255,0.1)',margin:'8px 0 16px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,background:progress>=80?'#34D399':progress>=50?'#FCD34D':'#F87171',borderRadius:2}}/>
          </div>
          <button onClick={()=>setShowChangePwd(true)} style={{width:'100%',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,padding:'7px',fontSize:12,cursor:'pointer',marginBottom:6}}>Change password</button>
          <button onClick={onLogout} style={{width:'100%',background:'rgba(220,38,38,0.15)',color:'#FCA5A5',border:'1px solid rgba(220,38,38,0.2)',borderRadius:7,padding:'7px',fontSize:12,cursor:'pointer'}}>Sign out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{background:'#fff',borderBottom:`1px solid ${C.border}`,padding:'16px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:700}}>{NAV.find(n=>n[0]===view)?.[1]}</div>
            <div style={{fontSize:13,color:C.text2}}>{tenants.length} units · {buildings.length} buildings</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))} style={{...inp,width:'auto',padding:'8px 10px'}}>
              {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
            <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...inp,width:'auto',padding:'8px 10px'}}>
              {[CY-1,CY,CY+1].map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <button style={btn('primary')} onClick={exportCSV}>Export CSV</button>
          </div>
        </div>

        <div style={{padding:'28px 32px',maxWidth:1100}}>
          {panel?.type==='editTenant'   && <PanelEditTenant   data={panel.data}/>}
          {panel?.type==='editBuilding' && <PanelEditBuilding data={panel.data}/>}

          {/* DASHBOARD */}
          {view==='dashboard'&&<>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:24}}>
              {[['Expected rent','$'+totalExp.toLocaleString(),C.text],['Collected','$'+totalColl.toLocaleString(),C.green],['Pending','$'+(totalExp-totalColl).toLocaleString(),C.red],['Open repairs',openRep.length,C.amber]].map(([l,v,c])=>(
                <div key={l} style={{...card,padding:'18px 20px'}}>
                  <div style={{fontSize:13,color:C.text2,marginBottom:8,fontWeight:500}}>{l}</div>
                  <div style={{fontSize:26,fontWeight:700,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{...card,marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:14,fontWeight:600}}>Collection progress · {MONTHS[selMonth]} {selYear}</span>
                <span style={{fontSize:13,color:C.text2}}>{paidCnt} paid · {partCnt} partial · {unpaidCnt} unpaid</span>
              </div>
              <div style={{height:12,borderRadius:6,background:C.borderLt,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${progress}%`,background:`linear-gradient(90deg,${C.green},#10B981)`,borderRadius:6,transition:'width .4s'}}/>
              </div>
            </div>
            <div style={{...card,marginBottom:24,display:'flex',gap:24,flexWrap:'wrap',alignItems:'center',justifyContent:'center'}}>
              <Donut size={280}
                slices={[...buildings.map((b,i)=>({value:tenants.filter(t=>t.buildingId===b.id).reduce((s,t)=>{const p=getPay(t.id);return s+(p.status==='paid'?t.rent:p.status==='partial'?Number(p.amount)||0:0);},0),color:BCOLORS[i%BCOLORS.length]})),{value:totalExp-totalColl,color:'#E5E7EB'}]}
                centerTop={fmt(totalColl)} centerBot="Collected"/>
              <div style={{minWidth:200}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:14}}>Rent by building</div>
                {buildings.map((b,i)=>{
                  const v=tenants.filter(t=>t.buildingId===b.id).reduce((s,t)=>{const p=getPay(t.id);return s+(p.status==='paid'?t.rent:p.status==='partial'?Number(p.amount)||0:0);},0);
                  return (
                    <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:10,height:10,borderRadius:3,background:BCOLORS[i%BCOLORS.length]}}/>
                        <span style={{fontSize:13}}>{b.name}</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:600}}>${v.toLocaleString()}</span>
                    </div>
                  );
                })}
                <div style={{display:'flex',justifyContent:'space-between',marginTop:8,paddingTop:10,borderTop:`1px solid ${C.borderLt}`}}>
                  <span style={{fontSize:13,color:C.text2}}>Pending</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.red}}>${(totalExp-totalColl).toLocaleString()}</span>
                </div>
              </div>
            </div>
            {soon.length>0&&(
              <div style={{...card,marginBottom:24,background:C.amberLt,borderColor:'#FDE68A'}}>
                <div style={{fontWeight:600,fontSize:14,color:C.amber,marginBottom:10}}>⚠ Leases expiring within 60 days ({soon.length})</div>
                {soon.map(t=><div key={t.id} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'4px 0',color:'#92400E'}}><span>Unit {t.unit} — {t.name}</span><span>{t.leaseEnd}</span></div>)}
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <span style={{fontSize:16,fontWeight:700}}>Buildings</span>
              <button style={btn('primary')} onClick={()=>setPanel({type:'editBuilding',data:{name:'',address:''}})}>+ Add building</button>
            </div>
            {buildings.map((b,bi)=>{
              const bT=tenants.filter(t=>t.buildingId===b.id);
              const bE=bT.reduce((s,t)=>s+t.rent,0);
              const bC=bT.reduce((s,t)=>{const p=getPay(t.id);return s+(p.status==='paid'?t.rent:p.status==='partial'?Number(p.amount)||0:0);},0);
              const bP=Math.round((bC/bE)*100)||0;
              const col=BCOLORS[bi%BCOLORS.length];
              return (
                <div key={b.id} style={{...card,marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <div style={{width:40,height:40,borderRadius:10,background:col,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:16,flexShrink:0}}>{b.name[0]}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:15}}>{b.name}</div>
                        <div style={{fontSize:13,color:C.text2}}>{b.address} · {bT.length} units</div>
                      </div>
                    </div>
                    <button style={smbtn(C.primary)} onClick={()=>setPanel({type:'editBuilding',data:b})}>Edit</button>
                  </div>
                  <div style={{display:'flex',gap:24,fontSize:13,marginBottom:10,flexWrap:'wrap'}}>
                    <span style={{color:C.text2}}>Expected <strong style={{color:C.text}}>${bE.toLocaleString()}</strong></span>
                    <span style={{color:C.text2}}>Collected <strong style={{color:C.green}}>${bC.toLocaleString()}</strong></span>
                    <span style={{color:C.text2}}>Pending <strong style={{color:C.red}}>${(bE-bC).toLocaleString()}</strong></span>
                  </div>
                  <div style={{height:8,borderRadius:4,background:C.borderLt,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${bP}%`,background:col,borderRadius:4}}/>
                  </div>
                </div>
              );
            })}
          </>}

          {/* TENANTS */}
          {view==='tenants'&&<>
            <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
              <input placeholder="🔍 Search unit or name…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{...inp,width:220}}/>
              <select value={filterBld} onChange={e=>setFilterBld(Number(e.target.value))} style={{...inp,width:'auto'}}>
                <option value={0}>All buildings</option>
                {buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <div style={{display:'flex',gap:6,background:'#fff',padding:4,borderRadius:10,border:`1px solid ${C.border}`}}>
                {['all','paid','partial','unpaid'].map(s=>(
                  <button key={s} onClick={()=>setFilterSt(s)} style={{border:'none',borderRadius:7,padding:'6px 12px',cursor:'pointer',fontSize:13,fontWeight:filterSt===s?600:400,background:filterSt===s?C.primaryLt:'transparent',color:filterSt===s?C.primary:C.text2}}>{s[0].toUpperCase()+s.slice(1)}</button>
                ))}
              </div>
            </div>
            {buildings.filter(b=>filterBld===0||b.id===filterBld).map((b,bi)=>{
              const bF=filtered.filter(t=>t.buildingId===b.id);
              if(!bF.length)return null;
              const col=BCOLORS[buildings.findIndex(x=>x.id===b.id)%BCOLORS.length];
              return (
                <div key={b.id} style={{...card,marginBottom:20,padding:0,overflow:'hidden'}}>
                  <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.borderLt}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:C.bg}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:col}}/>
                      <span style={{fontWeight:600,fontSize:14}}>{b.name}</span>
                      <span style={{fontSize:12,color:C.text3}}>{b.address}</span>
                    </div>
                    <span style={{fontSize:12,color:C.text2}}>{bF.length} units</span>
                  </div>
                  {bF.map((t,idx)=>{const p=getPay(t.id);const tDocs=tenantDocs[t.id]||[];return(
                    <div key={t.id} style={{padding:'14px 20px',borderBottom:idx<bF.length-1?`1px solid ${C.borderLt}`:'none'}}>
                      <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
                        <div style={{minWidth:100}}>
                          <div style={{fontSize:11,color:C.text3,fontWeight:500}}>UNIT {t.unit}</div>
                          <div style={{fontSize:15,fontWeight:600}}>{t.name}</div>
                          <div style={{fontSize:13,color:C.text2}}>${t.rent}/mo</div>
                        </div>
                        <div style={{minWidth:150,fontSize:12,color:C.text2,lineHeight:1.7}}>
                          <div>{t.email}</div><div>{t.phone}</div><div>Lease ends {t.leaseEnd}</div>
                        </div>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',marginLeft:'auto'}}>
                          <span style={badge(p.status)}>{p.status==='paid'?'Paid':p.status==='partial'?`Partial $${p.amount}`:'Unpaid'}</span>
                          <button style={smbtn(C.green)} onClick={()=>setPay(t.id,'paid')}>Paid</button>
                          <button style={smbtn(C.red)} onClick={()=>setPay(t.id,'unpaid')}>Unpaid</button>
                          <button style={smbtn()} onClick={()=>setPanel({type:'editTenant',data:t})}>Edit</button>
                        </div>
                      </div>
                      <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                        <span style={{fontSize:11,color:C.text3,fontWeight:500}}>DOCS</span>
                        {tDocs.length===0&&<span style={{fontSize:12,color:C.text3}}>None</span>}
                        {tDocs.map((d,i)=><a key={i} href={d.url} download={d.name} style={{fontSize:12,background:C.primaryLt,borderRadius:6,padding:'3px 10px',color:C.primary,textDecoration:'none',fontWeight:500}}>📄 {d.name}</a>)}
                        <label style={{...smbtn(C.primary),cursor:'pointer'}}>+ Upload<input type="file" multiple style={{display:'none'}} onChange={e=>{upDoc(setTenantDocs,t.id,e.target.files);e.target.value='';}}/></label>
                      </div>
                    </div>
                  );})}
                </div>
              );
            })}
          </>}

          {/* REPAIRS */}
          {view==='repairs'&&(()=>{
            const openN=openRep.length, resN=allRepairs.filter(r=>r.status==='resolved').length;
            const byCat=REPAIR_CATS.map(c=>({label:c,value:allRepairs.filter(r=>(r.cat||'Other')===c).length,color:CAT_COLORS[c]})).filter(x=>x.value>0);
            return <>
              <div style={{...card,marginBottom:24}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Log a new repair</div>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <select value={repForm.tid} onChange={e=>setRepForm(f=>({...f,tid:e.target.value}))} style={{...inp,flex:1,minWidth:180}}>
                    <option value="">Select unit…</option>
                    {buildings.map(b=><optgroup key={b.id} label={b.name}>{tenants.filter(t=>t.buildingId===b.id).map(t=><option key={t.id} value={t.id}>Unit {t.unit} — {t.name}</option>)}</optgroup>)}
                  </select>
                  <select value={repForm.cat} onChange={e=>setRepForm(f=>({...f,cat:e.target.value}))} style={{...inp,width:150}}>
                    {REPAIR_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={repForm.text} onChange={e=>setRepForm(f=>({...f,text:e.target.value}))} placeholder="Describe the repair…" style={{...inp,flex:2,minWidth:200}}
                    onKeyDown={e=>{if(e.key==='Enter'&&repForm.tid&&repForm.text.trim()){addRepair(Number(repForm.tid),repForm.text,repForm.cat);setRepForm({tid:'',cat:'Plumbing',text:''});}}}/>
                  <button style={btn('primary')} onClick={()=>{if(repForm.tid&&repForm.text.trim()){addRepair(Number(repForm.tid),repForm.text,repForm.cat);setRepForm({tid:'',cat:'Plumbing',text:''});}}}>Add repair</button>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
                <div style={card}>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:8}}>Status</div>
                  <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                    <Donut size={160} slices={[{value:openN,color:C.red},{value:resN,color:C.green}]} centerTop={allRepairs.length} centerBot="total" labels={false}/>
                    <div>{[['Open',openN,C.red],['Resolved',resN,C.green]].map(([l,v,c])=>(
                      <div key={l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                        <div style={{width:10,height:10,borderRadius:3,background:c}}/>
                        <span style={{fontSize:13,minWidth:70}}>{l}</span>
                        <span style={{fontSize:14,fontWeight:700,color:c}}>{v}</span>
                      </div>
                    ))}</div>
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:8}}>By category</div>
                  <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                    <Donut size={160} slices={byCat.length?byCat:[{value:1,color:'#E5E7EB'}]} centerTop={allRepairs.length} centerBot="repairs" labels={false}/>
                    <div>
                      {byCat.length===0&&<span style={{fontSize:13,color:C.text3}}>No repairs yet</span>}
                      {byCat.map(c=>(
                        <div key={c.label} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                          <div style={{width:10,height:10,borderRadius:3,background:c.color}}/>
                          <span style={{fontSize:13,minWidth:75}}>{c.label}</span>
                          <span style={{fontSize:13,fontWeight:600,color:c.color}}>{c.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>All repairs · {openRep.length} open</div>
              <div style={{...card,padding:0,overflow:'hidden'}}>
                {allRepairs.length===0&&<div style={{padding:'24px',color:C.text3,fontSize:14,textAlign:'center'}}>No repairs logged yet.</div>}
                {[...allRepairs].sort((a,b)=>a.status==='open'?-1:1).map((r,idx,arr)=>(
                  <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'14px 20px',borderBottom:idx<arr.length-1?`1px solid ${C.borderLt}`:'none',flexWrap:'wrap'}}>
                    <div style={{flex:1,minWidth:160}}>
                      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:3,flexWrap:'wrap'}}>
                        <span style={{background:CAT_COLORS[r.cat]||'#888',color:'#fff',borderRadius:5,padding:'2px 9px',fontSize:11,fontWeight:600}}>{r.cat||'Other'}</span>
                        <span style={{fontSize:12,color:C.text3}}>{buildings.find(b=>b.id===r.tenant?.buildingId)?.name} · Unit {r.tenant?.unit} — {r.tenant?.name}</span>
                      </div>
                      <div style={{fontSize:14,textDecoration:r.status==='resolved'?'line-through':'none',color:r.status==='resolved'?C.text3:C.text}}>{r.text}</div>
                    </div>
                    <span style={{fontSize:12,color:C.text3}}>{r.date}</span>
                    <span style={badge(r.status==='open'?'partial':'paid')}>{r.status}</span>
                    <button style={smbtn(r.status==='open'?C.green:C.text2)} onClick={()=>toggleRep(r.tenantId,r.id)}>{r.status==='open'?'Resolve':'Reopen'}</button>
                  </div>
                ))}
              </div>
            </>;
          })()}

          {/* DOCUMENTS */}
          {view==='documents'&&<>
            <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Property documents</div>
            <div style={{fontSize:13,color:C.text2,marginBottom:20}}>Lease agreements, insurance, permits and other building files.</div>
            {buildings.map((b,bi)=>{
              const docs=propDocs[b.id]||[];
              const col=BCOLORS[bi%BCOLORS.length];
              return (
                <div key={b.id} style={{...card,marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <div style={{width:36,height:36,borderRadius:9,background:col,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,flexShrink:0}}>{b.name[0]}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{b.name}</div>
                        <div style={{fontSize:12,color:C.text2}}>{b.address}</div>
                      </div>
                    </div>
                    <label style={{...btn('primary'),cursor:'pointer'}}>+ Upload<input type="file" multiple style={{display:'none'}} onChange={e=>{upDoc(setPropDocs,b.id,e.target.files);e.target.value='';}}/></label>
                  </div>
                  {docs.length===0&&<div style={{fontSize:13,color:C.text3,padding:'12px',background:C.bg,borderRadius:8,textAlign:'center'}}>No documents uploaded yet.</div>}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10}}>
                    {docs.map((d,i)=>(
                      <div key={i} style={{background:C.bg,borderRadius:10,padding:'12px 14px',display:'flex',gap:10,alignItems:'center'}}>
                        <span style={{fontSize:26}}>📄</span>
                        <div style={{flex:1,minWidth:0}}>
                          <a href={d.url} download={d.name} style={{fontSize:13,color:C.primary,textDecoration:'none',fontWeight:600,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.name}</a>
                          <div style={{fontSize:11,color:C.text3}}>{d.date}</div>
                        </div>
                        <button style={smbtn(C.red)} onClick={()=>rmDoc(setPropDocs,b.id,i)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────
export default function App() {
  const [currentUser,setCurrentUser]=useState(()=>{
    try{const s=JSON.parse(localStorage.getItem('manne_auth')||'null');return s?.user||null;}catch{return null;}
  });
  const logout=()=>{localStorage.removeItem('manne_auth');setCurrentUser(null);};
  if(!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;
  return <Dashboard currentUser={currentUser} onLogout={logout}/>;
}