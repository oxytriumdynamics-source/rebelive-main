import React from 'react';

/**
 * Primitive Shimmer Skeleton element.
 * Applies the GPU-accelerated silvery-white shimmer effect over dark translucent surfaces.
 */
export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <div
      className={`shimmer-skeleton rounded-lg ${className}`}
      {...props}
    />
  );
};

/**
 * Skeleton for Shop Catalog Page (/shop)
 */
export const ShopSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto select-none animate-pulse-none">
      {/* Top Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-10 sm:h-12 w-56 sm:w-72 rounded-xl mb-3" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2.5 mt-6 mb-8">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#0e0e0e] rounded-2xl border border-white/10 p-5 flex flex-col justify-between h-[450px]"
          >
            {/* Top Badge & Code */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>

            {/* Can Showcase Placeholder */}
            <div className="h-48 w-full flex items-center justify-center my-2">
              <Skeleton className="h-44 w-28 rounded-2xl" />
            </div>

            {/* Details */}
            <div className="space-y-3 mt-4">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-3.5 w-1/2 rounded" />

              {/* Pack pills */}
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-7 w-12 rounded-lg" />
                <Skeleton className="h-7 w-12 rounded-lg" />
                <Skeleton className="h-7 w-12 rounded-lg" />
                <Skeleton className="h-7 w-12 rounded-lg" />
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Product Detail Page (/shop/[id])
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-white pt-20 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto select-none">
      {/* Back button link */}
      <Skeleton className="h-5 w-28 rounded-md mb-6" />

      {/* Two Column PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
        {/* Left Column: Image Showcase */}
        <div className="md:col-span-6 flex flex-col items-center w-full">
          <div className="w-full aspect-square rounded-2xl sm:rounded-3xl bg-[#0e0e0e] border border-white/10 p-8 flex items-center justify-center">
            <Skeleton className="h-[75%] w-[45%] rounded-3xl" />
          </div>

          {/* Thumbnail Gallery Row */}
          <div className="flex items-center gap-2.5 mt-4 w-full">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Right Column: Product Meta & Purchase */}
        <div className="md:col-span-6 flex flex-col space-y-5">
          {/* Tag & Title */}
          <div>
            <Skeleton className="h-5 w-24 rounded-full mb-3" />
            <Skeleton className="h-10 sm:h-12 w-4/5 rounded-xl mb-2" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* Short description */}
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          {/* Pack size pills */}
          <div className="pt-2">
            <Skeleton className="h-4 w-28 rounded mb-2.5" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Price & Buttons */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
            </div>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2.5 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Contact Us Page (/contact)
 */
export const ContactSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-white pt-24 sm:pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Skeleton className="h-12 sm:h-14 w-64 mx-auto rounded-2xl mb-3" />
        <Skeleton className="h-4 w-44 mx-auto rounded mb-3" />
        <Skeleton className="h-4 w-3/4 mx-auto rounded" />
      </div>

      {/* Contact Grid: Form + Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e0e0e] rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4">
          <Skeleton className="h-6 w-36 rounded-lg mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
          <Skeleton className="h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {/* Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#0e0e0e] rounded-2xl border border-white/10 p-5 flex items-center gap-4"
            >
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3.5 w-44 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for FAQ Page (/faq)
 */
export const FaqSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-white pt-24 sm:pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="text-center mb-10">
        <Skeleton className="h-6 w-36 mx-auto rounded-full mb-4" />
        <Skeleton className="h-10 sm:h-14 w-72 sm:w-96 mx-auto rounded-2xl mb-3" />
        <Skeleton className="h-4 w-3/4 max-w-md mx-auto rounded" />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 sm:w-28 rounded-full" />
        ))}
      </div>

      {/* FAQ Accordion Items */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#0e0e0e] rounded-2xl border border-white/10 p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-5 w-6 rounded" />
              <Skeleton className="h-5 w-3/4 max-w-md rounded-lg" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Track Order Page (/track-order)
 */
export const TrackOrderSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-white pt-24 sm:pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="text-center mb-10">
        <Skeleton className="h-6 w-44 mx-auto rounded-full mb-4" />
        <Skeleton className="h-10 sm:h-14 w-72 sm:w-96 mx-auto rounded-2xl mb-3" />
        <Skeleton className="h-4 w-80 mx-auto rounded" />
      </div>

      {/* Search Input Box */}
      <div className="max-w-md mx-auto mb-12 flex gap-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-28 rounded-xl" />
      </div>

      {/* Tracking Card Timeline */}
      <div className="bg-[#0e0e0e] rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-3.5 w-48 rounded" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        {/* Timeline steps */}
        <div className="space-y-5 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3.5 w-64 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for About Page (/about)
 */
export const AboutSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060608] text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-8 max-w-6xl mx-auto select-none flex flex-col justify-between">
      {/* Top Deck Navigation Indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-2 w-8 rounded-full" />
          ))}
        </div>
      </div>

      {/* Main Presentation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
        {/* Left Column: Portrait / Artwork */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-[#0e0e0e] border border-white/10 p-4 flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>

        {/* Right Column: Editorial Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-12 sm:h-16 w-4/5 rounded-2xl" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="pt-2">
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>
    </div>
  );
};

/**
 * Skeleton for Story Page (/story)
 */
export const StorySkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08080a] text-white pt-24 sm:pt-28 pb-16 px-4 sm:px-8 max-w-6xl mx-auto select-none flex flex-col justify-between">
      {/* Top Chapter Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-2 w-6 rounded-full" />
          ))}
        </div>
      </div>

      {/* Story Chapter Content */}
      <div className="my-auto py-10 max-w-4xl mx-auto w-full text-center space-y-6">
        <Skeleton className="h-6 w-32 mx-auto rounded-full" />
        <Skeleton className="h-12 sm:h-20 w-4/5 mx-auto rounded-2xl" />
        <div className="space-y-3.5 max-w-2xl mx-auto py-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 mx-auto rounded" />
          <Skeleton className="h-4 w-4/5 mx-auto rounded" />
        </div>
        <div className="pt-4 flex justify-center">
          <Skeleton className="h-12 w-44 rounded-full" />
        </div>
      </div>

      {/* Bottom chapter nav */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
    </div>
  );
};
