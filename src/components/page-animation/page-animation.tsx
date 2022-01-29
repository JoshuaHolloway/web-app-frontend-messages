import { FC, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/router';
import Page from './page';
import css from './page-animation.module.scss';

// ==============================================

interface Props {
  setFilterCriteria: any;
  setMode: (s: string) => void;
}
const PageAnimation: FC<Props> = (props) => {
  // --------------------------------------------

  const MAX_PAGES = 4;
  const [on_page_num, setOnPageNum] = useState(0);
  const [filter_criteria, setFilterCriteria] = useState<string[]>([]);
  const [clickable, setClickable] = useState(true);

  useEffect(() => {
    // console.log('filter_criteria (PagAnimation): ', filter_criteria);
    if (on_page_num >= MAX_PAGES) {
      // -We apparently need to wait for the state update
      //  to finish before we send this data up on level.
      props.setMode('MODE-2');
      props.setFilterCriteria(filter_criteria);
    }
  }, [filter_criteria]);

  useEffect(() => {
    // console.log('on_page_num: ', on_page_num);
  }, [on_page_num]);

  // --------------------------------------------

  const router = useRouter();

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  //   return () => setMounted(false);
  // }, []);

  // --------------------------------------------

  const page_ref = useRef<HTMLDivElement[]>([]); // access elements via ref.current[n]
  const tl_ref = useRef<any>([]);

  // --------------------------------------------

  const pageChangeHandler = (page_num: number) => {
    // Page 1:
    //  -0:   100%
    //  -1:   100%
    // Page N:
    //  -N-1: 200%
    //  -N:   100%

    let duration = 1;

    if (on_page_num < MAX_PAGES - 1) {
      tl_ref.current.push(
        gsap
          .timeline()
          .to(page_ref.current[page_num - 1], {
            duration,
            xPercent: page_num == 1 ? 100 : 200,
            onStart: () => setClickable(false),
          })
          .to(
            page_ref.current[page_num],
            {
              duration,
              xPercent: 100,
              onComplete: () => setClickable(true),
            },
            '<'
          )
      );
    } else {
      // last page doesn't slide-in the next page
      // (because there is no next page!)
      tl_ref.current.push(
        gsap.timeline().to(page_ref.current[page_num - 1], {
          duration,
          xPercent: 200,
        })
      );
    }
    setOnPageNum(page_num);
  };

  // --------------------------------------------

  const pageUnchangeHandler = () => tl_ref.current.pop()?.reverse();

  // --------------------------------------------

  const setPageRef = (page_num: number) => (el: HTMLDivElement) => {
    page_ref.current[page_num] = el;
  };

  // --------------------------------------------

  const desktopButtonClickHandler = () => {
    router.push('/');
  };

  // --------------------------------------------

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      {/* page-0 */}
      <Page
        page_num={0}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
      />

      {/* page-1 */}
      <Page
        page_num={1}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
      />

      {/* page-2 */}
      <Page
        page_num={2}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
      />

      {/* page-3 */}
      <Page
        page_num={3}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
      />

      <div
        className={css.desktop_link}
        onClick={desktopButtonClickHandler}
        onKeyDown={desktopButtonClickHandler}
        tabIndex={0}
        role="button"
      >
        Desktop Version
      </div>
    </div>
  );
};

// ==============================================

export default PageAnimation;
