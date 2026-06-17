import { useState, useRef } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const now = new Date();
const CM = now.getMonth();
const CY = now.getFullYear();
const mkKey = (m,y) => y + "-" + String(m+1).padStart(2,"0");

const USERS = ["jayant","pooja","aarna","thulasi","kkram"];
const DEFAULT_PWD = "rent@blr";

const C = {
  bg:"#F7F8FA", card:"#FFFFFF", border:"#E8EAED", borderLt:"#F0F1F3",
  text:"#1A1D23", text2:"#6B7280", text3:"#9CA3AF",
  primary:"#4F46E5", primaryLt:"#EEF2FF",
  green:"#059669", greenLt:"#ECFDF5", red:"#DC2626", redLt:"#FEF2F2",
  amber:"#D97706", amberLt:"#FFFBEB", sidebar:"#1E2330",
};

const BCOLORS = ["#4F46E5","#059669","#0891B2","#9333EA","#DC2626","#D97706","#DB2777","#0D9488"];
const CAT_COLORS = {Plumbing:"#0891B2",Electrician:"#D97706",Security:"#9333EA",BBMP:"#DC2626",BESCOM:"#EA580C",BWSSB:"#059669",Other:"#6B7280"};
const REPAIR_CATS = ["Plumbing","Electrician","Security","BBMP","BESCOM","BWSSB","Other"];
const CURRENCIES = [
  {code:"INR", symbol:"\u20B9", label:"Indian Rupee (INR)"},
  {code:"USD", symbol:"$",      label:"US Dollar (USD)"},
  {code:"GBP", symbol:"\u00A3", label:"British Pound (GBP)"},
  {code:"EUR", symbol:"\u20AC", label:"Euro (EUR)"},
];
const getCurrency = (code) => CURRENCIES.find(c => c.code === code) || CURRENCIES[0];

const INIT_BUILDINGS = [
  {id:1, name:"Bangalore Residences", address:"12 MG Road, Bangalore, Karnataka",     currency:"INR"},
  {id:2, name:"Mumbai Heights",       address:"45 Marine Drive, Mumbai, Maharashtra",  currency:"INR"},
  {id:3, name:"Chennai Villas",       address:"8 Anna Salai, Chennai, Tamil Nadu",     currency:"INR"},
  {id:4, name:"Sunset Apartments",    address:"12 Sunset Blvd, Miami FL, USA",         currency:"USD"},
];

const genTenants = () => Array.from({length:40}, (_,i) => {
  const bi = Math.floor(i/10);
  const bld = INIT_BUILDINGS[bi];
  const india = bld.currency === "INR";
  const rents = india
    ? [8000,9500,10000,11000,12000,12500,13000,14000,15000]
    : [800,950,1000,1100,1200,1250,1300,1400,1500];
  const leaseEnd = new Date(CY+(i%2===0?1:0),(i*2+3)%12,1);
  const phone = india ? ("+91 98"+String(1000+i*7).slice(-4)) : ("+1 55"+String(1000+i*7).slice(-4));
  return {
    id:i+1, unit:String(bi+1)+"0"+String((i%10)+1),
    name:"Tenant "+(i+1), phone,
    email:"tenant"+(i+1)+"@email.com",
    rent:rents[i%9],
    leaseEnd:leaseEnd.toISOString().slice(0,10),
    buildingId:bld.id
  };
});

const sharedInp = {
  border:"1px solid #E8EAED", borderRadius:8, padding:"9px 12px",
  fontSize:14, background:"#fff", color:"#1A1D23",
  width:"100%", boxSizing:"border-box", outline:"none"
};

function LoginScreen({onLogin}) {
  const [user,setUser] = useState("");
  const [pwd,setPwd]   = useState("");
  const [err,setErr]   = useState("");
  const attempt = () => {
    const u = user.trim().toLowerCase();
    if (!USERS.includes(u)) { setErr("Username not found."); return; }
    const pwds = JSON.parse(localStorage.getItem("manne_pwds")||"{}");
    if (pwd !== (pwds[u]||DEFAULT_PWD)) { setErr("Incorrect password."); return; }
    localStorage.setItem("manne_auth", JSON.stringify({user:u}));
    onLogin(u);
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1E2330,#2D3550)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:16,padding:"40px 36px",width:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:32,fontWeight:800,color:"#4F46E5"}}>Manne</div>
          <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>Property Manager</div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:"#6B7280",display:"block",marginBottom:6}}>Username</label>
          <input value={user} onChange={e=>{setUser(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Enter your username" style={sharedInp}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,fontWeight:600,color:"#6B7280",display:"block",marginBottom:6}}>Password</label>
          <input type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Enter your password" style={sharedInp}/>
        </div>
        {err && <div style={{background:"#FEF2F2",color:"#DC2626",fontSize:13,padding:"10px",borderRadius:8,marginBottom:14}}>{err}</div>}
        <button onClick={attempt} style={{width:"100%",background:"#4F46E5",color:"#fff",border:"none",borderRadius:8,padding:"12px",fontSize:15,fontWeight:600,cursor:"pointer"}}>Sign in</button>
      </div>
    </div>
  );
}

function ChangePwdModal({user,onClose}) {
  const [cur,setCur] = useState("");
  const [n1,setN1]   = useState("");
  const [n2,setN2]   = useState("");
  const [err,setErr] = useState("");
  const [ok,setOk]   = useState(false);
  const save = () => {
    const pwds = JSON.parse(localStorage.getItem("manne_pwds")||"{}");
    if (cur !== (pwds[user]||DEFAULT_PWD)) { setErr("Current password incorrect."); return; }
    if (n1.length < 6) { setErr("New password must be 6+ characters."); return; }
    if (n1 !== n2) { setErr("Passwords do not match."); return; }
    pwds[user] = n1;
    localStorage.setItem("manne_pwds", JSON.stringify(pwds));
    setOk(true);
  };
  const iStyle = {...sharedInp, marginTop:4};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:14,padding:28,width:340,boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:16}}>Change password</div>
        {ok
          ? <div style={{background:"#ECFDF5",color:"#059669",padding:12,borderRadius:8,marginBottom:16}}>Password updated!</div>
          : <div>
              {[["Current password",cur,setCur],["New password",n1,setN1],["Confirm new password",n2,setN2]].map(([lbl,val,set])=>(
                <div key={lbl} style={{marginBottom:12}}>
                  <label style={{fontSize:12,fontWeight:600,color:"#6B7280"}}>{lbl}</label>
                  <input type="password" value={val} onChange={e=>{set(e.target.value);setErr("");}} style={iStyle}/>
                </div>
              ))}
              {err && <div style={{background:"#FEF2F2",color:"#DC2626",fontSize:13,padding:10,borderRadius:8,marginBottom:12}}>{err}</div>}
            </div>
        }
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{border:"1px solid #E8EAED",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13}}>Close</button>
          {!ok && <button onClick={save} style={{background:"#4F46E5",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>Update</button>}
        </div>
      </div>
    </div>
  );
}

