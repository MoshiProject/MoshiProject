import {Menu} from '@headlessui/react';

import {AnimatePresence, motion} from 'framer-motion';
export type MenuItem = {
  title: string;
  url: string;
  children: MenuItem[];
};

export default function MegaMenuItem({
  item,
  depth,
}: {
  item: MenuItem;
  depth: number;
}) {
  const textDepth = ['text-xl', 'text-md', 'text-sm', 'text-xs'];
  const textPadding = ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-28'];
  const textWeight = [
    'font-semibold',
    'font-medium',
    'font-medium',
    'font-medium',
    'font-medium',
  ];
  if (item.children && item.children.length > 0) {
    return (
      <Menu>
        {({open}) => (
          <>
            <Menu.Button
              className={`flex justify-between items-center tracking-widest	${
                textDepth[depth]
              } ${textWeight[depth]} border-t border-neutral-900 w-full ${
                'py-' + (4 - depth).toString()
              }`}
            >
              {item.title}
              <motion.span animate={{rotate: !open ? 180 : 0}}>
                <ChevronUpIcon />
              </motion.span>
            </Menu.Button>
            <AnimatePresence>
              <motion.div
                className="overflow-hidden h-0"
                layout
                animate={{height: !open ? 0 : 'auto', opacity: 1}}
                transition={{
                  duration: 0.24,
                }}
              >
                <Menu.Items
                  static
                  className={` flex tracking-widest flex-col mt-2 pl-4 border-l border-l-neutral-100 ${
                    textPadding[depth + 1]
                  }`}
                >
                  {item.children.map((child) => {
                    return (
                      <MegaMenuItem
                        key={child.title}
                        item={child}
                        depth={depth + 1}
                      />
                    );
                  })}
                </Menu.Items>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </Menu>
    );
  } else
    return (
      <Menu.Item key={item.title + 'MenuItem'}>
        <motion.a
          layout
          className={`py-2 tracking-widest h-fit ${
            'py-' + (4 - depth).toString()
          } ${textWeight[depth]} border-t border-t-neutral-900 ${
            textDepth[depth]
          }`}
          href={item.url}
        >
          {item.title}
        </motion.a>
      </Menu.Item>
    );
}
const ChevronUpIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg>
  );
};
