import{j as e,r as s,L as E,J as L,aa as T,h as I,a as V,X as H}from"./react-vendor-DT-Tbp60.js";import{u as U}from"./index-Dh-S5Fp-.js";import"./vendor-CUbtOFGM.js";import"./motion-vendor-BpwSzfL4.js";const f="/green-leaf/reel-card/",_=[{type:"amex",pattern:/^(34|37)/,max:15},{type:"mastercard",pattern:/^5[1-5]/,max:16},{type:"discover",pattern:/^6011/,max:16},{type:"troy",pattern:/^9792/,max:16},{type:"visa",pattern:/^4/,max:16}],G=Array.from({length:12},(r,i)=>String(i+1).padStart(2,"0")),J=new Date().getFullYear(),W=Array.from({length:12},(r,i)=>String(J+i)),X=r=>_.find(i=>i.pattern.test(r))?.type||"visa",b=r=>r==="amex"?15:16,Z=(r,i)=>{const p=r.replace(/\D/g,"").slice(0,b(i)),x=i==="amex"?[4,6,5]:[4,4,4,4];let t=0;return x.map(c=>{const l=p.slice(t,t+c);return t+=c,l}).filter(Boolean).join(" ")},q=(r,i)=>{const p=i==="amex"?"#### ###### #####":"#### #### #### ####",x=r.replace(/\D/g,"").slice(0,b(i));let t=0;return p.split("").map((c,l)=>{if(c===" ")return" ";const m=x[t++];return m?l>4&&l<p.length-4?"*":m:"#"}).join("")},K=()=>Math.floor(Math.random()*25)+1;function O({embedded:r=!1,lang:i,onClose:p}){const x=U(),t=i||x.lang,[c,l]=s.useState(""),[m,$]=s.useState(""),[v,F]=s.useState(""),[g,D]=s.useState(""),[j,M]=s.useState(""),[y,w]=s.useState(!1),[u,h]=s.useState(null),[R]=s.useState(K),N=s.useRef(null),C=s.useRef(null),k=s.useRef(null),Y={number:N,name:C,date:k},o=s.useMemo(()=>X(c),[c]),A=s.useMemo(()=>q(c,o),[c,o]),z=`${f}${o}.png`,S=`${f}${R}.jpeg`,d=a=>{const n=Y[a]?.current;n&&h({width:n.offsetWidth,height:n.offsetHeight,left:n.offsetLeft,top:n.offsetTop})},B=a=>{const n=a.target.value.replace(/\D/g,"").slice(0,b(o));l(n)},P=a=>{M(a.target.value.replace(/\D/g,"").slice(0,4))};return e.jsxs("section",{className:`payment-card-page${r?" embedded":""}`,children:[e.jsx("style",{children:`
        .payment-card-page {
          min-height: calc(100vh - 64px);
          padding: 28px clamp(14px, 4vw, 48px) 52px;
          color: #132318;
          font-family: "Source Sans Pro", Inter, system-ui, sans-serif;
        }
        .payment-card-page.embedded {
          min-height: 0;
          padding: 28px 0 0;
          color: #132318;
        }
        .pc-back {
          display:inline-flex; align-items:center; gap:8px; color:#334236;
          text-decoration:none; font-size:13px; margin-bottom:22px;
        }
        .pc-shell {
          display:grid; grid-template-columns:minmax(300px, 540px) minmax(260px, 1fr);
          gap:clamp(24px, 5vw, 76px); align-items:center; max-width:1180px; margin:0 auto;
        }
        .payment-card-page.embedded .pc-shell {
          display:block;
          max-width:640px;
          margin:0;
        }
        .pc-copy small {
          display:inline-flex; align-items:center; gap:8px; color:#4c7846; font-size:11px;
          letter-spacing:.14em; text-transform:uppercase; margin-bottom:14px;
        }
        .pc-copy h1 {
          font-family:"DM Serif Display", Georgia, serif; font-size:clamp(34px, 5vw, 64px);
          line-height:1; font-weight:400; margin:0 0 16px; color:#171915;
        }
        .pc-copy p { max-width:470px; color:#5c6258; line-height:1.7; margin:0 0 22px; font-size:14px; }
        .pc-trust { display:flex; gap:10px; flex-wrap:wrap; }
        .pc-pill { display:inline-flex; align-items:center; gap:7px; border:1px solid #dfded8; border-radius:999px; padding:8px 12px; font-size:12px; color:#454b43; background:#fff; }
        .pc-form { max-width:570px; width:100%; justify-self:center; }
        .payment-card-page.embedded .pc-form { max-width:570px; }
        .pc-embedded-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:18px; }
        .pc-embedded-head h3 { margin:0; color:var(--page-text, #1a1a1a); font-size:22px; line-height:1.2; }
        .pc-embedded-head p { margin:6px 0 0; color:var(--text-muted, #666); font-size:14px; line-height:1.5; }
        .pc-close { width:36px; height:36px; border-radius:50%; border:1px solid var(--page-border, #ddd); background:var(--card-bg, #181818); color:var(--page-text, #fff); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
        .pc-card-list { margin-bottom:-130px; position:relative; z-index:2; }
        .pc-card {
          max-width:430px; height:270px; margin:0 auto; position:relative; width:100%;
          transform-style:preserve-3d; perspective:2000px;
        }
        .pc-card-side {
          position:absolute; inset:0; border-radius:15px; overflow:hidden;
          box-shadow:0 20px 60px rgba(14,42,90,.35);
          backface-visibility:hidden; transform-style:preserve-3d;
          transition:transform .8s cubic-bezier(.71,.03,.56,.85);
        }
        .pc-card-front { transform:rotateY(${y?"180deg":"0deg"}); }
        .pc-card-back { transform:rotateY(${y?"0deg":"-180deg"}); }
        .pc-card-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .pc-card-side::after { content:""; position:absolute; inset:0; background:rgba(6,2,29,.45); }
        .pc-card-inner {
          position:relative; z-index:2; height:100%; padding:25px 15px;
          font-family:"Source Code Pro", monospace; color:white; text-shadow:7px 6px 10px rgba(14,42,90,.8);
        }
        .pc-focus {
          position:absolute; z-index:3; border-radius:5px; border:2px solid rgba(255,255,255,.65);
          box-shadow:0 10px 30px rgba(0,0,0,.22); transition:all .35s cubic-bezier(.71,.03,.56,.85);
          pointer-events:none; opacity:${u?1:0};
          width:${u?.width||0}px; height:${u?.height||0}px;
          transform:translate(${u?.left||0}px, ${u?.top||0}px);
        }
        .pc-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding:0 10px; }
        .pc-chip { width:60px; }
        .pc-brand { height:45px; max-width:100px; object-fit:contain; object-position:top right; animation:pc-up .25s ease both; }
        .pc-number {
          display:inline-block; padding:10px 15px; margin-bottom:35px; font-size:27px;
          font-weight:500; letter-spacing:1px; cursor:pointer; white-space:pre;
        }
        .pc-number span, .pc-name span, .pc-date span { display:inline-block; animation:pc-up .25s ease both; }
        .pc-card-content { display:flex; align-items:flex-start; color:white; }
        .pc-info { max-width:calc(100% - 85px); padding:10px 15px; cursor:pointer; overflow:hidden; }
        .pc-label { opacity:.72; font-size:13px; margin-bottom:6px; }
        .pc-name { font-size:18px; line-height:1; white-space:nowrap; text-transform:uppercase; overflow:hidden; text-overflow:ellipsis; min-height:20px; }
        .pc-date { margin-left:auto; width:86px; padding:10px; font-size:18px; cursor:pointer; white-space:nowrap; }
        .pc-date .pc-label { width:100%; }
        .pc-band { height:50px; background:rgba(0,0,19,.8); margin-top:30px; position:relative; z-index:2; }
        .pc-cvv { position:relative; z-index:2; padding:15px; text-align:right; color:white; }
        .pc-cvv-band { height:45px; background:white; border-radius:4px; color:#1a3b5d; display:flex; justify-content:flex-end; align-items:center; padding-right:10px; font-size:18px; margin-bottom:26px; }
        .pc-form-inner {
          background:white; border:1px solid #ecebe6; box-shadow:0 30px 60px rgba(90,116,148,.18);
          border-radius:10px; padding:35px; padding-top:180px;
        }
        .pc-input { margin-bottom:20px; }
        .pc-input label { display:block; font-size:14px; font-weight:600; color:#1a3b5d; margin-bottom:6px; }
        .pc-input input, .pc-input select {
          width:100%; height:50px; border-radius:5px; border:1px solid #ced6e0;
          background:white; color:#1a3b5d; font-size:17px; padding:5px 15px; transition:.2s border,.2s box-shadow;
        }
        .pc-input input:focus, .pc-input select:focus { border-color:#4c7846; box-shadow:0 10px 20px -13px rgba(32,56,117,.35); outline:0; }
        .pc-row { display:flex; align-items:flex-start; gap:35px; }
        .pc-row .pc-input { flex:1; }
        .pc-expiry { display:flex; gap:15px; }
        .pc-cvv-input { max-width:150px; }
        .pc-submit { width:100%; height:54px; border:0; border-radius:5px; background:#4c7846; color:white; font-size:18px; font-weight:600; cursor:pointer; margin-top:4px; }
        @keyframes pc-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 980px) { .pc-shell { grid-template-columns:1fr; } .pc-copy { text-align:center; } .pc-copy p, .pc-trust { margin-left:auto; margin-right:auto; justify-content:center; } }
        @media (max-width: 520px) {
          .pc-card-list { margin-bottom:-118px; } .pc-card { max-width:310px; height:220px; width:92%; }
          .pc-card-inner { padding:20px 10px; } .pc-card-top { margin-bottom:24px; }
          .pc-chip { width:50px; } .pc-number { font-size:21px; margin-bottom:16px; padding:10px; }
          .pc-info { padding:10px; } .pc-name, .pc-date { font-size:16px; }
          .pc-form-inner { padding:24px; padding-top:165px; } .pc-row { flex-direction:column; gap:0; }
          .pc-cvv-input { max-width:none; } .pc-copy h1 { font-size:34px; }
        }
      `}),!r&&e.jsxs(E,{className:"pc-back",to:"/restaurant/commandes",children:[e.jsx(L,{size:15})," ",t==="fr"?"Retour aux commandes":"Back to orders"]}),e.jsxs("div",{className:"pc-shell",children:[!r&&e.jsxs("div",{className:"pc-copy",children:[e.jsxs("small",{children:[e.jsx(T,{size:14})," ",t==="fr"?"Paiement restaurant":"Restaurant payments"]}),e.jsx("h1",{children:t==="fr"?"Carte de paiement interactive.":"Interactive payment card."}),e.jsx("p",{children:t==="fr"?"Un espace visuel pour préparer la future gestion des cartes restaurant. Cette version est une interface demo, pas encore connectee au paiement reel.":"A visual space for future restaurant card management. This version is a UI demo and is not connected to live payment yet."}),e.jsxs("div",{className:"pc-trust",children:[e.jsxs("span",{className:"pc-pill",children:[e.jsx(I,{size:14})," ",t==="fr"?"Demo securisee":"Safe demo"]}),e.jsxs("span",{className:"pc-pill",children:[e.jsx(V,{size:14})," ",t==="fr"?"Aucune carte sauvegardee":"No card saved"]})]})]}),e.jsxs("div",{className:"pc-form",children:[r&&e.jsxs("div",{className:"pc-embedded-head",children:[e.jsxs("div",{children:[e.jsx("h3",{children:t==="fr"?"Ajouter une carte":"Add a card"}),e.jsx("p",{children:t==="fr"?"Interface de démonstration pour la future carte de paiement.":"Demo interface for the future payment card flow."})]}),p&&e.jsx("button",{className:"pc-close",type:"button",onClick:p,"aria-label":t==="fr"?"Fermer":"Close",children:e.jsx(H,{size:17})})]}),e.jsx("div",{className:"pc-card-list",children:e.jsxs("div",{className:"pc-card",children:[e.jsxs("div",{className:"pc-card-side pc-card-front",children:[e.jsx("img",{className:"pc-card-bg",src:S,alt:"","aria-hidden":"true"}),e.jsxs("div",{className:"pc-card-inner",children:[e.jsx("div",{className:"pc-focus"}),e.jsxs("div",{className:"pc-card-top",children:[e.jsx("img",{className:"pc-chip",src:`${f}chip.png`,alt:""}),e.jsx("img",{className:"pc-brand",src:z,alt:o},o)]}),e.jsx("div",{className:"pc-number",ref:N,onClick:()=>d("number"),children:A.split("").map((a,n)=>e.jsx("span",{children:a},`${a}-${n}`))}),e.jsxs("div",{className:"pc-card-content",children:[e.jsxs("div",{className:"pc-info",ref:C,onClick:()=>d("name"),children:[e.jsx("div",{className:"pc-label",children:"Card Holder"}),e.jsx("div",{className:"pc-name",children:(m||"Full Name").split("").map((a,n)=>e.jsx("span",{children:a},`${a}-${n}`))})]}),e.jsxs("div",{className:"pc-date",ref:k,onClick:()=>d("date"),children:[e.jsx("div",{className:"pc-label",children:"Expires"}),e.jsx("span",{children:v||"MM"}),"/",e.jsx("span",{children:g?g.slice(2):"YY"})]})]})]})]}),e.jsxs("div",{className:"pc-card-side pc-card-back",children:[e.jsx("img",{className:"pc-card-bg",src:S,alt:"","aria-hidden":"true"}),e.jsx("div",{className:"pc-band"}),e.jsxs("div",{className:"pc-cvv",children:[e.jsx("div",{className:"pc-label",children:"CVV"}),e.jsx("div",{className:"pc-cvv-band",children:j.replace(/./g,"*")}),e.jsx("img",{className:"pc-brand",src:z,alt:""})]})]})]})}),e.jsxs("form",{className:"pc-form-inner",onSubmit:a=>a.preventDefault(),children:[e.jsxs("div",{className:"pc-input",children:[e.jsx("label",{htmlFor:"pc-number",children:"Card Number"}),e.jsx("input",{id:"pc-number",value:Z(c,o),inputMode:"numeric",autoComplete:"off",onChange:B,onFocus:()=>d("number"),onBlur:()=>h(null)})]}),e.jsxs("div",{className:"pc-input",children:[e.jsx("label",{htmlFor:"pc-name",children:"Card Holder"}),e.jsx("input",{id:"pc-name",value:m,autoComplete:"off",onChange:a=>$(a.target.value.replace(/[^a-zA-Z\s]/g,"").slice(0,28)),onFocus:()=>d("name"),onBlur:()=>h(null)})]}),e.jsxs("div",{className:"pc-row",children:[e.jsxs("div",{className:"pc-input",children:[e.jsx("label",{children:"Expiration Date"}),e.jsxs("div",{className:"pc-expiry",children:[e.jsxs("select",{value:v,onChange:a=>F(a.target.value),onFocus:()=>d("date"),onBlur:()=>h(null),children:[e.jsx("option",{value:"",children:"Month"}),G.map(a=>e.jsx("option",{value:a,children:a},a))]}),e.jsxs("select",{value:g,onChange:a=>D(a.target.value),onFocus:()=>d("date"),onBlur:()=>h(null),children:[e.jsx("option",{value:"",children:"Year"}),W.map(a=>e.jsx("option",{value:a,children:a},a))]})]})]}),e.jsxs("div",{className:"pc-input pc-cvv-input",children:[e.jsx("label",{htmlFor:"pc-cvv",children:"CVV"}),e.jsx("input",{id:"pc-cvv",value:j,inputMode:"numeric",autoComplete:"off",onChange:P,onFocus:()=>w(!0),onBlur:()=>w(!1)})]})]}),e.jsx("button",{className:"pc-submit",type:"submit",children:t==="fr"?"Enregistrer plus tard":"Save later"})]})]})]})]})}function re(){return e.jsx(O,{})}export{O as PaymentCardForm,re as default};
