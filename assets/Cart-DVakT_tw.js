import{r as o,j as e,Y as V,L as v,A as $,ai as ee,V as re,au as te,P as se,av as ae,T as ne,aw as ie,aa as K,X as oe}from"./react-vendor-DT-Tbp60.js";import{u as ce,c as le}from"./index-Dh-S5Fp-.js";import{u as y}from"./cartStore-Bvtdfx3s.js";import"./vendor-CUbtOFGM.js";import"./motion-vendor-BpwSzfL4.js";const _={dark:{"--page-bg":"#0A0E12","--surface":"#141B1F","--surface-alt":"#0D2B24","--hover":"rgba(255, 255, 255, 0.04)","--subtle":"rgba(76, 175, 80, 0.15)","--border":"rgba(255, 255, 255, 0.06)","--border-strong":"rgba(76, 175, 80, 0.20)","--text-1":"#E8E8E8","--text-2":"rgba(232,232,232,0.70)","--text-3":"rgba(232,232,232,0.40)","--accent":"#4CAF50","--accent-text":"#FFFFFF","--danger-bg":"rgba(244, 67, 54, 0.12)","--danger-text":"rgba(244, 67, 54, 0.90)","--danger-border":"rgba(244, 67, 54, 0.90)","--input-bg":"rgba(255, 255, 255, 0.04)","--shadow":"0 24px 64px rgba(0,0,0,0.55)","--img-filter":"brightness(0.60) saturate(0.75)"},light:{"--page-bg":"#F8FAFB","--surface":"#FAF9F6","--surface-alt":"#E8F5E9","--hover":"rgba(0, 0, 0, 0.02)","--subtle":"rgba(45,155,79,0.10)","--border":"rgba(0, 0, 0, 0.08)","--border-strong":"rgba(0, 0, 0, 0.12)","--text-1":"#1A1A1A","--text-2":"rgba(26,26,26,0.65)","--text-3":"rgba(26,26,26,0.45)","--accent":"#2D9B4F","--accent-text":"#F5F5F5","--danger-bg":"rgba(220,53,69,0.12)","--danger-text":"rgba(220,53,69,0.95)","--danger-border":"rgba(220,53,69,0.95)","--input-bg":"#FFFFFF","--shadow":"0 24px 64px rgba(0,0,0,0.15)","--img-filter":"none"}},z=({theme:s})=>{const g=_[s]||_.dark;return e.jsx("style",{children:`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

      .cp-page {
        ${Object.entries(g).map(([m,i])=>`${m}: ${i};`).join(`
        `)}
        min-height: 100vh; background: var(--page-bg); color: var(--text-1);
        font-family: 'Inter', system-ui, sans-serif;
        transition: background 0.3s, color 0.3s;
      }
      .cp-page * { box-sizing: border-box; }
      .cp-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; }
      .cp-label { font-size: 11px; font-weight: 600; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; }

      .cp-input, .cp-select {
        width: 100%; padding: 10px 12px; border: 1.5px solid var(--border-strong);
        border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px;
        color: var(--text-1); background: var(--input-bg); outline: none;
        transition: border-color 0.15s;
      }
      .cp-input:focus, .cp-select:focus { border-color: var(--accent); }
      .cp-input::placeholder { color: var(--text-3); }
      .cp-select { appearance: none; cursor: pointer; }

      .cp-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer;
        font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
        transition: opacity 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
        white-space: nowrap;
      }
      .cp-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      .cp-btn-primary { background: var(--accent); color: var(--accent-text); width: 100%; }
      .cp-btn-primary:hover:not(:disabled) { opacity: 0.88; }
      .cp-btn-ghost {
        background: transparent; color: var(--text-2); border: 1.5px solid var(--border-strong); width: 100%;
      }
      .cp-btn-ghost:hover:not(:disabled) { background: var(--hover); color: var(--text-1); border-color: var(--accent); }
      .cp-btn-sm { padding: 8px 14px; font-size: 12px; border-radius: 8px; }

      .cp-icon-btn {
        width: 30px; height: 30px; border-radius: 8px; border: none; background: var(--subtle);
        color: var(--accent); display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: opacity 0.15s; flex-shrink: 0;
      }
      .cp-icon-btn:hover:not(:disabled) { opacity: 0.75; }
      .cp-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

      .cp-remove-btn {
        width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border-strong);
        background: transparent; color: var(--text-3); display: flex; align-items: center;
        justify-content: center; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
      }
      .cp-remove-btn:hover { border-color: var(--danger-border); color: var(--danger-text); background: var(--danger-bg); }

      .cp-item-row {
        display: flex; align-items: center; gap: 16px; padding: 16px;
        border-radius: 12px; transition: background 0.15s;
      }
      .cp-item-row:hover { background: var(--hover); }

      .cp-thumb {
        width: 60px; height: 60px; border-radius: 10px; overflow: hidden; flex-shrink: 0;
        background: var(--surface-alt); display: flex; align-items: center; justify-content: center;
        font-size: 22px; border: 1px solid var(--border);
      }

      .cp-summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 7px 0; }
      .cp-summary-row span:first-child { color: var(--text-2); }
      .cp-summary-row span:last-child { color: var(--text-1); font-weight: 500; }

      .cp-divider { height: 1px; background: var(--border); margin: 16px 0; }

      .cp-empty {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 70vh; gap: 18px; text-align: center; padding: 24px;
      }

      .cp-back-link {
        display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500;
        color: var(--text-2); text-decoration: none; transition: color 0.15s;
      }
      .cp-back-link:hover { color: var(--accent); }

      .cp-split-option {
        padding: 14px 16px; border-radius: 10px; cursor: pointer; transition: all 0.15s;
        border: 1.5px solid var(--border-strong); background: var(--surface);
      }
      .cp-split-option.on { border-color: var(--accent); background: var(--subtle); }

      .cp-success-banner {
        background: var(--subtle); border: 1.5px solid var(--accent); color: var(--accent);
        border-radius: 10px; padding: 16px; text-align: center; font-size: 14px; font-weight: 600;
        display: flex; align-items: center; justify-content: center; gap: 8px;
      }

      .cp-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
      }
      .cp-modal {
        background: var(--surface); border-radius: 16px; box-shadow: var(--shadow);
        width: 440px; max-width: 100%; padding: 24px; border: 1px solid var(--border);
      }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

      @media (max-width: 860px) {
        .cp-grid { grid-template-columns: 1fr !important; }
        .cp-summary-panel { position: static !important; }
      }
    `})},Q=[{id:"full",label:"Paiement complet",desc:"Une seule transaction"},{id:"2x",label:"En 2 fois",desc:"2 versements égaux, sans frais"},{id:"3x",label:"En 3 fois",desc:"3 versements égaux, sans frais"},{id:"half_now",label:"50% maintenant",desc:"50% à la livraison"}],de=({total:s,onClose:g,onConfirm:m})=>{const[i,c]=o.useState("full"),a=n=>n.toFixed(2)+" MAD",l=()=>i==="2x"?[s/2,s/2]:i==="3x"?[s/3,s/3,s/3]:i==="half_now"?[s/2,s/2]:[s];return e.jsx("div",{className:"cp-modal-overlay",onClick:g,children:e.jsxs("div",{className:"cp-modal",onClick:n=>n.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx(K,{size:18,color:"var(--accent)"}),e.jsx("span",{style:{fontSize:16,fontWeight:700,color:"var(--text-1)"},children:"Mode de paiement"})]}),e.jsx("button",{onClick:g,className:"cp-icon-btn",style:{background:"var(--hover)",color:"var(--text-2)"},children:e.jsx(oe,{size:15})})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:18},children:Q.map(n=>e.jsxs("div",{onClick:()=>c(n.id),className:`cp-split-option${i===n.id?" on":""}`,children:[e.jsx("div",{style:{fontSize:13,fontWeight:600,color:i===n.id?"var(--accent)":"var(--text-1)",marginBottom:2},children:n.label}),e.jsx("div",{style:{fontSize:12,color:"var(--text-2)"},children:n.desc})]},n.id))}),e.jsxs("div",{className:"cp-card",style:{padding:14,marginBottom:18},children:[e.jsx("div",{className:"cp-label",style:{marginBottom:10},children:"Échéancier"}),l().map((n,d)=>e.jsxs("div",{className:"cp-summary-row",style:{borderBottom:d<l().length-1?"1px solid var(--border)":"none"},children:[e.jsx("span",{children:i==="half_now"?d===0?"Maintenant":"À la livraison":`Versement ${d+1}`}),e.jsx("span",{style:{color:"var(--accent)"},children:a(n)})]},d))]}),e.jsxs("button",{onClick:()=>m(i),className:"cp-btn cp-btn-primary",children:["Confirmer — ",a(s)]})]})})},F={casa:{label:"Casablanca — Centre",fee:15},rabat:{label:"Rabat — Agdal",fee:20},fes:{label:"Fès — Médina",fee:25},mek:{label:"Meknès — Centre-ville",fee:35},agadir:{label:"Agadir — Ville",fee:40}},pe={MARKEAT20:{type:"pct",value:20},GREENLEAF:{type:"flat",value:30},BETA50:{type:"pct",value:50}};function he(){const s=y(r=>r.items),g=y(r=>r.removeFromCart),m=y(r=>r.updateQuantity),i=y(r=>r.clearCart),{theme:c,lang:a}=ce(),[l,n]=o.useState("casa"),[d,Y]=o.useState(""),[j,k]=o.useState(null),[h,E]=o.useState(null),[G,w]=o.useState(!1),[I,U]=o.useState(!1),[C,H]=o.useState(null),[S,A]=o.useState(!1),[M,T]=o.useState(""),[B,X]=o.useState([]),p=r=>Number(r).toLocaleString("fr-MA",{minimumFractionDigits:2,maximumFractionDigits:2})+" MAD",b=s.reduce((r,t)=>r+t.quantity*(t.price||0),0),D=F[l]?.fee||15,W=b*.2,N=h?h.type==="pct"?b*(h.value/100):Math.min(h.value,b):0,P=Math.max(0,b+D+W-N),O=()=>{const r=d.trim().toUpperCase();if(!r){k({ok:!1,text:"Entre un code valide."});return}const t=pe[r];if(!t){k({ok:!1,text:"Code invalide ou expiré."}),E(null);return}E(t);const f=t.type==="pct"?t.value+"%":t.value+" MAD";k({ok:!0,text:`Code appliqué — ${f} de réduction.`})},R=async(r=C||"full")=>{A(!0),T("");try{const t=s.reduce((x,u)=>(u.fournisseurId&&(x[u.fournisseurId]=x[u.fournisseurId]||[],x[u.fournisseurId].push(u)),x),{}),f=[];for(const[x,u]of Object.entries(t)){const Z=await le.post("/api/restaurant/orders",{fournisseur_id:Number(x),notes:`Delivery: ${F[l]?.label||l}. Payment: ${r}.`,items:u.map(q=>({product_id:q.productId,quantity:q.quantity}))});f.push(Z.data?.order)}H(r),X(f.filter(Boolean)),w(!1),U(!0),i()}catch(t){T(t.response?.data?.message||(a==="fr"?"Impossible de passer la commande. Verifiez votre compte et le stock.":"Could not place the order. Check your account verification and product stock."))}finally{A(!1)}},J=r=>{R(r)},L=s.reduce((r,t)=>r+t.quantity,0);return I?e.jsxs("div",{className:"cp-page","data-theme":c==="dark"?"dark":"light",children:[e.jsx(z,{theme:c}),e.jsxs("div",{className:"cp-empty",children:[e.jsx("div",{style:{width:64,height:64,borderRadius:16,background:"var(--subtle)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(V,{size:26,color:"var(--accent)",strokeWidth:1.8})}),e.jsx("h2",{style:{fontSize:22,fontWeight:700,color:"var(--text-1)",letterSpacing:"-0.4px"},children:a==="fr"?"Commande confirmee":"Order confirmed"}),e.jsx("p",{style:{fontSize:13,color:"var(--text-2)"},children:B.length?`Order #${B.map(r=>r.id).join(", #")} is now pending supplier acceptance.`:"Your order is now pending supplier acceptance."}),e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"},children:[e.jsxs(v,{to:"/restaurant/commandes",className:"cp-btn cp-btn-primary",style:{width:"auto",textDecoration:"none",padding:"12px 24px"},children:[a==="fr"?"Suivre":"Track orders"," ",e.jsx($,{size:15})]}),e.jsx(v,{to:"/browse",className:"cp-btn cp-btn-ghost",style:{width:"auto",textDecoration:"none",padding:"12px 24px"},children:a==="fr"?"Continuer les achats":"Continue shopping"})]})]})]}):s.length===0?e.jsxs("div",{className:"cp-page","data-theme":c==="dark"?"dark":"light",children:[e.jsx(z,{theme:c}),e.jsxs("div",{className:"cp-empty",children:[e.jsx("div",{style:{width:64,height:64,borderRadius:16,background:"var(--subtle)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(ee,{size:26,color:"var(--accent)",strokeWidth:1.6})}),e.jsx("h2",{style:{fontSize:22,fontWeight:700,color:"var(--text-1)",letterSpacing:"-0.4px"},children:a==="fr"?"Panier vide":"Empty cart"}),e.jsx("p",{style:{fontSize:13,color:"var(--text-2)"},children:a==="fr"?"Ajoutez des produits depuis le catalogue":"Add products from the catalog"}),e.jsxs(v,{to:"/browse",className:"cp-btn cp-btn-primary",style:{width:"auto",textDecoration:"none",padding:"12px 24px"},children:[a==="fr"?"Voir le catalogue":"View catalog"," ",e.jsx($,{size:15})]})]})]}):e.jsxs("div",{className:"cp-page","data-theme":c==="dark"?"dark":"light",children:[e.jsx(z,{theme:c}),G&&e.jsx(de,{total:P,onClose:()=>w(!1),onConfirm:J}),e.jsxs("div",{style:{maxWidth:1100,margin:"0 auto",padding:"32px 24px 80px"},children:[e.jsxs("div",{style:{marginBottom:28},children:[e.jsxs(v,{to:"/browse",className:"cp-back-link",style:{marginBottom:14,display:"inline-flex"},children:[e.jsx(re,{size:14})," Catalogue"]}),e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap"},children:[e.jsx("h1",{style:{fontSize:28,fontWeight:700,letterSpacing:"-0.5px",color:"var(--text-1)"},children:a==="fr"?"Mon panier":"My cart"}),e.jsxs("span",{style:{fontSize:13,color:"var(--text-2)"},children:[L," article",L!==1?"s":""]})]})]}),e.jsxs("div",{className:"cp-grid",style:{display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"start"},children:[e.jsxs("div",{className:"cp-card",style:{padding:12},children:[s.map((r,t)=>e.jsxs("div",{children:[e.jsxs("div",{className:"cp-item-row",children:[e.jsx("div",{className:"cp-thumb",children:r.image?e.jsx("img",{src:r.image,alt:r.name,style:{width:"100%",height:"100%",objectFit:"cover",filter:"var(--img-filter)"}}):"🛒"}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:14,fontWeight:600,color:"var(--text-1)",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:r.name}),e.jsxs("div",{style:{fontSize:12,color:"var(--text-3)",marginBottom:6},children:[r.fournisseurName," · ",r.unit]}),e.jsxs("div",{style:{fontSize:12,color:"var(--accent)",fontWeight:500},children:[p(r.price)," / ",r.unit]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("button",{className:"cp-icon-btn",onClick:()=>m(r.productId,r.quantity-1),children:e.jsx(te,{size:13})}),e.jsx("div",{style:{fontSize:13,fontWeight:600,color:"var(--text-1)",minWidth:24,textAlign:"center"},children:r.quantity}),e.jsx("button",{className:"cp-icon-btn",onClick:()=>m(r.productId,r.quantity+1),children:e.jsx(se,{size:13})})]}),e.jsx("div",{style:{fontSize:14,fontWeight:700,color:"var(--text-1)",minWidth:80,textAlign:"right"},children:p(r.price*r.quantity)}),e.jsx("button",{className:"cp-remove-btn",onClick:()=>g(r.productId),children:e.jsx(ae,{size:14})})]}),t<s.length-1&&e.jsx("div",{style:{height:1,background:"var(--border)",margin:"0 16px"}})]},r.productId)),e.jsx("div",{style:{padding:"12px 16px 4px"},children:e.jsx("button",{onClick:i,className:"cp-back-link",style:{background:"none",border:"none",cursor:"pointer",padding:0,fontSize:12},children:a==="fr"?"Vider le panier":"Clear cart"})})]}),e.jsxs("div",{className:"cp-card cp-summary-panel",style:{padding:20,position:"sticky",top:24},children:[e.jsxs("div",{className:"cp-label",style:{marginBottom:10,display:"flex",alignItems:"center",gap:6},children:[e.jsx(ne,{size:13})," ",a==="fr"?"Livraison":"Delivery"]}),e.jsx("select",{value:l,onChange:r=>n(r.target.value),className:"cp-select",children:Object.entries(F).map(([r,t])=>e.jsxs("option",{value:r,children:[t.label," — ",t.fee," MAD"]},r))}),e.jsx("div",{className:"cp-divider"}),e.jsxs("div",{className:"cp-label",style:{marginBottom:10,display:"flex",alignItems:"center",gap:6},children:[e.jsx(ie,{size:13})," ",a==="fr"?"Code promo":"Promo code"]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("input",{value:d,onChange:r=>Y(r.target.value),placeholder:"GREENLEAF",onKeyDown:r=>r.key==="Enter"&&O(),className:"cp-input",style:{flex:1,textTransform:"uppercase"}}),e.jsx("button",{onClick:O,className:"cp-btn cp-btn-primary cp-btn-sm",style:{width:"auto"},children:"OK"})]}),j&&e.jsx("div",{style:{fontSize:12,marginTop:8,color:j.ok?"var(--accent)":"var(--danger-text)"},children:j.text}),M&&e.jsx("div",{style:{fontSize:12,marginTop:10,color:"var(--danger-text)",background:"var(--danger-bg)",padding:10,borderRadius:8},children:M}),e.jsx("div",{className:"cp-divider"}),e.jsx("div",{className:"cp-label",style:{marginBottom:6},children:"Résumé"}),e.jsxs("div",{className:"cp-summary-row",children:[e.jsx("span",{children:"Sous-total"}),e.jsx("span",{children:p(b)})]}),e.jsxs("div",{className:"cp-summary-row",children:[e.jsx("span",{children:a==="fr"?"Livraison":"Delivery"}),e.jsx("span",{children:p(D)})]}),e.jsxs("div",{className:"cp-summary-row",children:[e.jsx("span",{children:"TVA (20%)"}),e.jsx("span",{children:p(W)})]}),N>0&&e.jsxs("div",{className:"cp-summary-row",children:[e.jsx("span",{children:"Réduction"}),e.jsxs("span",{style:{color:"var(--accent)"},children:["−",p(N)]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:14,marginTop:8,borderTop:"1px solid var(--border)"},children:[e.jsx("span",{style:{fontSize:13,fontWeight:600,color:"var(--text-1)"},children:"Total"}),e.jsx("span",{style:{fontSize:22,fontWeight:700,color:"var(--accent)"},children:p(P)})]}),C&&e.jsxs("div",{style:{fontSize:12,color:"var(--text-3)",marginTop:8},children:["Mode : ",Q.find(r=>r.id===C)?.label]}),e.jsx("div",{style:{marginTop:20,display:"flex",flexDirection:"column",gap:10},children:I?e.jsxs("div",{className:"cp-success-banner",children:[e.jsx(V,{size:16})," ",a==="fr"?"Commande confirmee":"Order confirmed"]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>R("full"),disabled:S,className:"cp-btn cp-btn-primary",children:S?"Envoi...":"Confirmer la commande"}),e.jsxs("button",{onClick:()=>w(!0),disabled:S,className:"cp-btn cp-btn-ghost",children:[e.jsx(K,{size:15})," Payer en plusieurs fois"]})]})})]})]})]})]})}export{he as default};
