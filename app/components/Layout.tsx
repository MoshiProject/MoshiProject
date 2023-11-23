import HeaderMenu from './HeaderMenu/HeaderMenu';
import siteSettings from '~/settings';
type LayoutProps = {
  children: JSX.Element;
  title: JSX.Element;
};
import {useMatches} from '@remix-run/react';
import {useDrawer} from './Drawer';
import FooterMenu from './FooterMenu/FooterMenu';
import ReviewPopupBtn from './ReviewPopupBtn';

export function Layout({children, title}: LayoutProps) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();

  const [root] = useMatches();
  // Test opening the drawer, delete this after verifying
  const cart = root.data?.cart;
  return (
    <div className=" flex flex-col min-h-screen antialiased bg-white relative h-screen">
      <header>
        <HeaderMenu cart={cart}></HeaderMenu>
      </header>
      <main
        role="main"
        id="mainContent"
        className="flex-grow mt-0 mb-4 md:p-8 lg:p-12"
      >
        <ReviewPopupBtn />

        <div
          className={` ${
            siteSettings.header.displayCountdown ? 'h-32' : 'h-24'
          } md:${
            siteSettings.header.displayCountdown ? 'h-48' : 'h-32'
          } w-full bg-neutral-950 md:bg-white`}
        ></div>
        {children}
        {/* <RecentlyViewed recentlyViewed={recentlyViewed} /> */}
      </main>
      <footer>
        <FooterMenu />
      </footer>
    </div>
  );
}
