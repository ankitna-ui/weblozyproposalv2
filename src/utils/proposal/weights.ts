const TOTAL_PAGE_HEIGHT = 1123;
const HEADER_FOOTER_PADDING = 250; // A4 page height minus header, footer, padding
const FIRST_PAGE_TITLE_AREA = 120; // Extra space taken by the title on the first page

const BASE_CARD_HEIGHT = 90; // suggested baseCardHeight
const FEATURE_ROW_HEIGHT = 34; // suggested featureRowHeight
const CARD_GAP = 16; // suggested cardGap

export function paginateModules(allModules: any[]): any[][] {
  const pages: any[][] = [];
  let currentPage: any[] = [];
  let currentHeight = 0;

  allModules.forEach((module) => {
    const isFirstPage = pages.length === 0;
    const availablePageHeight = isFirstPage
      ? TOTAL_PAGE_HEIGHT - HEADER_FOOTER_PADDING - FIRST_PAGE_TITLE_AREA
      : TOTAL_PAGE_HEIGHT - HEADER_FOOTER_PADDING;

    const featureCount = module.features ? module.features.length : 0;
    const moduleHeight = BASE_CARD_HEIGHT + (featureCount * FEATURE_ROW_HEIGHT);

    const gapToAdd = currentPage.length > 0 ? CARD_GAP : 0;
    const exceedsHeight = currentHeight + gapToAdd + moduleHeight > availablePageHeight;

    if (currentPage.length > 0 && exceedsHeight) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(module);
    currentHeight += moduleHeight + (currentPage.length > 1 ? CARD_GAP : 0);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}


