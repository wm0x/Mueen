import React, { useMemo } from 'react';
import { DotPattern } from './dot-pattern';
import { cn } from '@/lib/utils';
import { Highlighter } from './highlighter';

function About() {
  const dotPattern = useMemo(
    () => (
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_top,white,transparent)]",
          "dark:[mask-image:radial-gradient(900px_circle_at_top,white,transparent)]"
        )}
      />
    ),
    []
  );

  return (
    <div className="relative flex  w-full flex-col overflow-hidden py-10" dir="rtl">
      {dotPattern}

      <div className="flex flex-col items-center justify-center mt-10 px-4 space-y-6">
        <p className="leading-relaxed text-4xl text-center font-black">
          من نحن في{" "}
          <Highlighter
            action="underline"
            color='#22c55e'
          >
            مُــــــعِــــــيــــــن
          </Highlighter>
        </p>

        <p className="text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mt-10">
          منصة تُدار بالكامل من قبل طلاب الحاسبات لتقديم المساعدة في المشاريع، المواد الدراسية، ويتكون <span className='font-black'>فريقنا من : </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-22 max-w-4xl mt-16">
            <div className="group bg-gradient-to-br from-neutral-500/10 to-neutral-200/10 dark:from-neutral-500/5 dark:to-neutral-200/5 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/30 backdrop-blur-sm transition-all duration-500 ">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neutral-500 to-neutral-500 rounded-2xl flex items-center justify-center transition-transform duration-500">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-300">علوم الحاسب</h3>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-neutral-500/10 to-neutral-500/10 dark:from-neutral-500/5 dark:to-neutral-500/5 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/30 backdrop-blur-sm transition-all duration-500 ">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neutral-500 to-neutral-500 rounded-2xl flex items-center justify-center transition-transform duration-500">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-300">تقنية المعلومات</h3>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-neutral-500/10 to-neutral-500/10 dark:from-neutral-500/5 dark:to-neutral-500/5 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/30 backdrop-blur-sm transition-all duration-500 ">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neutral-500 to-neutral-500 rounded-2xl flex items-center justify-center  transition-transform duration-500">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-300">نظم المعلومات</h3>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default About;
