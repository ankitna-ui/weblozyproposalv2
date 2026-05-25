#!/bin/bash
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/bg-\[\#0B0E14\]/bg-slate-50 dark:bg-[#0B0E14]/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/bg-\[\#11151D\]/bg-white dark:bg-[#11151D]/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/text-white/text-slate-900 dark:text-white/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/border-white\/5/border-slate-200 dark:border-white\/5/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/border-white\/10/border-slate-300 dark:border-white\/10/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/bg-white\/5/bg-slate-100 dark:bg-white\/5/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/bg-white\/10/bg-slate-200 dark:bg-white\/10/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/text-gray-400/text-slate-500 dark:text-gray-400/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/text-gray-500/text-slate-400 dark:text-gray-500/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/text-gray-300/text-slate-700 dark:text-gray-300/g' {} +
find src/pages src/components -type f -name "*.tsx" -exec perl -pi -e 's/bg-white\\/\[0\.02\]/bg-slate-50 dark:bg-white\\/[0.02]/g' {} +
