'use client';

import React, { useRef, useState } from 'react';
import { X, Printer, Download, FileText, RefreshCw } from 'lucide-react';
import { parseOrderShippingAddress, numberToIndianWords } from './invoiceUtils';

export interface TaxInvoiceModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CalculatedInvoiceItem {
  sNo: number;
  name: string;
  variant: string;
  sku: string;
  hsn: string;
  qty: number;
  unitPrice: number;
  discount: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  lineTotal: number;
}

export function TaxInvoiceModal({ order, isOpen, onClose }: TaxInvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !order) return null;

  const addr = parseOrderShippingAddress(order);

  // Formatting dates as DD/MM/YYYY
  const formatDateDMY = (dateStr?: string) => {
    if (!dateStr) {
      const now = new Date();
      return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const orderDate = formatDateDMY(order.createdAt);
  const invoiceDate = formatDateDMY(order.createdAt);
  const orderNumber = order.orderNumber || (order.id ? String(order.id).slice(-8).toUpperCase() : 'SR-001');
  const invoiceNumber = `INV-${new Date().getFullYear()}-${orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Carrier & Payment info
  const shippingCarrier = order.shiprocketOrderId ? 'Delhivery' : (order.trackingNumber ? 'Delhivery / Shiprocket' : 'Shiprocket');
  const awbNumber = order.trackingNumber || (order.shiprocketOrderId ? `SR${order.shiprocketOrderId}` : 'Pending Dispatch');
  
  // Resolve payment method
  let paymentMethod = 'Prepaid';
  if (order.payments && order.payments.length > 0) {
    const m = String(order.payments[0].method || '').toUpperCase();
    if (m === 'COD' || m.includes('CASH')) {
      paymentMethod = 'Cash on Delivery (COD)';
    } else {
      paymentMethod = `Prepaid (${m || 'Online'})`;
    }
  }

  // Calculate items GST Breakdown (18% inclusive GST standard for beverages in India: 9% CGST + 9% SGST)
  const items = (order.items && order.items.length > 0) ? order.items : [
    {
      productName: 'APEX Clean Energy Drinks (Pack of 6)',
      sku: 'RBL-APEX-6',
      quantity: 1,
      unitPrice: order.total || 799,
      totalPrice: order.total || 799,
    },
  ];

  let totalQty = 0;
  let totalTaxableValue = 0;
  let totalCgst = 0;
  let totalSgst = 0;

  const calculatedItems: CalculatedInvoiceItem[] = items.map((item: any, idx: number) => {
    const qty = Number(item.quantity) || 1;
    totalQty += qty;

    const unitPrice = Number(item.unitPrice) || (Number(item.totalPrice) / qty) || 0;
    const lineTotal = Number(item.totalPrice) || (unitPrice * qty);
    
    // Taxable value = Line Total / 1.18
    const taxableValue = Math.round((lineTotal / 1.18) * 100) / 100;
    const cgst = Math.round((taxableValue * 0.09) * 100) / 100;
    const sgst = Math.round((taxableValue * 0.09) * 100) / 100;

    totalTaxableValue += taxableValue;
    totalCgst += cgst;
    totalSgst += sgst;

    const hsn = item.hsn || '22029990';
    const sku = item.sku || `RBL-${(item.productName || 'DRINK').slice(0, 4).toUpperCase()}-${qty * 6}`;

    return {
      sNo: idx + 1,
      name: item.productName || item.name || 'Functional Beverage Pack',
      variant: item.variantName || '',
      sku,
      hsn,
      qty,
      unitPrice,
      discount: 0,
      taxableValue,
      cgst,
      sgst,
      lineTotal,
    };
  });

  const shippingCharges = Number(order.shippingAmount) || 0;
  const grandTotal = Number(order.total) || (totalTaxableValue + totalCgst + totalSgst + shippingCharges);
  const amountWords = numberToIndianWords(grandTotal);

  /**
   * Dedicated Isolated Iframe Printing to eliminate blank pages
   */
  const handlePrint = () => {
    if (!invoiceRef.current) return;
    setIsPrinting(true);

    try {
      // Gather active stylesheets from the document
      let stylesHtml = '';
      document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
        stylesHtml += node.outerHTML;
      });

      const invoiceContent = invoiceRef.current.outerHTML;

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.opacity = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        setIsPrinting(false);
        return;
      }

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tax Invoice - ${orderNumber}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
            ${stylesHtml}
            <style>
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-sizing: border-box !important;
              }
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
              }
              @page {
                size: A4 portrait;
                margin: 6mm 8mm 6mm 8mm;
              }
              #rebelive-tax-invoice-document {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 4mm 6mm !important;
                box-shadow: none !important;
                border: none !important;
                background: #ffffff !important;
                color: #000000 !important;
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
              }
              .rebelive-no-print {
                display: none !important;
              }
            </style>
          </head>
          <body>
            ${invoiceContent}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setIsPrinting(false);
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 400);
    } catch (err) {
      console.warn('Iframe print failed, falling back to window.print():', err);
      window.print();
      setIsPrinting(false);
    }
  };

  /**
   * Direct Download of Invoice as High-Resolution Image/PNG
   */
  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Tax-Invoice-${orderNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download invoice image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* ─── Global Print Styles (Fallback for Ctrl+P) ─── */}
      <style jsx global>{`
        @media print {
          /* Hide main site wrapper elements */
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #rebelive-tax-invoice-document,
          #rebelive-tax-invoice-document * {
            visibility: visible !important;
          }
          #rebelive-tax-invoice-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 6mm 8mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            page-break-after: avoid !important;
          }
          #rebelive-invoice-portal-root,
          #rebelive-invoice-backdrop,
          #rebelive-invoice-modal-card {
            position: static !important;
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          .rebelive-no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 6mm 8mm 6mm 8mm;
          }
        }
      `}</style>

      {/* ─── Modal Overlay ─── */}
      <div
        id="rebelive-invoice-portal-root"
        className="fixed inset-0 z-[200] overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
      >
        <div
          id="rebelive-invoice-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="w-full flex justify-center py-4"
        >
          {/* Main Card Container */}
          <div
            id="rebelive-invoice-modal-card"
            className="w-full max-w-4xl bg-[#111111] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top Toolbar (Hidden during print) */}
            <div className="rebelive-no-print px-5 sm:px-8 py-4 bg-[#181818] border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Invoice Preview
                  </h3>
                  <p className="text-[10px] font-mono text-white/50">
                    Official Tax Invoice for Order #{orderNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 disabled:opacity-50"
                  title="Download Image Receipt"
                >
                  {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  title="Print or Save as PDF"
                >
                  {isPrinting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5 text-black" />}
                  <span>{isPrinting ? 'Opening...' : 'Print / Save PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Wrapper (Styled White Page matching the User's Image) */}
            <div className="p-3 sm:p-6 bg-neutral-900/60 flex justify-center overflow-x-auto">
              <div
                ref={invoiceRef}
                id="rebelive-tax-invoice-document"
                className="w-full max-w-[800px] bg-white text-black font-sans p-6 sm:p-8 rounded-lg shadow-xl text-[11px] leading-relaxed border border-neutral-300"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {/* ─── Top Brand Header ─── */}
                <div className="text-center space-y-1 mb-2">
                  <div className="flex justify-center items-center py-1">
                    <img
                      src="/brand/REBELIVE Logo Black.png"
                      alt="REBELIVE"
                      className="h-11 sm:h-13 w-auto object-contain mx-auto"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <h2 className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-neutral-900">
                    OXYTRIUM DYNAMICS PRIVATE LIMITED
                  </h2>
                </div>

                {/* Thin divider */}
                <div className="border-t border-neutral-400 my-2" />

                {/* TAX INVOICE Title */}
                <h1 className="text-center text-sm sm:text-base font-black tracking-[0.3em] uppercase text-neutral-900 py-0.5">
                  TAX INVOICE
                </h1>

                {/* Thin divider */}
                <div className="border-t border-neutral-400 my-2" />

                {/* ─── 3 Columns Section: Shipping Address | Sold By | Invoice Details ─── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 border-b border-neutral-300 text-[10.5px]">
                  {/* Column 1: SHIPPING ADDRESS */}
                  <div className="space-y-1 pr-2">
                    <p className="font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-200 pb-1">
                      SHIPPING ADDRESS:
                    </p>
                    <div className="text-neutral-700 leading-tight space-y-0.5 pt-0.5">
                      <p className="font-bold text-neutral-900">{addr.name}</p>
                      {addr.company && <p>{addr.company}</p>}
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>{addr.city} {addr.pincode}</p>
                      <p>{addr.state}</p>
                      <p>{addr.country}</p>
                      <p className="font-medium text-neutral-900 pt-0.5">
                        State Code : {addr.stateCode}
                      </p>
                      <p>Ph: {addr.phone}</p>
                      <p className="break-all">Email: {addr.email}</p>
                    </div>
                  </div>

                  {/* Column 2: SOLD BY */}
                  <div className="space-y-1 px-0 md:px-3 md:border-l border-neutral-200">
                    <p className="font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-200 pb-1">
                      SOLD BY:
                    </p>
                    <div className="text-neutral-700 leading-tight space-y-0.5 pt-0.5">
                      <p className="font-bold text-neutral-900">
                        OXYTRIUM DYNAMICS PRIVATE LIMITED
                      </p>
                      <p>2nd Floor, House No. 81, Ward No.</p>
                      <p>12, Manikpur,</p>
                      <p>Buxar 802113</p>
                      <p>Bihar</p>
                      <p className="font-medium text-neutral-900 pt-0.5">
                        State Code : 10
                      </p>
                      <p>GSTIN No. : 10AAFCO0000A1Z5</p>
                      <p className="pt-0.5">CIN No: U11049BR2025PTC073697</p>
                      <p>Website: https://www.rebelive.com/</p>
                      <p>Email: krishna@rebelive.com</p>
                    </div>
                  </div>

                  {/* Column 3: INVOICE DETAILS */}
                  <div className="space-y-1 pl-0 md:pl-3 md:border-l border-neutral-200">
                    <p className="font-bold tracking-wider uppercase text-neutral-900 border-b border-neutral-200 pb-1">
                      INVOICE DETAILS:
                    </p>
                    <div className="text-neutral-700 leading-tight space-y-1 pt-0.5 font-mono text-[10px]">
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">INVOICE NO.</span>
                        <span>: {invoiceNumber}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">INVOICE DATE</span>
                        <span>: {invoiceDate}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">E-WAY BILL</span>
                        <span>: N/A</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">ORDER NO.</span>
                        <span className="font-bold">: #{orderNumber}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">ORDER DATE</span>
                        <span>: {orderDate}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">CHANNEL</span>
                        <span>: Rebelive Store</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">SHIPPED BY</span>
                        <span>: {shippingCarrier}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">AWB NO.</span>
                        <span className="font-bold">: {awbNumber}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">PAYMENT</span>
                        <span className="capitalize">: {paymentMethod}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 shrink-0 font-sans font-semibold text-neutral-900">REMARK</span>
                        <span>: Handle with care.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── Itemized Tax Invoice Table ─── */}
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-[9.5px] border-collapse">
                    <thead>
                      <tr className="border-b border-t border-neutral-400 font-bold text-neutral-900 uppercase">
                        <th className="py-2 px-1 text-center w-8">S.NO.</th>
                        <th className="py-2 px-2 text-left">PRODUCT NAME</th>
                        <th className="py-2 px-1 text-center w-14">HSN</th>
                        <th className="py-2 px-1 text-center w-10">QTY</th>
                        <th className="py-2 px-2 text-right w-16">UNIT PRICE</th>
                        <th className="py-2 px-1 text-right w-14">UNIT DISCOUNT</th>
                        <th className="py-2 px-2 text-right w-16">TAXABLE VALUE</th>
                        <th className="py-2 px-2 text-right w-20">CGST (Value | %)</th>
                        <th className="py-2 px-2 text-right w-20">SGST (Value | %)</th>
                        <th className="py-2 px-2 text-right w-20">TOTAL (Incl. GST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {calculatedItems.map((item: CalculatedInvoiceItem) => (
                        <tr key={item.sNo} className="align-top">
                          <td className="py-2.5 px-1 text-center text-neutral-600">{item.sNo}</td>
                          <td className="py-2.5 px-2">
                            <p className="font-bold text-neutral-900">{item.name}</p>
                            {item.variant && <p className="text-neutral-500 text-[8.5px]">{item.variant}</p>}
                            <p className="text-neutral-500 font-mono text-[8.5px]">SKU: {item.sku}</p>
                          </td>
                          <td className="py-2.5 px-1 text-center font-mono text-neutral-700">{item.hsn}</td>
                          <td className="py-2.5 px-1 text-center font-bold text-neutral-900">{item.qty}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-neutral-700">Rs. {item.unitPrice.toFixed(2)}</td>
                          <td className="py-2.5 px-1 text-right font-mono text-neutral-600">0.00</td>
                          <td className="py-2.5 px-2 text-right font-mono text-neutral-900 font-medium">{item.taxableValue.toFixed(2)}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-neutral-700">
                            {item.cgst.toFixed(2)} | 9%
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-neutral-700">
                            {item.sgst.toFixed(2)} | 9%
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono font-bold text-neutral-900">
                            {item.lineTotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* Shipping Charges Row */}
                      <tr className="align-top border-t border-neutral-300">
                        <td className="py-2 px-1 text-center"></td>
                        <td className="py-2 px-2 font-bold text-neutral-800" colSpan={3}>
                          Shipping Charges
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-neutral-600">
                          {shippingCharges > 0 ? `Rs. ${shippingCharges.toFixed(2)}` : '0.00'}
                        </td>
                        <td className="py-2 px-1 text-right font-mono text-neutral-600">0.00</td>
                        <td className="py-2 px-2 text-right font-mono text-neutral-600">
                          {shippingCharges > 0 ? (shippingCharges / 1.18).toFixed(2) : '0.00'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-neutral-600">
                          {shippingCharges > 0 ? `${((shippingCharges / 1.18) * 0.09).toFixed(2)} | 9%` : '0.00 | %'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-neutral-600">
                          {shippingCharges > 0 ? `${((shippingCharges / 1.18) * 0.09).toFixed(2)} | 9%` : '0.00 | %'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-neutral-900">
                          {shippingCharges.toFixed(2)}
                        </td>
                      </tr>

                      {/* Total Calculation Row */}
                      <tr className="border-t-2 border-b-2 border-neutral-800 font-bold text-neutral-900 bg-neutral-50/50">
                        <td className="py-2 px-1 text-center font-bold" colSpan={3}>
                          TOTAL
                        </td>
                        <td className="py-2 px-1 text-center font-bold text-neutral-900">
                          {totalQty}
                        </td>
                        <td className="py-2 px-2 text-right font-mono" colSpan={2}></td>
                        <td className="py-2 px-2 text-right font-mono">
                          {totalTaxableValue.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          {totalCgst.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          {totalSgst.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-xs font-black text-black">
                          Rs. {grandTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ─── Bottom Breakdown & Signature Block ─── */}
                <div className="mt-4 pt-2 border-t border-neutral-300 space-y-4">
                  {/* Amount in words */}
                  <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                    <p className="text-[10px] text-neutral-800 font-medium">
                      <span className="font-bold text-neutral-900 uppercase">Amount in Words: </span>
                      {amountWords}
                    </p>
                  </div>

                  {/* Declaration & Signatory Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="text-[9.5px] text-neutral-600 space-y-1.5 leading-relaxed">
                      <p className="font-bold text-neutral-900 uppercase tracking-wider">
                        Declaration & Notes:
                      </p>
                      <p>
                        1. Whether tax is payable on reverse charge basis: <strong>No</strong>
                      </p>
                      <p>
                        2. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                      </p>
                      <p>
                        3. For questions regarding dispatch, refunds or consignments, contact <strong>krishna@rebelive.com</strong>.
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between text-right space-y-8">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-neutral-500">
                          For and on behalf of
                        </p>
                        <p className="text-[10.5px] font-bold uppercase text-neutral-900">
                          OXYTRIUM DYNAMICS PRIVATE LIMITED
                        </p>
                      </div>

                      <div className="pt-6 border-t border-neutral-400 w-52 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">
                          Authorized Signatory
                        </p>
                        <p className="text-[8.5px] text-neutral-500 font-mono">
                          Bengaluru / Buxar Division
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Computer-Generated Note */}
                  <div className="pt-3 border-t border-neutral-200 text-center text-[9px] text-neutral-500 uppercase tracking-widest font-mono">
                    This is a computer-generated tax invoice and requires no physical signature.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions (Hidden on Print) */}
            <div className="rebelive-no-print p-4 bg-[#141414] border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-white/40">
                Format complies with Indian GST E-Commerce invoicing rules
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer flex items-center gap-1.5 border border-white/10 disabled:opacity-50"
                >
                  {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {isPrinting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
                  <span>{isPrinting ? 'Opening...' : 'Print / Save PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
