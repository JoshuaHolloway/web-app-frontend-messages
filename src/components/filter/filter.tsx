import React, { FC, useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
import { Product } from '@src/code/types/Product';
import Card from '@src/components/product-card/card';
import css from './filter.module.scss';

// ==============================================

interface FilterData {
  key: string;
  id: string;
  value: string;
  label: string;
}
const filterData: FilterData[] = [
  {
    key: 'a60d8cc07e9b0d6f57bcb8ded7b7da33',
    id: 'greenCheck',
    value: css.green,
    label: 'Category 1',
  },
  {
    key: '293e898899c66c5b452c13dfb73abd74',
    id: 'orangeCheck',
    value: css.orange,
    label: 'Category 2',
  },
  {
    key: 'f51d8f6880043674328ddb45123a8700',
    id: 'purpleCheck',
    value: css.purple,
    label: 'Category 3',
  },
];
// ==============================================

const filtersInitArray: string[] = filterData.map((e: FilterData) => e.value);
filtersInitArray.shift();

// ==============================================

interface ElementsData {
  id: string;
  type: string;
}
const elementsData: ElementsData[] = [
  {
    id: '66dccd6b45fab529c10583c7eabd974c',
    type: css.green,
  },
  {
    id: '19f15869ca42ec22e3af68748c358f2e',
    type: css.green,
  },
  {
    id: '7abb9ed363c90128d0ddd6d9b687e771',
    type: css.orange,
  },
  {
    id: '5162114a285af56bcae3440d8afb8917',
    type: css.purple,
  },
  {
    id: 'e44ba992c2c8ad38fde8c04bbe1d7d3c',
    type: css.orange,
  },
  {
    id: 'dbe6edd40feaa3cd75d83c750a302f22',
    type: css.purple,
  },
  {
    id: '64c0105243f140438d1ffe9d03ca0463',
    type: css.orange,
  },
  {
    id: 'f6dd49fd8df050dee4f763b56c1a1fac',
    type: css.orange,
  },
  {
    id: 'd301edb5066bb1f000a626df1a2aab1e',
    type: css.green,
  },
  {
    id: '481c393926c852245242104aa746664e',
    type: css.green,
  },
];

// ==============================================

const Filter: FC = () => {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const notificationCtx = useContext(NotificationContext);
  const [products, setProducts] = useState<Product[]>([]);

  // --------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest('/api/products');
        // console.log('data: ', data);
        setProducts(data);
      } catch (err: any) {
        console.log('error: ', err);
        notificationCtx.endError({ message: 'oh shit: error grabbing products' });
      }
    })();
  }, []);

  // --------------------------------------------

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted) {
      gsap.registerPlugin(Flip);
    }
  }, [mounted]);

  // --------------------------------------------

  const [filter, setFilter] = useState<string[]>(filtersInitArray);
  const elements = useRef<HTMLDivElement[]>([]);

  // --------------------------------------------

  useEffect(() => {
    if (mounted) {
      const state = Flip.getState(elements.current);
      const matches = filter.length ? gsap.utils.toArray(filter.map((e) => '.' + e).join(',')) : filter;
      // Update the display of the filtered elements
      elements.current.forEach((el) => {
        el.style.display = matches.indexOf(el) === -1 ? 'none' : 'inline-flex';
      });
      // Create the animation
      Flip.from(state, {
        duration: 1,
        scale: true,
        absolute: true,
        ease: 'power1.inOut',
        onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1 }),
        onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0, duration: 1 }),
      });
    }
  }, [filter]);

  // --------------------------------------------

  const filterChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (value === 'all') {
      if (checked) {
        setFilter(filtersInitArray);
      } else {
        setFilter([]);
      }
    } else {
      const empty_arr: string[] = [];
      if (checked) {
        setFilter(empty_arr.concat(filter, value));
      } else {
        setFilter(filter.filter((e) => e !== value));
      }
    }
  };

  // --------------------------------------------

  const setRefs = (e: HTMLDivElement, i: number) => {
    const { current } = elements;
    current[i] = e;
  };

  // --------------------------------------------

  const renderFilters = () => {
    return filterData.map((e: FilterData) => (
      <div className={`${css['form-check']} ${css['form-check-inline']}`} key={e.key}>
        <label className={css['form-check-label']} htmlFor={e.id}>
          <input
            className={`${css.input} ${css['form-check-input']}`}
            type="checkbox"
            value={e.value}
            id={e.id}
            checked={e.value === 'all' ? filter.length === filterData.length - 1 : filter.indexOf(e.value) > -1}
            onChange={filterChangeHandler}
          />
          {e.label}
        </label>
      </div>
    ));
  };

  // --------------------------------------------

  const renderElements = () => {
    return elementsData.map((e: ElementsData, i: number) => {
      if (i < products.length) {
        return (
          <div className={`${css['filter-element']} ${e.type}`} key={e.id} ref={(el: HTMLDivElement) => setRefs(el, i)}>
            <Card product={products[i]} />
          </div>
        );
      }
    });
  };

  // --------------------------------------------

  return (
    <div className={css.container}>
      <div className={css.row}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
          <div className={css.filter_container}>{renderFilters()}</div>
        </div>
      </div>
      <div className={css.row}>
        {products.length > 0 && <div className={css['element-container']}>{renderElements()}</div>}
      </div>
    </div>
  );
};

// ==============================================

export default Filter;
