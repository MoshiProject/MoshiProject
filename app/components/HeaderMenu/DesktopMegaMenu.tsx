import {useState} from 'react';

import {navigation} from './menuSettings';
import {MenuItem} from './MegaMenuItem';

const DesktopMegaMenu: React.FC = () => {
  const [activeItem, setActiveItem] = useState('');

  const handleMouseEnter = (title: string) => {
    setActiveItem(title);
  };

  const handleMouseLeave = () => {
    setActiveItem('');
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li
        key={item.title}
        className={`${
          hasChildren ? 'group' : ''
        } h-6 min-w-fit w-28 text-center capitalize text-xl font-semibold hover:text-red-500 tracking-widest hover:border-b-2 hover:border-red-500`}
        onMouseEnter={() => handleMouseEnter(item.title)}
        onMouseLeave={handleMouseLeave}
      >
        <a
          href={item.url}
          className={`${
            activeItem === item.title ? 'text-red-500' : 'text-white'
          } w-screen px-4 py-1 bg-neutral-950 focus:outline-none tracking-widest`}
        >
          {item.title}
        </a>
        {hasChildren && (
          <ul
            className={`${
              activeItem === item.title ? 'flex' : 'hidden'
            } fixed top-19 flex justify-center py-8 px-4 left-0 bg-neutral-950 text-white w-screen tracking-widest`}
          >
            <div className="grid grid-cols-3 gap-4 gap-x-24">
              {item.children.map((child) => (
                <li key={child.title}>
                  <a
                    href={child.url}
                    className="text-base hover:text-red-500 hover:border-b-2 hover:border-red-500 tracking-widest"
                  >
                    {child.title}
                  </a>
                </li>
              ))}
            </div>
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="relative ">
      <ul className=" flex bg-neutral-950 text-white w-fit justify-center tracking-widest">
        {navigation.map((item) => renderMenuItem(item))}
      </ul>
    </div>
  );
};

export default DesktopMegaMenu;