function Donut({slices,centerTop,centerBot,size}) {
  const sz = size||160;
  const r=sz*0.42, ri=sz*0.26, cx=sz/2, cy=sz/2;
  const tot = slices.reduce((s,x)=>s+x.value,0)||1;
  const single = slices.filter(s=>s.value>0).length===1;
  let cum=0;
  const paths = slices.map(s=>{
    if (!s.value) return null;
    if (single && s.value===tot) return {full:true, color:s.color};
    const st=(cum/tot)*Math.PI*2-Math.PI/2; cum+=s.value;
    const en=(cum/tot)*Math.PI*2-Math.PI/2;
    const c1s=Math.cos(st),s1s=Math.sin(st),c1e=Math.cos(en),s1e=Math.sin(en);
    const lg=s.value/tot>0.5?1:0;
    const d="M"+(cx+ri*c1s)+","+(cy+ri*s1s)+" L"+(cx+r*c1s)+","+(cy+r*s1s)+" A"+r+","+r+" 0 "+lg+",1 "+(cx+r*c1e)+","+(cy+r*s1e)+" L"+(cx+ri*c1e)+","+(cy+ri*s1e)+" A"+ri+","+ri+" 0 "+lg+",0 "+(cx+ri*c1s)+","+(cy+ri*s1s)+"Z";
    return {d, color:s.color};
  }).filter(Boolean);
  return (
    <svg width={sz} height={sz} viewBox={"0 0 "+sz+" "+sz}>
      {paths.map((p,i)=> p.full
        ? <g key={i}><circle cx={cx} cy={cy} r={r} fill={p.color}/><circle cx={cx} cy={cy} r={ri} fill="#fff"/></g>
        : <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth={2}/>
      )}
      {centerTop && <text x={cx} y={cy-2} textAnchor="middle" style={{fontSize:sz*0.13,fontWeight:"bold",fill:"#1A1D23"}}>{centerTop}</text>}
      {centerBot && <text x={cx} y={cy+sz*0.12} textAnchor="middle" style={{fontSize:sz*0.09,fill:"#6B7280"}}>{centerBot}</text>}
    </svg>
  );
}

