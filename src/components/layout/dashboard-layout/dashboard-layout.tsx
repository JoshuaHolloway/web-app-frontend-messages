import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@src/components/navbar/navbar';
// import { elementGeometry } from '../../helpers/geometry';
import css from './dashboard-layout.module.scss';

// ==============================================

// const navbar_height = '90px';
// const navdrawer_width = '25vw';
// const minimized_navdrawer_width = '6vw';

const navbar_height = 90; // vh
const navdrawer_width_px = 350; // px
const minimized_navdrawer_width_px = 120;

// const main_content_shift =

// const extractNum = (str) => 'josh12x'.match(/\d+/)[0];
// const extractNum = (str: string) => {
//   const matched = str.match(/\d+/);
//   if (matched) {
//     return Number(matched[0]);
//   } else return 0;
// };

// ==============================================

type Props = {
  children: JSX.Element;
};
export default function DashboardLayout({ children }: Props) {
  // --------------------------------------------

  const router = useRouter();

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  //   return () => setMounted(false);
  // }, []);

  const [navdrawer_open, setNavDrawerOpen] = useState(false);
  const navdrawer_ref = useRef<any>();
  const navdrawer_svg_minimize_ref = useRef<any>();
  const main_content_ref = useRef<any>();
  const navdrawer_items_text_refs = useRef<any[]>([]);
  const tl_ref = useRef<any>();

  const navDrawerHandler = () => {
    if (!navdrawer_open) {
      tl_ref.current = gsap
        .timeline()
        .to(
          navdrawer_ref.current,
          {
            duration: 0.5,
            // width: `${minimized_navdrawer_width}vw`,
            // width: `${minimized_navdrawer_width_px}px`,
            width: `${navdrawer_width_px}`,
          },
          '<'
        )
        .to(
          main_content_ref.current,
          {
            duration: 0.5,
            // width: `calc(100% - ${minimized_navdrawer_width_px}px)`,
            // x: `-${navdrawer_width_px - minimized_navdrawer_width_px}px`,
            width: `calc(100% - ${navdrawer_width_px}px)`,
            x: `${navdrawer_width_px - minimized_navdrawer_width_px}px`,
          },
          '<'
        )
        .to(
          navdrawer_svg_minimize_ref.current,
          {
            duration: 0.5,
            rotate: 180,
          },
          '<'
        )
        .to(
          navdrawer_items_text_refs.current,
          {
            duration: 0.3,
            opacity: 1,
          },
          '<0.2'
        );
    } else {
      tl_ref.current?.reverse();
    }

    setNavDrawerOpen((prev) => !prev);
  };

  // --------------------------------------------

  const navdrawer_items = [
    {
      svg_path: (
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      ),
      title: 'Users',
      href: '/admin/users',
      active: router.pathname.includes('/admin/users'),
    },
    {
      svg_path: (
        <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
      ),
      title: 'Orders',
      href: '/admin/orders',
      active: router.pathname.includes('/admin/orders'),
    },
    {
      svg_path: (
        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
      ),
      title: 'Products',
      href: '/admin/products',
      active: router.pathname.includes('/admin/products'),
    },
    {
      svg_path: (
        <path d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z" />
      ),
      title: 'Data',
      href: '/admin/data',
      active: router.pathname.includes('/admin/data'),
    },
    {
      svg_path: (
        <>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
          <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
        </>
      ),
      title: 'Appointments',
      href: '/admin/appointments',
      active: router.pathname.includes('/admin/appointments'),
    },
    {
      svg_path: (
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
        // <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-exclamation" viewBox="0 0 16 16">
        //   <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z"/>
        //   <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0Zm0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
        // </svg>
      ),
      title: 'Mail',
      href: '/dashboard/mail',
      active: router.pathname.includes('/dashboard/mail'),
    },
    {
      svg_path: (
        <>
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        </>
      ),
      title: 'Settings',
      href: '/admin/settings',
      active: router.pathname.includes('/admin/settings'),
    },
    {
      svg_path: (
        <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
      ),
      title: 'Store',
      href: '/',
      active: router.pathname === '/',
    },
  ];

  // --------------------------------------------

  return (
    <div style={{ position: 'relative' }}>
      <nav
        id="main-navdrawer"
        className={css.main_navdrawer}
        ref={navdrawer_ref}
        style={{
          position: 'fixed',
          top: `${navbar_height}px`,
          width: `${minimized_navdrawer_width_px}px`,
          height: '100%',
          paddingTop: `${navbar_height}px`,
        }}
      >
        <div
          id="navdrawer-minimize-button"
          className={css.navdrawer_minimize_button}
          onClick={navDrawerHandler}
          onKeyDown={navDrawerHandler}
          tabIndex={0}
          role="button"
        >
          <svg
            ref={navdrawer_svg_minimize_ref}
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>

        <div id="navdrawer-navitems-container">
          <div
            id="navdrawer-navitems"
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${navdrawer_items.length}, 45px)`,
              gridTemplateColumns: `1fr`,
              gap: '20px',
              // alignItems: 'center',
              minWidth: `${minimized_navdrawer_width_px}px`,
            }}
          >
            {navdrawer_items.map((navdrawer_item, idx) => {
              return (
                <Link key={idx} href={navdrawer_item.href}>
                  <div
                    className={`${css.navitem_row} ${navdrawer_item.active ? css.active : ''}`}
                    style={{
                      display: 'grid',
                      gridTemplateRows: 'repeat(1, 100%)',
                      gridTemplateColumns: `${minimized_navdrawer_width_px}px 1fr`,
                      alignItems: 'center',
                      minWidth: `${minimized_navdrawer_width_px}px`,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        // background: 'rgba(255, 0, 0, 0.25)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        // className={css.navdrawer_item}
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        {navdrawer_item.svg_path}
                      </svg>
                    </div>
                    <span ref={(el) => (navdrawer_items_text_refs.current[idx] = el)} className={css.navdrawer_item}>
                      {navdrawer_item.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <hr className={css.nav_drawer_hr} style={{ marginTop: '22px' }} />
      </nav>

      <nav
        id="main-navbar"
        className={css.main_navbar}
        style={{
          position: 'fixed',
          height: `${navbar_height}px`,
          width: '100%',
        }}
      >
        <Navbar />
      </nav>

      <main
        id="main-content"
        className={css.main_content}
        ref={main_content_ref}
        style={{
          position: 'fixed',
          top: `${navbar_height}px`,
          left: `${minimized_navdrawer_width_px}px`,
          height: `calc(100vh - ${navbar_height}px)`,
          width: `calc(100% - ${minimized_navdrawer_width_px}px)`,
          // border: 'solid hotpink 5px',
          // background: 'red',
          // padding: '3rem 4rem',
          // NOTE: do the padding on the actual page because it is different for each page!
        }}
      >
        {children}
      </main>
    </div>
  );
}
