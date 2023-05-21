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
        } h-6 min-w-fit w-28 text-center capitalize text-sm hover:text-red-500 hover:border-b-2 hover:border-red-500`}
        onMouseEnter={() => handleMouseEnter(item.title)}
        onMouseLeave={handleMouseLeave}
      >
        <a
          href={item.url}
          className={`${
            activeItem === item.title ? 'text-red-500' : 'text-white'
          } w-screen px-2 bg-neutral-950 focus:outline-none`}
        >
          {item.title}
        </a>
        {hasChildren && (
          <ul
            className={`${
              activeItem === item.title ? 'flex' : 'hidden'
            } fixed top-19 flex justify-center p-4 left-0 bg-neutral-950 text-white w-screen`}
          >
            <div className="grid grid-cols-3 gap-4">
              {item.children.map((child) => (
                <li key={child.title}>
                  <a
                    href={child.url}
                    className="text-base hover:text-red-500 hover:border-b-2 hover:border-red-500"
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
      <ul className=" flex bg-neutral-950 text-white">
        {navigation.map((item) => renderMenuItem(item))}
      </ul>
    </div>
  );
};

export default DesktopMegaMenu;