function BarChart({buildings,tenants,getPay,fmtAmt,getBldCur}) {
  const data = buildings.map((b,i)=>{
    const bT = tenants.filter(t=>t.buildingId===b.id);
    const expected  = bT.reduce((s,t)=>s+t.rent,0);
    const collected = bT.reduce((s,t)=>{const p=getPay(t.id);return s+(p.status==="paid"?t.rent:p.status==="partial"?Number(p.amount)||0:0);},0);
    const pending   = expected - collected;
    const pct       = expected>0 ? Math.round((collected/expected)*100) : 0;
    return {b, expected, collected, pending, pct, color:BCOLORS[i%BCOLORS.length]};
  });
  const indiaData = data.filter(d=>d.b.currency==="INR");
  const usaData   = data.filter(d=>d.b.currency==="USD");
  return (
    <div style={{background:"#fff",border:"1px solid #E8EAED",borderRadius:12,padding:24,marginBottom:24}}>
      <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>Rent collection by property</div>
      <div style={{fontSize:13,color:"#6B7280",marginBottom:20}}>Expected vs Collected this month</div>
      {data.map(function(item) {
        const pctColor = item.pct>=80?"#059669":item.pct>=50?"#D97706":"#DC2626";
        return (
          <div key={item.b.id} style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:12,height:12,borderRadius:3,background:item.color}}/>
                <span style={{fontSize:14,fontWeight:600}}>{item.b.name}</span>
                <span style={{fontSize:11,background:"#EEF2FF",color:"#4F46E5",borderRadius:4,padding:"1px 7px",fontWeight:600}}>{getBldCur(item.b.id).code}</span>
              </div>
              <div style={{display:"flex",gap:12,fontSize:13,flexWrap:"wrap"}}>
                <span style={{color:"#6B7280"}}>Expected: <strong>{fmtAmt(item.expected,item.b.id)}</strong></span>
                <span style={{color:"#6B7280"}}>Collected: <strong style={{color:"#059669"}}>{fmtAmt(item.collected,item.b.id)}</strong></span>
                <span style={{color:"#6B7280"}}>Pending: <strong style={{color:"#DC2626"}}>{fmtAmt(item.pending,item.b.id)}</strong></span>
                <strong style={{color:pctColor}}>{item.pct}%</strong>
              </div>
            </div>
            <div style={{height:14,borderRadius:7,background:"#F0F1F3",overflow:"hidden"}}>
              <div style={{height:"100%",width:item.pct+"%",background:item.color,borderRadius:7,transition:"width .5s"}}/>
            </div>
          </div>
        );
      })}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:8,paddingTop:16,borderTop:"1px solid #F0F1F3"}}>
        {indiaData.length>0 && (
          <div style={{background:"#F7F8FA",borderRadius:10,padding:"12px 16px"}}>
            <div style={{fontSize:12,color:"#6B7280",marginBottom:8,fontWeight:600}}>India (\u20B9 INR)</div>
            {indiaData.map(function(d) {
              return (
                <div key={d.b.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{color:"#6B7280"}}>{d.b.name.split(" ")[0]}</span>
                  <span><strong style={{color:"#059669"}}>{fmtAmt(d.collected,d.b.id)}</strong><span style={{color:"#9CA3AF"}}> / {fmtAmt(d.expected,d.b.id)}</span></span>
                </div>
              );
            })}
          </div>
        )}
        {usaData.length>0 && (
          <div style={{background:"#F7F8FA",borderRadius:10,padding:"12px 16px"}}>
            <div style={{fontSize:12,color:"#6B7280",marginBottom:8,fontWeight:600}}>USA ($ USD)</div>
            {usaData.map(function(d) {
              return (
                <div key={d.b.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{color:"#6B7280"}}>{d.b.name.split(" ")[0]}</span>
                  <span><strong style={{color:"#059669"}}>{fmtAmt(d.collected,d.b.id)}</strong><span style={{color:"#9CA3AF"}}> / {fmtAmt(d.expected,d.b.id)}</span></span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({currentUser,onLogout}) {
  const [tenants,setTenants]     = useState(genTenants);
  const [payments,setPayments]   = useState({});
  const [repairs,setRepairs]     = useState({});
  const [buildings,setBuildings] = useState(INIT_BUILDINGS);
  const [propDocs,setPropDocs]   = useState({});
  const [tenantDocs,setTenantDocs] = useState({});
  const [view,setView]           = useState("dashboard");
  const [selMonth,setSelMonth]   = useState(CM);
  const [selYear,setSelYear]     = useState(CY);
  const [panel,setPanel]         = useState(null);
  const [filterSt,setFilterSt]   = useState("all");
  const [searchQ,setSearchQ]     = useState("");
  const [filterBld,setFilterBld] = useState(0);
  const [repForm,setRepForm]     = useState({tid:"",cat:"Plumbing",text:""});
  const [showPwd,setShowPwd]     = useState(false);

  const mk       = mkKey(selMonth,selYear);
  const getPay   = tid => payments[mk]?.[tid] || {status:"unpaid",amount:0,date:""};
  const getBldCur= bid => getCurrency(buildings.find(b=>b.id===bid)?.currency||"INR");
  const fmtAmt   = (v,bid) => {
    const {symbol,code} = getBldCur(bid);
    if (code==="INR") return v>=10000000?symbol+(v/10000000).toFixed(1)+"Cr":v>=100000?symbol+(v/100000).toFixed(1)+"L":v>=1000?symbol+(v/1000).toFixed(0)+"K":symbol+v.toLocaleString("en-IN");
    return v>=1000000?symbol+(v/1000000).toFixed(1)+"M":v>=1000?symbol+(v/1000).toFixed(0)+"K":symbol+v.toLocaleString();
  };

  const totalExp  = tenants.reduce((s,t)=>s+t.rent,0);
  const totalColl = tenants.reduce((s,t)=>{const p=getPay(t.id);return s+(p.status==="paid"?t.rent:p.status==="partial"?Number(p.amount)||0:0);},0);
  const paidCnt   = tenants.filter(t=>getPay(t.id).status==="paid").length;
  const partCnt   = tenants.filter(t=>getPay(t.id).status==="partial").length;
  const unpaidCnt = tenants.filter(t=>getPay(t.id).status==="unpaid").length;
  const progress  = Math.round((totalColl/totalExp)*100)||0;
  const soon      = tenants.filter(t=>{const diff=(new Date(t.leaseEnd)-now)/86400000;return diff>=0&&diff<=60;});
  const allRepairs= Object.entries(repairs).flatMap(([tid,list])=>list.map(r=>({...r,tenantId:Number(tid),tenant:tenants.find(t=>t.id===Number(tid))})));
  const openRep   = allRepairs.filter(r=>r.status==="open");

  const setPay = (tid,status,amt,date) => {
    const t=tenants.find(x=>x.id===tid);
    const val=status==="paid"?{status:"paid",amount:t.rent,date:now.toISOString().slice(0,10)}
      :status==="partial"?{status:"partial",amount:Number(amt),date:date||now.toISOString().slice(0,10)}
      :{status:"unpaid",amount:0,date:""};
    setPayments(p=>({...p,[mk]:{...p[mk],[tid]:val}}));
  };
  const addRepair = (tid,text,cat) => {
    if(!text.trim()) return;
    setRepairs(p=>({...p,[tid]:[...(p[tid]||[]),{id:Date.now(),text:text.trim(),cat:cat||"Other",date:now.toISOString().slice(0,10),status:"open"}]}));
  };
  const toggleRep = (tid,iid) => setRepairs(p=>({...p,[tid]:p[tid].map(i=>i.id===iid?{...i,status:i.status==="open"?"resolved":"open"}:i)}));
  const upDoc = (setter,id,files) => {
    const docs=Array.from(files).map(f=>({name:f.name,url:URL.createObjectURL(f),date:now.toISOString().slice(0,10)}));
    setter(p=>({...p,[id]:[...(p[id]||[]),...docs]}));
  };
  const rmDoc = (setter,id,idx) => setter(p=>({...p,[id]:p[id].filter((_,i)=>i!==idx)}));

  const exportCSV = () => {
    const rows=[["Building","Unit","Tenant","Rent","Currency","Status","Amount Paid","Date","Lease End"]];
    tenants.forEach(t=>{const p=getPay(t.id);const b=buildings.find(x=>x.id===t.buildingId);rows.push([b?b.name:"",t.unit,t.name,t.rent,b?b.currency:"",p.status,p.amount||"",p.date,t.leaseEnd]);});
    const a=document.createElement("a");
    a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(rows.map(r=>r.join(",")).join("\n"));
    a.download="rent_"+mk+".csv";
    a.click();
  };

  const filtered = tenants.filter(t=>{
    const p=getPay(t.id);
    return (filterSt==="all"||p.status===filterSt)
      &&(filterBld===0||t.buildingId===filterBld)
      &&(t.name.toLowerCase().includes(searchQ.toLowerCase())||t.unit.includes(searchQ));
  });

  const sc  = s=>s==="paid"?C.green:s==="partial"?C.amber:C.red;
  const sbg = s=>s==="paid"?C.greenLt:s==="partial"?C.amberLt:C.redLt;
  const badge = s=>({display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:sbg(s),color:sc(s)});
  const btn = v=>{
    const base={borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:13,fontWeight:500,border:"1px solid transparent",whiteSpace:"nowrap"};
    if(v==="primary") return {...base,background:C.primary,color:"#fff"};
    if(v==="green")   return {...base,background:C.green,color:"#fff"};
    if(v==="red")     return {...base,background:"#fff",color:C.red,border:"1px solid "+C.border};
    return {...base,background:"#fff",color:C.text,border:"1px solid "+C.border};
  };
  const smbtn = c=>({borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:500,background:"#fff",color:c||C.text2,border:"1px solid "+C.border,whiteSpace:"nowrap"});
  const inp = {...sharedInp};
  const card = {background:C.card,border:"1px solid "+C.border,borderRadius:12,padding:20,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"};

  function PanelEditTenant({data}) {
    const [f,setF] = useState({...data});
    const tDocs = tenantDocs[data.id]||[];
    const fRef  = useRef();
    const cur   = getBldCur(f.buildingId);
    return (
      <div style={{...card,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,paddingBottom:14,borderBottom:"1px solid "+C.borderLt}}>
          <span style={{fontWeight:600,fontSize:16}}>Edit tenant - Unit {f.unit}</span>
          <button style={btn()} onClick={()=>setPanel(null)}>Close</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[["name","Name","text"],["phone","Phone","text"],["email","Email","email"],["rent","Monthly rent ("+cur.symbol+")","number"],["leaseEnd","Lease end","date"]].map(([k,lbl,type])=>(
            <div key={k}>
              <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5,fontWeight:500}}>{lbl}</label>
              <input type={type} value={f[k]||""} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} style={inp}/>
            </div>
          ))}
          <div>
            <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5,fontWeight:500}}>Building</label>
            <select value={f.buildingId} onChange={e=>setF(x=>({...x,buildingId:Number(e.target.value)}))} style={inp}>
              {buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginTop:18,paddingTop:16,borderTop:"1px solid "+C.borderLt}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Payment - {MONTHS[selMonth]} {selYear}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <button style={btn("green")} onClick={()=>{setPay(f.id,"paid");setPanel(null);}}>Mark paid</button>
            <button style={btn("red")}   onClick={()=>{setPay(f.id,"unpaid");setPanel(null);}}>Mark unpaid</button>
            <input type="number" placeholder={"Partial "+cur.symbol} id="pa" style={{...inp,width:120}}/>
            <input type="date" defaultValue={now.toISOString().slice(0,10)} id="pd" style={{...inp,width:150}}/>
            <button style={btn()} onClick={()=>{const a=document.getElementById("pa").value,d=document.getElementById("pd").value;if(a){setPay(f.id,"partial",a,d);setPanel(null);}}}>Save partial</button>
          </div>
        </div>
        <div style={{marginTop:18,paddingTop:16,borderTop:"1px solid "+C.borderLt}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:600}}>Documents</div>
            <button style={btn()} onClick={()=>fRef.current.click()}>Upload</button>
          </div>
          <input ref={fRef} type="file" multiple style={{display:"none"}} onChange={e=>{upDoc(setTenantDocs,data.id,e.target.files);e.target.value="";}}/>
          {tDocs.length===0 && <div style={{fontSize:13,color:C.text3}}>No documents uploaded.</div>}
          {tDocs.map((d,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:C.bg,borderRadius:8,marginBottom:6}}>
              <a href={d.url} download={d.name} style={{fontSize:13,color:C.primary,textDecoration:"none",fontWeight:500}}>{"?? "+d.name}</a>
              <button style={smbtn(C.red)} onClick={()=>rmDoc(setTenantDocs,data.id,i)}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:18}}>
          <button style={btn()} onClick={()=>setPanel(null)}>Cancel</button>
          <button style={btn("primary")} onClick={()=>{setTenants(p=>p.map(t=>t.id===f.id?{...t,...f,rent:Number(f.rent),buildingId:Number(f.buildingId)}:t));setPanel(null);}}>Save changes</button>
        </div>
      </div>
    );
  }

  function PanelEditBuilding({data}) {
    const isNew = !data.id;
    const [f,setF] = useState({currency:"INR",...data});
    const save = () => {
      if(!f.name||!f.name.trim()||!f.address||!f.address.trim()){alert("Fill in name and address.");return;}
      if(isNew){const id=Math.max(0,...buildings.map(b=>b.id))+1;setBuildings(p=>[...p,{id,name:f.name.trim(),address:f.address.trim(),currency:f.currency||"INR"}]);}
      else setBuildings(p=>p.map(b=>b.id===f.id?{...b,name:f.name,address:f.address,currency:f.currency}:b));
      setPanel(null);
    };
    return (
      <div style={{...card,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,paddingBottom:14,borderBottom:"1px solid "+C.borderLt}}>
          <span style={{fontWeight:600,fontSize:16}}>{isNew?"Add building":"Edit building"}</span>
          <button style={btn()} onClick={()=>setPanel(null)}>Close</button>
        </div>
        {[["name","Building name"],["address","Address"]].map(([k,lbl])=>(
          <div key={k} style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5,fontWeight:500}}>{lbl}</label>
            <input value={f[k]||""} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} style={inp}/>
          </div>
        ))}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5,fontWeight:500}}>Currency</label>
          <select value={f.currency||"INR"} onChange={e=>setF(x=>({...x,currency:e.target.value}))} style={inp}>
            {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
          <div>{!isNew && <button style={btn("red")} onClick={()=>{if(window.confirm("Delete this building?")){setBuildings(p=>p.filter(b=>b.id!==f.id));setPanel(null);}}}>Delete</button>}</div>
          <div style={{display:"flex",gap:8}}>
            <button style={btn()} onClick={()=>setPanel(null)}>Cancel</button>
            <button style={btn("primary")} onClick={save}>{isNew?"Add":"Save"}</button>
          </div>
        </div>
      </div>
    );
  }

  const NAV = [["dashboard","Dashboard"],["tenants","Tenants"],["repairs","Repairs"],["documents","Documents"]];

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif",color:C.text,background:C.bg,minHeight:"100vh",display:"flex"}}>
      {showPwd && <ChangePwdModal user={currentUser} onClose={()=>setShowPwd(false)}/>}

      <div style={{width:220,background:C.sidebar,color:"#fff",flexShrink:0,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"24px 24px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:20,fontWeight:700}}>Manne</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>Property Manager</div>
        </div>
        <div style={{padding:"12px 0",flex:1}}>
          {NAV.map(([v,label])=>(
            <button key={v} onClick={()=>{setView(v);setPanel(null);}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 24px",border:"none",background:view===v?"rgba(255,255,255,0.1)":"transparent",color:view===v?"#fff":"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:14,fontWeight:view===v?600:400,borderLeft:view===v?"3px solid #4F46E5":"3px solid transparent",textAlign:"left"}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{padding:"20px 24px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Signed in as</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:10,textTransform:"capitalize"}}>{currentUser}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4}}>Collection this month</div>
          <div style={{fontSize:26,fontWeight:700,color:progress>=80?"#34D399":progress>=50?"#FCD34D":"#F87171"}}>{progress}%</div>
          <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.1)",margin:"8px 0 14px",overflow:"hidden"}}>
            <div style={{height:"100%",width:progress+"%",background:progress>=80?"#34D399":progress>=50?"#FCD34D":"#F87171",borderRadius:2}}/>
          </div>
          <button onClick={()=>setShowPwd(true)} style={{width:"100%",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:7,fontSize:12,cursor:"pointer",marginBottom:6}}>Change password</button>
          <button onClick={onLogout} style={{width:"100%",background:"rgba(220,38,38,0.15)",color:"#FCA5A5",border:"1px solid rgba(220,38,38,0.2)",borderRadius:7,padding:7,fontSize:12,cursor:"pointer"}}>Sign out</button>
        </div>
      </div>

      <div style={{flex:1,minWidth:0}}>
        <div style={{background:"#fff",borderBottom:"1px solid "+C.border,padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:700}}>{(NAV.find(n=>n[0]===view)||["",""])[1]}</div>
            <div style={{fontSize:13,color:C.text2}}>{tenants.length} units ， {buildings.length} buildings</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))} style={{...inp,width:"auto",padding:"8px 10px"}}>
              {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
            <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...inp,width:"auto",padding:"8px 10px"}}>
              {[CY-1,CY,CY+1].map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <button style={btn("primary")} onClick={exportCSV}>Export CSV</button>
          </div>
        </div>

        <div style={{padding:"28px 32px",maxWidth:1100}}>
          {panel && panel.type==="editTenant"   && <PanelEditTenant   data={panel.data}/>}
          {panel && panel.type==="editBuilding" && <PanelEditBuilding data={panel.data}/>}

          {view==="dashboard" && (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:24}}>
                {[["Expected",C.text],["Collected",C.green],["Pending",C.red]].map(([l,c])=>(
                  <div key={l} style={{...card,padding:"18px 20px"}}>
                    <div style={{fontSize:13,color:C.text2,marginBottom:8,fontWeight:500}}>{l} rent</div>
                    {buildings.map(function(b) {
                      const bT=tenants.filter(t=>t.buildingId===b.id);
                      const bV=bT.reduce(function(s,t){const p=getPay(t.id);const paid=p.status==="paid"?t.rent:p.status==="partial"?Number(p.amount)||0:0;const exp=t.rent;return s+(l==="Expected"?exp:l==="Collected"?paid:exp-paid);},0);
                      return <div key={b.id} style={{fontSize:13,color:c,fontWeight:600}}>{b.name.split(" ")[0]+": "+fmtAmt(bV,b.id)}</div>;
                    })}
                  </div>
                ))}
                <div style={{...card,padding:"18px 20px"}}>
                  <div style={{fontSize:13,color:C.text2,marginBottom:8,fontWeight:500}}>Open repairs</div>
                  <div style={{fontSize:26,fontWeight:700,color:C.amber}}>{openRep.length}</div>
                </div>
              </div>

              <div style={{...card,marginBottom:24}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:14,fontWeight:600}}>Collection progress - {MONTHS[selMonth]} {selYear}</span>
                  <span style={{fontSize:13,color:C.text2}}>{paidCnt} paid ， {partCnt} partial ， {unpaidCnt} unpaid</span>
                </div>
                <div style={{height:12,borderRadius:6,background:C.borderLt,overflow:"hidden"}}>
                  <div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,"+C.green+",#10B981)",borderRadius:6}}/>
                </div>
              </div>

              <BarChart buildings={buildings} tenants={tenants} getPay={getPay} fmtAmt={fmtAmt} getBldCur={getBldCur}/>

              {soon.length>0 && (
                <div style={{...card,marginBottom:24,background:C.amberLt,borderColor:"#FDE68A"}}>
                  <div style={{fontWeight:600,fontSize:14,color:C.amber,marginBottom:10}}>Leases expiring within 60 days ({soon.length})</div>
                  {soon.map(t=>(
                    <div key={t.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",color:"#92400E"}}>
                      <span>Unit {t.unit} ！ {t.name}</span><span>{t.leaseEnd}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:16,fontWeight:700}}>Buildings</span>
                <button style={btn("primary")} onClick={()=>setPanel({type:"editBuilding",data:{name:"",address:"",currency:"INR"}})}>+ Add building</button>
              </div>
              {buildings.map(function(b,bi) {
                const bT=tenants.filter(t=>t.buildingId===b.id);
                const bE=bT.reduce((s,t)=>s+t.rent,0);
                const bC=bT.reduce(function(s,t){const p=getPay(t.id);return s+(p.status==="paid"?t.rent:p.status==="partial"?Number(p.amount)||0:0);},0);
                const bP=bE>0?Math.round((bC/bE)*100):0;
                const col=BCOLORS[bi%BCOLORS.length];
                return (
                  <div key={b.id} style={{...card,marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:40,height:40,borderRadius:10,background:col,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0}}>{b.name[0]}</div>
                        <div>
                          <div style={{fontWeight:600,fontSize:15}}>{b.name}</div>
                          <div style={{fontSize:13,color:C.text2}}>{b.address}</div>
                          <span style={{background:C.primaryLt,color:C.primary,borderRadius:5,padding:"1px 8px",fontSize:11,fontWeight:600}}>{getBldCur(b.id).code}</span>
                        </div>
                      </div>
                      <button style={smbtn(C.primary)} onClick={()=>setPanel({type:"editBuilding",data:b})}>Edit</button>
                    </div>
                    <div style={{display:"flex",gap:20,fontSize:13,marginBottom:10,flexWrap:"wrap"}}>
                      <span style={{color:C.text2}}>Expected: <strong>{fmtAmt(bE,b.id)}</strong></span>
                      <span style={{color:C.text2}}>Collected: <strong style={{color:C.green}}>{fmtAmt(bC,b.id)}</strong></span>
                      <span style={{color:C.text2}}>Pending: <strong style={{color:C.red}}>{fmtAmt(bE-bC,b.id)}</strong></span>
                    </div>
                    <div style={{height:8,borderRadius:4,background:C.borderLt,overflow:"hidden"}}>
                      <div style={{height:"100%",width:bP+"%",background:col,borderRadius:4}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view==="tenants" && (
            <div>
              <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
                <input placeholder="Search unit or name..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{...inp,width:220}}/>
                <select value={filterBld} onChange={e=>setFilterBld(Number(e.target.value))} style={{...inp,width:"auto"}}>
                  <option value={0}>All buildings</option>
                  {buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <div style={{display:"flex",gap:4,background:"#fff",padding:4,borderRadius:10,border:"1px solid "+C.border}}>
                  {["all","paid","partial","unpaid"].map(s=>(
                    <button key={s} onClick={()=>setFilterSt(s)} style={{border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:13,fontWeight:filterSt===s?600:400,background:filterSt===s?C.primaryLt:"transparent",color:filterSt===s?C.primary:C.text2}}>{s[0].toUpperCase()+s.slice(1)}</button>
                  ))}
                </div>
              </div>
              {buildings.filter(b=>filterBld===0||b.id===filterBld).map(function(b,bi) {
                const bF=filtered.filter(t=>t.buildingId===b.id);
                if(!bF.length) return null;
                const col=BCOLORS[buildings.findIndex(x=>x.id===b.id)%BCOLORS.length];
                return (
                  <div key={b.id} style={{...card,marginBottom:20,padding:0,overflow:"hidden"}}>
                    <div style={{padding:"14px 20px",borderBottom:"1px solid "+C.borderLt,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:col}}/>
                        <span style={{fontWeight:600,fontSize:14}}>{b.name}</span>
                        <span style={{fontSize:11,background:C.primaryLt,color:C.primary,borderRadius:4,padding:"1px 7px",fontWeight:600}}>{getBldCur(b.id).code}</span>
                      </div>
                      <span style={{fontSize:12,color:C.text2}}>{bF.length} units</span>
                    </div>
                    {bF.map(function(t,idx) {
                      const p=getPay(t.id);
                      const tDocs=tenantDocs[t.id]||[];
                      return (
                        <div key={t.id} style={{padding:"14px 20px",borderBottom:idx<bF.length-1?"1px solid "+C.borderLt:"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                            <div style={{minWidth:100}}>
                              <div style={{fontSize:11,color:C.text3,fontWeight:500}}>UNIT {t.unit}</div>
                              <div style={{fontSize:15,fontWeight:600}}>{t.name}</div>
                              <div style={{fontSize:13,color:C.text2}}>{fmtAmt(t.rent,t.buildingId)}/mo</div>
                            </div>
                            <div style={{minWidth:150,fontSize:12,color:C.text2,lineHeight:1.7}}>
                              <div>{t.email}</div><div>{t.phone}</div><div>Lease ends {t.leaseEnd}</div>
                            </div>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginLeft:"auto"}}>
                              <span style={badge(p.status)}>{p.status==="paid"?"Paid":p.status==="partial"?"Partial "+fmtAmt(p.amount,t.buildingId):"Unpaid"}</span>
                              <button style={smbtn(C.green)} onClick={()=>setPay(t.id,"paid")}>Paid</button>
                              <button style={smbtn(C.red)}   onClick={()=>setPay(t.id,"unpaid")}>Unpaid</button>
                              <button style={smbtn()}        onClick={()=>setPanel({type:"editTenant",data:t})}>Edit</button>
                            </div>
                          </div>
                          <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                            <span style={{fontSize:11,color:C.text3,fontWeight:500}}>DOCS</span>
                            {tDocs.length===0 && <span style={{fontSize:12,color:C.text3}}>None</span>}
                            {tDocs.map((d,i)=><a key={i} href={d.url} download={d.name} style={{fontSize:12,background:C.primaryLt,borderRadius:6,padding:"3px 10px",color:C.primary,textDecoration:"none",fontWeight:500}}>{"?? "+d.name}</a>)}
                            <label style={{...smbtn(C.primary),cursor:"pointer"}}>+ Upload<input type="file" multiple style={{display:"none"}} onChange={e=>{upDoc(setTenantDocs,t.id,e.target.files);e.target.value="";}} /></label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {view==="repairs" && (function() {
            const openN=openRep.length;
            const resN=allRepairs.filter(r=>r.status==="resolved").length;
            const byCat=REPAIR_CATS.map(c=>({label:c,value:allRepairs.filter(r=>(r.cat||"Other")===c).length,color:CAT_COLORS[c]})).filter(x=>x.value>0);
            return (
              <div>
                <div style={{...card,marginBottom:24}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Log a new repair</div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <select value={repForm.tid} onChange={e=>setRepForm(f=>({...f,tid:e.target.value}))} style={{...inp,flex:1,minWidth:180}}>
                      <option value="">Select unit...</option>
                      {buildings.map(b=>(
                        <optgroup key={b.id} label={b.name}>
                          {tenants.filter(t=>t.buildingId===b.id).map(t=><option key={t.id} value={t.id}>{"Unit "+t.unit+" - "+t.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <select value={repForm.cat} onChange={e=>setRepForm(f=>({...f,cat:e.target.value}))} style={{...inp,width:150}}>
                      {REPAIR_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    <input value={repForm.text} onChange={e=>setRepForm(f=>({...f,text:e.target.value}))} placeholder="Describe the repair..." style={{...inp,flex:2,minWidth:200}}
                      onKeyDown={e=>{if(e.key==="Enter"&&repForm.tid&&repForm.text.trim()){addRepair(Number(repForm.tid),repForm.text,repForm.cat);setRepForm({tid:"",cat:"Plumbing",text:""});}}}/>
                    <button style={btn("primary")} onClick={()=>{if(repForm.tid&&repForm.text.trim()){addRepair(Number(repForm.tid),repForm.text,repForm.cat);setRepForm({tid:"",cat:"Plumbing",text:""}); }}}>Add repair</button>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
                  <div style={card}>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:8}}>Status</div>
                    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                      <Donut size={150} slices={[{value:openN,color:C.red},{value:resN,color:C.green}]} centerTop={String(allRepairs.length)} centerBot="total"/>
                      <div>
                        {[["Open",openN,C.red],["Resolved",resN,C.green]].map(([l,v,c])=>(
                          <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                            <div style={{width:10,height:10,borderRadius:3,background:c}}/>
                            <span style={{fontSize:13,minWidth:70}}>{l}</span>
                            <span style={{fontSize:14,fontWeight:700,color:c}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:8}}>By category</div>
                    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                      <Donut size={150} slices={byCat.length?byCat:[{value:1,color:"#E5E7EB"}]} centerTop={String(allRepairs.length)} centerBot="repairs"/>
                      <div>
                        {byCat.length===0 && <span style={{fontSize:13,color:C.text3}}>No repairs yet</span>}
                        {byCat.map(c=>(
                          <div key={c.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                            <div style={{width:10,height:10,borderRadius:3,background:c.color}}/>
                            <span style={{fontSize:13,minWidth:75}}>{c.label}</span>
                            <span style={{fontSize:13,fontWeight:600,color:c.color}}>{c.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>All repairs - {openRep.length} open</div>
                <div style={{...card,padding:0,overflow:"hidden"}}>
                  {allRepairs.length===0 && <div style={{padding:24,color:C.text3,fontSize:14,textAlign:"center"}}>No repairs logged yet.</div>}
                  {[...allRepairs].sort((a,b)=>a.status==="open"?-1:1).map(function(r,idx,arr) {
                    return (
                      <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderBottom:idx<arr.length-1?"1px solid "+C.borderLt:"none",flexWrap:"wrap"}}>
                        <div style={{flex:1,minWidth:160}}>
                          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                            <span style={{background:CAT_COLORS[r.cat]||"#888",color:"#fff",borderRadius:5,padding:"2px 9px",fontSize:11,fontWeight:600}}>{r.cat||"Other"}</span>
                            <span style={{fontSize:12,color:C.text3}}>{(buildings.find(b=>b.id===r.tenant?.buildingId)||{name:""}).name} - Unit {r.tenant?r.tenant.unit:""} - {r.tenant?r.tenant.name:""}</span>
                          </div>
                          <div style={{fontSize:14,textDecoration:r.status==="resolved"?"line-through":"none",color:r.status==="resolved"?C.text3:C.text}}>{r.text}</div>
                        </div>
                        <span style={{fontSize:12,color:C.text3}}>{r.date}</span>
                        <span style={badge(r.status==="open"?"partial":"paid")}>{r.status}</span>
                        <button style={smbtn(r.status==="open"?C.green:C.text2)} onClick={()=>toggleRep(r.tenantId,r.id)}>{r.status==="open"?"Resolve":"Reopen"}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {view==="documents" && (
            <div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Property documents</div>
              <div style={{fontSize:13,color:C.text2,marginBottom:20}}>Upload lease agreements, insurance, permits and other files per building.</div>
              {buildings.map(function(b,bi) {
                const docs=propDocs[b.id]||[];
                const col=BCOLORS[bi%BCOLORS.length];
                return (
                  <div key={b.id} style={{...card,marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:36,height:36,borderRadius:9,background:col,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,flexShrink:0}}>{b.name[0]}</div>
                        <div>
                          <div style={{fontWeight:600,fontSize:14}}>{b.name}</div>
                          <div style={{fontSize:12,color:C.text2}}>{b.address}</div>
                        </div>
                      </div>
                      <label style={{...btn("primary"),cursor:"pointer"}}>
                        + Upload
                        <input type="file" multiple style={{display:"none"}} onChange={e=>{upDoc(setPropDocs,b.id,e.target.files);e.target.value="";}} />
                      </label>
                    </div>
                    {docs.length===0 && <div style={{fontSize:13,color:C.text3,padding:12,background:C.bg,borderRadius:8,textAlign:"center"}}>No documents uploaded yet.</div>}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                      {docs.map((d,i)=>(
                        <div key={i} style={{background:C.bg,borderRadius:10,padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
                          <span style={{fontSize:26}}>??</span>
                          <div style={{flex:1,minWidth:0}}>
                            <a href={d.url} download={d.name} style={{fontSize:13,color:C.primary,textDecoration:"none",fontWeight:600,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</a>
                            <div style={{fontSize:11,color:C.text3}}>{d.date}</div>
                          </div>
                          <button style={smbtn(C.red)} onClick={()=>rmDoc(setPropDocs,b.id,i)}>X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser,setCurrentUser] = useState(()=>{
    try { const s=JSON.parse(localStorage.getItem("manne_auth")||"null"); return s?s.user:null; } catch { return null; }
  });
  const logout = () => { localStorage.removeItem("manne_auth"); setCurrentUser(null); };
  if (!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;
  return <Dashboard currentUser={currentUser} onLogout={logout}/>;
}