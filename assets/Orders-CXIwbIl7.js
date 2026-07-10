import{r as i,j as e,L as N,a3 as L,S as T,C as y,Z as I,$ as F,a4 as U,l as $,a5 as q,a6 as B,Y as P,a7 as W}from"./react-vendor-DT-Tbp60.js";import{u as M,c as S}from"./index-CNFTLkJs.js";import"./vendor-CUbtOFGM.js";import"./motion-vendor-BpwSzfL4.js";const Q={pending:{label:"Waiting for supplier",tone:"#8a5a00",bg:"#fff7df",border:"#f3d58a"},confirmed:{label:"Accepted",tone:"#176047",bg:"#eaf8f0",border:"#a8dec2"},delivered:{label:"Delivered",tone:"#1f6f3d",bg:"#e7f7e9",border:"#9ad2a2"},rejected:{label:"Rejected",tone:"#9b1c1c",bg:"#fff0f0",border:"#efb0b0"},cancelled:{label:"Cancelled",tone:"#6f1d1b",bg:"#fff0f0",border:"#efb0b0"}},V=[{value:"all",label:"All orders"},{value:"pending",label:"Waiting"},{value:"confirmed",label:"Accepted"},{value:"delivered",label:"Delivered"},{value:"rejected",label:"Rejected"},{value:"cancelled",label:"Cancelled"}],Y=[{value:"newest",label:"Newest first"},{value:"oldest",label:"Oldest first"},{value:"price_high",label:"Highest total"},{value:"price_low",label:"Lowest total"}],H=[{key:"pending",title:"Order placed",detail:"Sent to the supplier"},{key:"confirmed",title:"Accepted",detail:"Supplier is preparing it"},{key:"delivered",title:"Delivered",detail:"Order completed"}],f=t=>`${Number(t||0).toFixed(2)} MAD`,K=t=>t?new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(t)):"Date unavailable",X=t=>Q[t]||{label:t||"Unknown",tone:"#374151",bg:"#f4f4f2",border:"#deded8"};function Z({status:t}){const o=X(t);return e.jsx("span",{style:{display:"inline-flex",alignItems:"center",border:`1px solid ${o.border}`,background:o.bg,color:o.tone,borderRadius:999,padding:"5px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"},children:o.label})}function G({status:t}){const o=t==="rejected"||t==="cancelled",c=t==="delivered"?2:t==="confirmed"?1:0;return e.jsxs("div",{className:"ro-timeline","aria-label":"Order tracking",children:[H.map((p,d)=>{const l=!o&&d<=c,x=!o&&d===c;return e.jsxs("div",{className:`ro-step ${l?"is-done":""} ${x?"is-active":""}`,children:[e.jsx("span",{className:"ro-step-dot",children:l?e.jsx(P,{size:13}):d+1}),e.jsxs("span",{children:[e.jsx("strong",{children:p.title}),e.jsx("small",{children:p.detail})]})]},p.key)}),o&&e.jsxs("div",{className:"ro-step is-stopped",children:[e.jsx("span",{className:"ro-step-dot",children:e.jsx(W,{size:13})}),e.jsxs("span",{children:[e.jsx("strong",{children:t==="cancelled"?"Cancelled":"Rejected"}),e.jsx("small",{children:"This order will not continue"})]})]})]})}function J(){return e.jsx("div",{className:"ro-list","aria-label":"Loading orders",children:[0,1,2].map(t=>e.jsxs("div",{className:"ro-card ro-skeleton",children:[e.jsx("div",{}),e.jsx("div",{}),e.jsx("div",{})]},t))})}function se(){const{lang:t}=M(),[o,c]=i.useState([]),[p,d]=i.useState(!0),[l,x]=i.useState(""),[w,z]=i.useState(""),[b,C]=i.useState(""),[u,O]=i.useState("all"),[j,_]=i.useState("newest"),[R,k]=i.useState(null),[m,A]=i.useState({current_page:1,last_page:1,total:0}),g=i.useCallback(async(r=1)=>{d(!0),x("");try{const s={page:r,sort:j};u!=="all"&&(s.status=u),b.trim()&&(s.search=b.trim());const a=(await S.get("/api/restaurant/orders",{params:s})).data||{},h=Array.isArray(a.data)?a.data:[];c(h),A({current_page:a.current_page||1,last_page:a.last_page||1,total:a.total||h.length})}catch(s){const n=s?.response?.status,a=s?.response?.data?.message;c([]),x(n===403?t==="fr"?"Votre compte restaurant doit etre verifie avant de suivre les commandes.":"Your restaurant account must be verified before you can track orders.":a||(t==="fr"?"Les commandes ne peuvent pas charger pour le moment.":"Orders could not load right now. Try again in a moment."))}finally{d(!1)}},[j,u,b,t]);i.useEffect(()=>{g(1)},[g]);const v=i.useMemo(()=>o.reduce((r,s)=>(r.total+=Number(s.total_price||0),r[s.status]=(r[s.status]||0)+1,r),{total:0}),[o]),D=r=>{r.preventDefault(),C(w)},E=async()=>{try{const r=await S.get("/api/restaurant/orders/export",{responseType:"blob"}),s=window.URL.createObjectURL(new Blob([r.data])),n=document.createElement("a");n.href=s,n.setAttribute("download",`greenleaf-orders-${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(n),n.click(),n.remove(),window.URL.revokeObjectURL(s)}catch{x(t==="fr"?"L export ne peut pas etre cree pour le moment.":"The export could not be created right now.")}};return e.jsxs("main",{className:"restaurant-orders-page",children:[e.jsx("style",{children:`
        .restaurant-orders-page {
          min-height: 100vh;
          background: var(--page-bg, #faf9f6);
          color: var(--page-text, #1a1a1a);
          padding: 32px clamp(16px, 4vw, 56px) 56px;
          font-family: Inter, system-ui, sans-serif;
        }

        .ro-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .ro-back {
          display: inline-flex;
          color: #4f514c;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 28px;
        }

        .ro-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: end;
          margin-bottom: 28px;
        }

        .ro-eyebrow {
          margin: 0 0 8px;
          color: var(--accent-color, #2d9b4f);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .ro-header h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1;
          letter-spacing: 0;
          text-transform: none;
        }

        .ro-header p {
          margin: 12px 0 0;
          max-width: 620px;
          color: #666b62;
          font-size: 15px;
          line-height: 1.6;
        }

        .ro-export,
        .ro-retry,
        .ro-empty a,
        .ro-pagination button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          border: 1px solid #20231f;
          background: #20231f;
          color: #fff;
          border-radius: 6px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }

        .ro-export:hover,
        .ro-retry:hover,
        .ro-empty a:hover {
          background: var(--gl-green, #2d9b4f);
          border-color: var(--gl-green, #2d9b4f);
        }

        .ro-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .ro-stat {
          border: 1px solid rgba(0,0,0,.08);
          background: #fff;
          border-radius: 8px;
          padding: 16px;
        }

        .ro-stat span {
          display: block;
          color: #74776f;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 8px;
        }

        .ro-stat strong {
          display: block;
          font-size: 24px;
        }

        .ro-toolbar {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 190px 180px;
          gap: 12px;
          margin-bottom: 20px;
        }

        .ro-search,
        .ro-select {
          height: 46px;
          border: 1px solid rgba(0,0,0,.1);
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .ro-search input,
        .ro-select select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #20231f;
          font-size: 14px;
        }

        .ro-select select {
          appearance: none;
          cursor: pointer;
        }

        .ro-list {
          display: grid;
          gap: 14px;
        }

        .ro-card {
          border: 1px solid rgba(0,0,0,.09);
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(20, 27, 31, .06);
        }

        .ro-card-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          padding: 20px;
          cursor: pointer;
        }

        .ro-title-row,
        .ro-meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .ro-title-row h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: 0;
          text-transform: none;
        }

        .ro-meta-row {
          margin-top: 10px;
          color: #656960;
          font-size: 13px;
        }

        .ro-total {
          text-align: right;
        }

        .ro-total strong {
          display: block;
          font-size: 20px;
          margin-bottom: 9px;
        }

        .ro-timeline {
          border-top: 1px solid rgba(0,0,0,.07);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
          padding: 18px 20px;
          background: #fbfbf8;
        }

        .ro-step {
          position: relative;
          display: flex;
          gap: 10px;
          color: #8a8d86;
          min-width: 0;
        }

        .ro-step:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 13px;
          left: 30px;
          right: 12px;
          height: 2px;
          background: #dcded8;
        }

        .ro-step.is-done:not(:last-child)::after {
          background: var(--gl-green, #2d9b4f);
        }

        .ro-step-dot {
          position: relative;
          z-index: 1;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid #d6d8d2;
          background: #fff;
          color: #777b72;
          font-size: 12px;
          font-weight: 800;
        }

        .ro-step.is-done .ro-step-dot {
          background: var(--gl-green, #2d9b4f);
          border-color: var(--gl-green, #2d9b4f);
          color: #fff;
        }

        .ro-step.is-stopped .ro-step-dot {
          background: #a32929;
          border-color: #a32929;
          color: #fff;
        }

        .ro-step strong {
          display: block;
          color: #22241f;
          font-size: 13px;
        }

        .ro-step small {
          display: block;
          margin-top: 3px;
          font-size: 12px;
          line-height: 1.35;
        }

        .ro-details {
          border-top: 1px solid rgba(0,0,0,.07);
          padding: 0 20px 20px;
        }

        .ro-items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 18px;
          font-size: 14px;
        }

        .ro-items th {
          text-align: left;
          color: #74776f;
          font-size: 11px;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 0 0 10px;
        }

        .ro-items td {
          border-top: 1px solid rgba(0,0,0,.06);
          padding: 12px 0;
          color: #343731;
        }

        .ro-items th:not(:first-child),
        .ro-items td:not(:first-child) {
          text-align: right;
        }

        .ro-note {
          margin-top: 12px;
          border: 1px solid #e6e2d8;
          background: #fffaf0;
          border-radius: 8px;
          padding: 12px;
          color: #5d5546;
          font-size: 13px;
        }

        .ro-alert,
        .ro-empty {
          border: 1px solid rgba(0,0,0,.09);
          background: #fff;
          border-radius: 8px;
          padding: 28px;
        }

        .ro-alert {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #6f1d1b;
        }

        .ro-alert div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ro-empty {
          text-align: center;
          padding: 64px 24px;
        }

        .ro-empty h2 {
          margin: 16px 0 8px;
          letter-spacing: 0;
          text-transform: none;
        }

        .ro-empty p {
          margin: 0 auto 22px;
          max-width: 420px;
          color: #666b62;
          line-height: 1.6;
        }

        .ro-pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .ro-pagination button {
          width: 42px;
          padding: 0;
          background: #fff;
          color: #20231f;
        }

        .ro-pagination button.is-active {
          background: #20231f;
          color: #fff;
        }

        .ro-skeleton {
          min-height: 158px;
          padding: 20px;
        }

        .ro-skeleton div {
          height: 16px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ecebe7, #f7f6f1, #ecebe7);
          background-size: 200% 100%;
          animation: ro-pulse 1.2s linear infinite;
          margin-bottom: 14px;
        }

        .ro-skeleton div:nth-child(1) { width: 42%; }
        .ro-skeleton div:nth-child(2) { width: 70%; }
        .ro-skeleton div:nth-child(3) { width: 55%; }

        @keyframes ro-pulse {
          to { background-position: -200% 0; }
        }

        @media (max-width: 820px) {
          .ro-header,
          .ro-toolbar,
          .ro-card-main {
            grid-template-columns: 1fr;
          }

          .ro-total {
            text-align: left;
          }

          .ro-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ro-timeline {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .ro-step:not(:last-child)::after {
            left: 13px;
            right: auto;
            top: 30px;
            bottom: -12px;
            width: 2px;
            height: auto;
          }

          .ro-items {
            min-width: 560px;
          }

          .ro-details {
            overflow-x: auto;
          }
        }
      `}),e.jsxs("div",{className:"ro-shell",children:[e.jsx(N,{className:"ro-back",to:"/browse",children:t==="fr"?"Retour au marche":"Back to marketplace"}),e.jsxs("section",{className:"ro-header",children:[e.jsxs("div",{children:[e.jsx("p",{className:"ro-eyebrow",children:t==="fr"?"Espace restaurant":"Restaurant portal"}),e.jsx("h1",{children:t==="fr"?"Suivi des commandes":"Order tracking"}),e.jsx("p",{children:t==="fr"?"Suivez chaque commande fournisseur, avec les produits, les totaux, les notes et le statut en direct.":"Follow every supplier order from request to acceptance and delivery, with products, totals, notes, and live status in one clean view."})]}),e.jsxs("button",{className:"ro-export",type:"button",onClick:E,children:[e.jsx(L,{size:16}),t==="fr"?"Exporter":"Export orders"]})]}),e.jsxs("section",{className:"ro-stats","aria-label":"Order summary",children:[e.jsxs("div",{className:"ro-stat",children:[e.jsx("span",{children:t==="fr"?"Commandes":"Total orders"}),e.jsx("strong",{children:m.total})]}),e.jsxs("div",{className:"ro-stat",children:[e.jsx("span",{children:t==="fr"?"En attente":"Waiting"}),e.jsx("strong",{children:v.pending||0})]}),e.jsxs("div",{className:"ro-stat",children:[e.jsx("span",{children:t==="fr"?"Acceptees":"Accepted"}),e.jsx("strong",{children:v.confirmed||0})]}),e.jsxs("div",{className:"ro-stat",children:[e.jsx("span",{children:t==="fr"?"Total visible":"Visible total"}),e.jsx("strong",{children:f(v.total)})]})]}),e.jsxs("form",{className:"ro-toolbar",onSubmit:D,children:[e.jsxs("label",{className:"ro-search",children:[e.jsx(T,{size:17,color:"#656960"}),e.jsx("input",{value:w,onChange:r=>z(r.target.value),placeholder:t==="fr"?"Chercher une commande ou fournisseur":"Search order number or supplier"})]}),e.jsxs("label",{className:"ro-select",children:[e.jsx("select",{value:u,onChange:r=>O(r.target.value),children:V.map(r=>e.jsx("option",{value:r.value,children:r.label},r.value))}),e.jsx(y,{size:16,color:"#656960"})]}),e.jsxs("label",{className:"ro-select",children:[e.jsx("select",{value:j,onChange:r=>_(r.target.value),children:Y.map(r=>e.jsx("option",{value:r.value,children:r.label},r.value))}),e.jsx(y,{size:16,color:"#656960"})]})]}),l&&e.jsxs("section",{className:"ro-alert",children:[e.jsxs("div",{children:[e.jsx(I,{size:20}),e.jsx("strong",{children:l})]}),e.jsxs("button",{className:"ro-retry",type:"button",onClick:()=>g(m.current_page),children:[e.jsx(F,{size:15}),t==="fr"?"Reessayer":"Retry"]})]}),p?e.jsx(J,{}):!l&&o.length===0?e.jsxs("section",{className:"ro-empty",children:[e.jsx(U,{size:42,color:"#6f756b"}),e.jsx("h2",{children:t==="fr"?"Aucune commande":"No orders yet"}),e.jsx("p",{children:t==="fr"?"Quand vous passez une commande, elle apparait ici avec son statut.":"Once you place an order from the marketplace, it will appear here with supplier acceptance and delivery tracking."}),e.jsx(N,{to:"/browse",children:t==="fr"?"Explorer":"Start shopping"})]}):l?null:e.jsxs(e.Fragment,{children:[e.jsx("section",{className:"ro-list",children:o.map(r=>{const s=r.items?.reduce((a,h)=>a+Number(h.quantity||0),0)||0,n=R===r.id;return e.jsxs("article",{className:"ro-card",children:[e.jsxs("div",{className:"ro-card-main",role:"button",tabIndex:0,onClick:()=>k(n?null:r.id),onKeyDown:a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),k(n?null:r.id))},children:[e.jsxs("div",{children:[e.jsxs("div",{className:"ro-title-row",children:[e.jsxs("h2",{children:["Order #",r.id]}),e.jsx(Z,{status:r.status})]}),e.jsxs("div",{className:"ro-meta-row",children:[e.jsxs("span",{children:[e.jsx($,{size:14})," ",r.fournisseur?.name||"Supplier"]}),e.jsxs("span",{children:[e.jsx(q,{size:14})," ",K(r.created_at)]}),e.jsxs("span",{children:[e.jsx(B,{size:14})," ",s," item",s===1?"":"s"]})]})]}),e.jsxs("div",{className:"ro-total",children:[e.jsx("strong",{children:f(r.total_price)}),e.jsx(y,{size:18,color:"#656960",style:{transform:n?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s ease"}})]})]}),e.jsx(G,{status:r.status}),n&&e.jsxs("div",{className:"ro-details",children:[e.jsxs("table",{className:"ro-items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Product"}),e.jsx("th",{children:"Qty"}),e.jsx("th",{children:"Unit price"}),e.jsx("th",{children:"Total"})]})}),e.jsx("tbody",{children:(r.items||[]).map(a=>e.jsxs("tr",{children:[e.jsxs("td",{children:[a.product_name||a.product?.name||"Product",a.promo_applied?" - promo applied":""]}),e.jsx("td",{children:a.quantity}),e.jsx("td",{children:f(a.unit_price)}),e.jsx("td",{children:f(Number(a.quantity||0)*Number(a.unit_price||0))})]},a.id))})]}),r.notes&&e.jsxs("div",{className:"ro-note",children:["Note: ",r.notes]})]})]},r.id)})}),m.last_page>1&&e.jsx("nav",{className:"ro-pagination","aria-label":"Order pages",children:Array.from({length:m.last_page},(r,s)=>s+1).map(r=>e.jsx("button",{className:r===m.current_page?"is-active":"",type:"button",onClick:()=>g(r),children:r},r))})]})]})]})}export{se as default};
