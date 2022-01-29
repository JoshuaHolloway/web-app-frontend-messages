import { FC } from 'react';
// import css from './page.module.scss';

// ==============================================
interface Props {
  page_num: number;
  pageChangeHandler: (n: number) => void;
  pageUnchangeHandler: () => void;
  setPageRef: (page_num: number) => (el: HTMLDivElement) => void;
  // last_page,
  setFilterCriteria: any;
  clickable?: boolean;
}
const Page: FC<Props> = (props) => {
  const {
    page_num,
    pageChangeHandler,
    pageUnchangeHandler,
    setPageRef,
    // last_page,
    setFilterCriteria,
    clickable,
  } = props;

  // --------------------------------------------

  const color_map = ['hotpink', 'deepskyblue', 'darkorchid', 'darkorange'];

  // --------------------------------------------

  // const [clicked, setClicked] = useState(false);

  // --------------------------------------------

  const onClickHandler = (criterion: string) => () => {
    // setClicked(true);

    setFilterCriteria((prev: string[]) => {
      let returned: string[];
      if (page_num < prev.length) {
        // -Modify previously selected value.
        // -This runs if back button is pressed.
        const prev_temp = [...prev];
        prev_temp[page_num] = criterion;
        returned = prev_temp;
      } else {
        // -push on new element
        // -This adds a new search critera (without pressing back button)
        returned = [...prev, criterion];
      }
      return returned;
    });

    pageChangeHandler(page_num + 1);
  };

  // --------------------------------------------

  return (
    <div
      ref={setPageRef(page_num)}
      style={{
        background: color_map[page_num],
        position: 'absolute',
        top: 0,
        left: page_num === 0 ? '0%' : '-100%',
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 data-testid={`filter-criteria-title-${page_num}`}>Filter Criteria {page_num}</h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '6rem',
          }}
        >
          {page_num > 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
              onClick={pageUnchangeHandler}
            >
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
              />
            </svg>
          )}
          {/* {!last_page && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              fill='currentColor'
              viewBox='0 0 16 16'
              onClick={pageChangeHandler(page_num + 1)}
            >
              <path
                fillRule='evenodd'
                d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'
              />
            </svg>
          )} */}
        </div>

        <div>
          <button
            onClick={onClickHandler('A')}
            // className={clicked && css.clicked}
            disabled={!clickable}
            data-testid={`button-A-${page_num}`}
          >
            Option 1
          </button>
          <button
            onClick={onClickHandler('B')}
            // className={clicked && css.clicked}
            disabled={!clickable}
            data-testid={`button-B-${page_num}`}
          >
            Option 2
          </button>
        </div>
      </div>
    </div>
  );
};

// ==============================================

export default Page;
