import React from 'react';
import { X, Check, FileText } from 'lucide-react';
import { Product } from '../../data/products';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#09090b] border border-white/20 p-6 md:p-8 rounded-2xl shadow-2xl z-10 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white/60" />
            <span className="font-tech text-xs tracking-widest text-white/60 uppercase">
              LABORATORY ANALYSIS // {product.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-tech text-white/40 tracking-[0.2em] uppercase block mb-2">
              FORMULATION SPECIFICATIONS
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-tech">
              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 text-[10px] block">ACIDITY / PH LEVEL</span>
                <span className="text-white font-bold mt-1 block">{product.specs.ph}</span>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 text-[10px] block">TAURINE AMINO ACID</span>
                <span className="text-white font-bold mt-1 block">{product.specs.taurine}</span>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 text-[10px] block">CARBONATION PRESSURE</span>
                <span className="text-white font-bold mt-1 block">{product.specs.carbonation}</span>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 text-[10px] block">CAN ALLOY INTEGRITY</span>
                <span className="text-white font-bold mt-1 block">99.8% RECYCLED AL</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-tech text-white/40 tracking-[0.2em] uppercase block mb-2">
              CERTIFIED LABORATORY CLEARANCES
            </span>
            <div className="space-y-2 text-xs font-tech">
              <div className="flex items-center gap-2 p-2.5 rounded bg-white/5 border border-white/10 text-white/80">
                <Check className="w-4 h-4 text-white" />
                <span>Zero banned substances (WADA / ISO 17025 compliant)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-white/5 border border-white/10 text-white/80">
                <Check className="w-4 h-4 text-white" />
                <span>Non-GMO, vegan botanical cold distillation</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-white/5 border border-white/10 text-white/80">
                <Check className="w-4 h-4 text-white" />
                <span>100% BPA-free food-grade polymer inner lining</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/15 bg-white/5 font-tech text-xs text-white/60 leading-relaxed">
            <span className="text-white font-bold block mb-1">BATCH RELEASE NOTE:</span>
            Synthesized and cold-canned under cleanroom class 10,000 conditions. Retains peak carbonation and volatile botanical aromatics for 18 months from manufacturing date.
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-black font-tech text-xs font-bold uppercase rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            DISMISS REPORT
          </button>
        </div>
      </div>
    </div>
  );
};
