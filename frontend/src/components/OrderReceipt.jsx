import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';

/**
 * OrderReceipt - An elegant, print-ready B2B commercial invoice layout
 */
const OrderReceipt = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    // Save current title
    const originalTitle = document.title;
    document.title = `Invoice_${order.id}`;

    // Add temporary print-specific class to body for printing styling
    document.body.classList.add('printing-active');

    // Open print dialog
    window.print();

    // Reset title and print class
    document.title = originalTitle;
    document.body.classList.remove('printing-active');
  };

  const formattedDate = new Date(order.created_at || new Date()).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 print:p-0 print:bg-white print:relative print:z-auto">
      {/* Print styles injected directly to apply only when print dialog opens */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div 
        id="print-invoice-area" 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-luxury border border-slate-100 overflow-hidden relative flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Header toolbar (Hidden during print) */}
        <div className="no-print bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-brand-accent rounded-full animate-pulse"></span>
            <span className="text-xs font-black text-brand-primary uppercase tracking-widest">B2B Commercial Invoice</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 print:overflow-visible">
          {/* Brand Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold">
                  🌿
                </div>
                <span className="text-2xl font-black tracking-tight text-brand-primary">
                  Green<span className="text-brand-accent">Leaf</span>
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Direct Morocco Food Supply Chain Marketplace
              </p>
            </div>
            
            {/* Status Stamp */}
            <div className="text-right">
              <div className="text-sm font-black text-slate-800 tracking-wider">INVOICE / FACTURE</div>
              <div className="text-xs text-brand-terracotta font-bold tracking-widest mt-1">
                #{order.id || 'N/A'}
              </div>
              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-2xs font-black uppercase tracking-wider ${
                  order.status === 'delivered' || order.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : order.status === 'confirmed' || order.status === 'accepted'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : order.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier vs Restaurant info grid */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Supplier / Fournisseur</h4>
              <div className="space-y-1 text-sm">
                <p className="font-black text-brand-primary">{order.fournisseur_name || 'Atlas Prime Maraîcher'}</p>
                <p className="text-xs text-slate-500 font-medium">Marché de Gros, Secteur A</p>
                <p className="text-xs text-slate-500 font-medium">Casablanca, Maroc</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">ICE: 001294875000084</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Client / Restaurant</h4>
              <div className="space-y-1 text-sm">
                <p className="font-black text-slate-800">{order.restaurant_name || 'Le Bistro Vert'}</p>
                <p className="text-xs text-slate-500 font-medium">Gauthier, Rue Moulay Ali</p>
                <p className="text-xs text-slate-500 font-medium">Casablanca, Maroc</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">ID: {order.restaurant_id || 'rest-1'}</p>
              </div>
            </div>
          </div>

          {/* Date & Metadata */}
          <div className="bg-slate-50/50 rounded-2xl p-4 grid grid-cols-3 text-center border border-slate-100">
            <div>
              <p className="text-3xs font-black text-slate-400 uppercase tracking-widest">Date Émise</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{formattedDate}</p>
            </div>
            <div>
              <p className="text-3xs font-black text-slate-400 uppercase tracking-widest">Date de Livraison</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{order.delivery_date || 'Sous 24h'}</p>
            </div>
            <div>
              <p className="text-3xs font-black text-slate-400 uppercase tracking-widest">Mode de Paiement</p>
              <p className="text-xs font-bold text-slate-700 mt-1">À la livraison (Cash/Chèque)</p>
            </div>
          </div>

          {/* Table Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Invoice Details / Détails des Articles</h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-3xs font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-5 py-3.5">Désignation</th>
                    <th className="px-5 py-3.5 text-center">Quantité</th>
                    <th className="px-5 py-3.5 text-right">Prix Unitaire</th>
                    <th className="px-5 py-3.5 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {item.product_name}
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-slate-600">
                          {item.quantity} {item.unit || 'Kg'}
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-slate-500">
                          {item.unit_price ? Number(item.unit_price).toFixed(2) : '0.00'} MAD
                        </td>
                        <td className="px-5 py-4 text-right font-black text-slate-800">
                          {(item.quantity * (item.unit_price || 0)).toFixed(2)} MAD
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-5 py-8 text-center text-slate-400 text-xs font-bold">
                        Aucun détail d'article disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Block */}
          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Sous-total H.T.</span>
                <span>{((order.total_amount || 0) * 0.8).toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>T.V.A (20%)</span>
                <span>{((order.total_amount || 0) * 0.2).toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Remise</span>
                <span className="text-brand-terracotta">-0.00 MAD</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 font-black text-base pt-3 border-t border-slate-100">
                <span>Total Net T.T.C</span>
                <span className="text-brand-secondary">{(order.total_amount || 0).toFixed(2)} MAD</span>
              </div>
            </div>
          </div>

          {/* Footnotes */}
          <div className="pt-8 border-t border-slate-100 text-[10px] text-slate-400 font-semibold leading-relaxed text-center space-y-1">
            <div className="flex justify-center items-center gap-1.5 text-brand-secondary font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Digital Record / Facture Conforme
            </div>
            <p>Green Leaf Morocco B2B S.A.R.L. - Plateforme de mise en relation directe.</p>
            <p>RC 49120 | Patent 3820485 | CNSS 9384012 | ICE 001294875000084</p>
            <p className="text-[9px] text-slate-300 mt-4">Merci pour votre confiance ! Shukran / Thank you.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;

