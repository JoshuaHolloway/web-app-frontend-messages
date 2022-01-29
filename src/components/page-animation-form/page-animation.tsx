import { FC, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Page from './page';
// import css from './page-animation.module.scss';

// ==============================================

interface Props {
  setFilterCriteria: any;
}
const PageAnimation: FC<Props> = (props) => {
  // --------------------------------------------

  const MAX_PAGES = 4;
  const [on_page_num, setOnPageNum] = useState(0);
  const [filter_criteria, setFilterCriteria] = useState<string[]>([]);
  const [clickable, setClickable] = useState(true);

  useEffect(() => {
    // console.log('filter_criteria (PageAnimation): ', filter_criteria);
    if (on_page_num >= MAX_PAGES) {
      // -We apparently need to wait for the state update
      //  to finish before we send this data up one level.
      props.setFilterCriteria(filter_criteria);
    }
  }, [filter_criteria]);

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
            onReverseComplete: () => setClickable(true),
          })
          .to(
            page_ref.current[page_num],
            {
              duration,
              xPercent: 100,
              onComplete: () => setClickable(true),
              onReverseComplete: () => setClickable(true),
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

  const pageUnchangeHandler = () => {
    setClickable(false);
    tl_ref.current.pop()?.reverse();
  };

  // --------------------------------------------

  const setPageRef = (page_num: number) => (el: HTMLDivElement) => {
    page_ref.current[page_num] = el;
  };

  // --------------------------------------------

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
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
        message="enter email"
        placeholder="email"
        min_length={4}
        max_length={20}
      />

      {/* page-1 */}
      <Page
        page_num={1}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
        message="create a password"
        placeholder="password"
        min_length={4}
        max_length={10}
      />

      {/* page-2 */}
      <Page
        page_num={2}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
        message="first name"
        placeholder="first name"
        min_length={1}
        max_length={10}
      />

      {/* page-3 */}
      <Page
        page_num={3}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
        setFilterCriteria={setFilterCriteria}
        clickable={clickable}
        message="last name"
        placeholder="last name"
        min_length={1}
        max_length={10}
      />
    </div>
  );
};

// ==============================================

export default PageAnimation;
