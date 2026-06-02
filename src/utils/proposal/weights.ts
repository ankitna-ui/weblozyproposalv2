const TOTAL_PAGE_HEIGHT = 1123;
const HEADER_FOOTER_PADDING = 320; // Accounts for A4 margins, headers, footers
const FIRST_PAGE_TITLE_AREA = 70; // Extra space taken by the title on the first page

const BASE_CARD_HEIGHT = 52;   // Module header card height
const CONTINUED_BADGE_HEIGHT = 20; // Extra height for "(Continued)" badge on continuation pages
const FEATURE_ROW_HEIGHT = 36; // Height per feature row
const CARD_GAP = 20;           // Gap between module cards
const CONTINUATION_FOOTER = 22; // "Continued on next page..." row height

/**
 * A module segment represents a slice of a module that fits on one page.
 * A module with many features may span multiple segments (pages).
 */
export interface ModuleSegment {
  id: string;
  name: string;
  price?: string | number;
  isFutureScalability?: boolean;
  features: any[];         // The feature slice for this page
  isContinuation: boolean; // true if this is not the first segment of the module
  continuesOnNext: boolean;// true if this module has more features on the next page
}

/**
 * paginateModules: splits modules by features so they flow continuously
 * across pages. If a module's features don't all fit on one page, the
 * remaining features continue on the next page with a "(Continued)" header.
 */
export function paginateModules(allModules: any[]): ModuleSegment[][] {
  const pages: ModuleSegment[][] = [];
  let currentPage: ModuleSegment[] = [];
  let currentHeight = 0;

  const getAvailableHeight = (isFirstPage: boolean) =>
    isFirstPage
      ? TOTAL_PAGE_HEIGHT - HEADER_FOOTER_PADDING - FIRST_PAGE_TITLE_AREA
      : TOTAL_PAGE_HEIGHT - HEADER_FOOTER_PADDING;

  allModules.forEach((module) => {
    const allFeatures: any[] = module.features ?? [];
    let featureOffset = 0;
    let isFirstSegmentOfModule = true;

    // Keep slicing features until all are placed on pages
    while (featureOffset < allFeatures.length || isFirstSegmentOfModule) {
      const isFirstPage = pages.length === 0;
      const availableHeight = getAvailableHeight(isFirstPage);

      // Gap before this card (if page already has content)
      const gapToAdd = currentPage.length > 0 ? CARD_GAP : 0;

      // Header height: taller when "(Continued)" badge is shown
      const headerHeight = BASE_CARD_HEIGHT + (isFirstSegmentOfModule ? 0 : CONTINUED_BADGE_HEIGHT);

      // How much space is left after placing the header + gap?
      const spaceAfterHeader = availableHeight - currentHeight - gapToAdd - headerHeight;

      // If the header alone doesn't fit on the current page, push page and start fresh
      if (currentPage.length > 0 && spaceAfterHeader < FEATURE_ROW_HEIGHT) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
        // Recalculate for new page
        continue;
      }

      // How many features can we fit in the remaining space on this page?
      const isNewPage = currentPage.length === 0;
      const freshAvailable = getAvailableHeight(pages.length === 0 && isNewPage);
      const spaceForFeatures = (isNewPage ? freshAvailable : availableHeight)
        - currentHeight
        - gapToAdd
        - headerHeight
        - CONTINUATION_FOOTER; // reserve space for "Continued..." footer if needed

      const maxFeatures = Math.max(1, Math.floor(spaceForFeatures / FEATURE_ROW_HEIGHT));
      const remainingFeatures = allFeatures.slice(featureOffset);
      const featuresForThisPage = remainingFeatures.slice(0, maxFeatures);
      const continuesOnNext = featureOffset + featuresForThisPage.length < allFeatures.length;

      const segment: ModuleSegment = {
        id: module.id,
        name: module.name,
        price: module.price,
        isFutureScalability: module.isFutureScalability,
        features: featuresForThisPage,
        isContinuation: !isFirstSegmentOfModule,
        continuesOnNext,
      };

      currentPage.push(segment);
      const actualFeatureHeight = featuresForThisPage.length * FEATURE_ROW_HEIGHT;
      const footerReserve = continuesOnNext ? CONTINUATION_FOOTER : 0;
      currentHeight += gapToAdd + headerHeight + actualFeatureHeight + footerReserve;

      featureOffset += featuresForThisPage.length;
      isFirstSegmentOfModule = false;

      // If this module continues on the next page, close current page now
      if (continuesOnNext) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      // All features placed — exit the while loop
      if (featureOffset >= allFeatures.length) break;
    }
  });

  // Push any remaining segments
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

