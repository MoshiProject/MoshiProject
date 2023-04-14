import HeaderMenu from './HeaderMenu/HeaderMenu';

type LayoutProps = {
  children: JSX.Element;
  title: JSX.Element;
};
import {useMatches} from '@remix-run/react';
import {useDrawer} from './Drawer';
import FooterMenu from './FooterMenu/FooterMenu';

export function Layout({children, title}: LayoutProps) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const [root] = useMatches();
  // Test opening the drawer, delete this after verifying
  const cart = root.data?.cart;
  return (
    <div className="flex flex-col min-h-screen antialiased bg-neutral-50 relative h-screen">
      <header>
        <HeaderMenu cart={cart}></HeaderMenu>
      </header>

      <main
        role="main"
        id="mainContent"
        className="flex-grow mt-24 mb-4 md:p-8 lg:p-12"
      >
        {children}
      </main>
      <footer>
        <FooterMenu />
      </footer>
    </div>
  );
}
