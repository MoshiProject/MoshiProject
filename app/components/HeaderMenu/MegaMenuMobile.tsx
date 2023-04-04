import MegaMenuItem from './MegaMenuItem';
import {navigation} from './menuSettings';

export default function MegaMenuMobile() {
  return (
    <div className={'text-white mt-6 mb-3 mx-4'}>
      {navigation.map((item) => {
        console.log('item', item);
        if (item.children && item.children.length === 0) {
          return (
            <a
              key={item.title}
              className={`flex justify-between py-4 text-xl font-semibold border-t border-neutral-900`}
              href={item.url}
            >
              {item.title}
            </a>
          );
        }
        return <MegaMenuItem key={item.title} item={item} depth={0} />;
      })}
    </div>
  );
}
