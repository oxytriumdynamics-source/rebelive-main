import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  ArrowRight,
  Home,
  ShoppingBag,
  User,
  Package,
  HelpCircle,
  Sparkles,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { Product } from '../../data/products';
import { useAuth } from '@/context/AuthContext';
import { HoverRollText } from './HoverRollText';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  selectedIndex?: number;
  onSelectFlavor?: (index: number) => void;
  onOpenSpecs?: () => void;
  onOpenOrder?: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#070709] border-l border-white/15 flex flex-col justify-between shadow-2xl z-10 text-white animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-black text-xl tracking-tight text-white">REBELIVE</span>
            <span className="text-[9px] font-tech px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20 tracking-wider">
              MENU
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-3">
          {/* HOME */}
          <Link
            href="/"
            onClick={onClose}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/30 transition-all text-white"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-white/20 transition-colors">
                <Home className="w-4 h-4" />
              </div>
              <div className="font-display text-base font-bold tracking-wide uppercase text-white">
                <HoverRollText text="HOME" />
              </div>
            </div>
            <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80"></span>
          </Link>

          {/* SHOP */}
          <Link
            href="/shop"
            onClick={onClose}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-white/25 bg-gradient-to-r from-white/[0.1] to-white/[0.03] hover:bg-white/[0.15] hover:border-white/50 transition-all text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="font-display text-base font-black tracking-wide uppercase text-white">
                <HoverRollText text="SHOP" />
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-black font-bold tracking-wider">
              ORDER
            </span>
          </Link>

          {/* PROFILE */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-xl border border-amber-400/35 bg-amber-400/[0.06] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-400/60 bg-black shrink-0">
                    <Image
                      src={user.avatarUrl || '/brand/panther_white_icon-transparent.webp'}
                      alt={user.firstName || 'User'}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-display text-sm font-bold tracking-wide uppercase text-amber-200 truncate">
                      {user.firstName} {user.lastName || ''}
                    </div>
                    <div className="text-[9.5px] font-mono text-amber-400/80">
                      OPERATOR ACTIVE
                    </div>
                  </div>
                </div>
                <span className="text-[9.5px] font-mono text-amber-400/90">ONLINE</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="py-1.5 px-3 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 font-tech text-[10px] font-bold tracking-wider uppercase text-center border border-amber-400/30 transition-colors"
                >
                  VIEW PROFILE
                </Link>
                <button
                  onClick={async () => {
                    onClose();
                    await logoutUser();
                  }}
                  className="py-1.5 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 font-tech text-[10px] font-bold tracking-wider uppercase text-center border border-red-500/30 transition-colors cursor-pointer"
                >
                  SIGN OUT
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={onClose}
              className="group flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/30 transition-all text-white"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-white/20 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div className="font-display text-base font-bold tracking-wide uppercase text-white">
                  <HoverRollText text="PROFILE" />
                </div>
              </div>
              <span className="text-[9.5px] font-mono text-white/40 group-hover:text-white/80">SIGN IN</span>
            </Link>
          )}

          {/* Divider */}
          <div className="pt-2 pb-1">
            <div className="h-[1px] bg-white/[0.08]" />
          </div>

          {/* OUR STORY */}
          <Link
            href="/story"
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all text-white"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span className="font-display text-sm font-semibold tracking-wide uppercase">
                OUR STORY
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* PERSONAS */}
          <Link
            href="/persona"
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all text-white"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span className="font-display text-sm font-semibold tracking-wide uppercase">
                PERSONAS
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* TRACK ORDER */}
          <Link
            href="/track-order"
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all text-white"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span className="font-display text-sm font-semibold tracking-wide uppercase">
                TRACK ORDER
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* FAQ */}
          <Link
            href="/faq"
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all text-white"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span className="font-display text-sm font-semibold tracking-wide uppercase">
                FAQ
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* CONTACT */}
          <Link
            href="/contact"
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all text-white"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span className="font-display text-sm font-semibold tracking-wide uppercase">
                CONTACT
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Footer */}
        <div className="p-6 md:px-8 py-4 border-t border-white/10 text-[9.5px] font-tech text-white/35 tracking-widest flex items-center justify-between shrink-0 bg-[#070709]">
          <span>OXYTRIUM PVT LTD</span>
          <span>© {new Date().getFullYear()} REBELIVE</span>
        </div>
      </div>
    </div>
  );
};
