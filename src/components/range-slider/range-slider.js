import { useState, useRef } from 'react';

import { element_geometry } from './geometry.js';

// ==============================================

export default function Canvas({ setDurationMinInput, setDurationMaxInput, duration_input_min }) {
  // --------------------------------------------

  const CANVAS_WIDTH = 400;
  const MAX_VAL = 120;
  // const MIN_VAL = 1;

  // --------------------------------------------

  const [click_num, setClickNum] = useState(1);

  const [prev_canvas_click_coords, setPrevCanvasClickCoords] = useState();

  // --------------------------------------------

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  //   return () => setMounted(false);
  // }, []);

  // --------------------------------------------

  const canvas_ref = useRef();

  // --------------------------------------------

  const canvas_click_handler = (e) => {
    // - - - - - - - - - - - - - - - - - - - - -

    function get_mouse_coordinates(event) {
      // TODO: Only calculate this once (on page load)
      //       -Or when the screen is resized.
      // -(x1, y1) is the upper-left corner of the canvaas.
      // -Since (clientX, clientY) are the viewport coordinates,
      //  we need to shift them by the upper left corner
      //  of the canvas to get the coordinates inside
      //  the canvas.

      // const [screenX, screenY] = [event.screenY, event.screenY];
      const { x1, y1 } = element_geometry(canvas_ref.current);
      const [x, y] = [event.clientX, event.clientY];
      return [x - x1, y - y1];
      // return [event.screenX, event.screenY];
    }

    // - - - - - - - - - - - - - - - - - - - - -

    // TODO: Get this outside of this click function
    // Step 0: get context
    const ctx = canvas_ref.current.getContext('2d');
    // console.log(ctx);

    // Step 1: Get mouse coordinates (canvas-coordinates)
    const [x, y] = get_mouse_coordinates(e);
    // console.log(`(x, y)  :  (${x}, ${y})`);

    // Step 2: Draw circle at location clicked
    const canvas_height = canvas_ref.current.height;
    const half_canvas_height = canvas_height / 2;

    // - - - - - - - - - - - - - - - - - - - - -

    function drawCircle(circle) {
      ctx.beginPath();
      // ctx.arc(circle.x - x1, circle.y - y1, circle.size, 0, Math.PI * 2);

      const size = 24;
      ctx.arc(circle.x, half_canvas_height, size, 0, Math.PI * 2);
      ctx.fillStyle = '#6C757D';
      ctx.fill();
    }

    // - - - - - - - - - - - - - - - - - - - - -

    // Step 3: Set value of slider and draw circle

    if (click_num === 1) {
      // 3.2: Clear canvas:

      ctx.clearRect(0, 0, canvas_ref.current.width, canvas_ref.current.height);

      const scale_factor = x / CANVAS_WIDTH;
      const left_val = Math.round(MAX_VAL * scale_factor);

      // debugger;
      setDurationMinInput(left_val);
      setDurationMaxInput(MAX_VAL);
      setClickNum(2);
      drawCircle({ x, y });
    } else {
      const scale_factor = x / CANVAS_WIDTH;
      const right_val = Math.round(MAX_VAL * scale_factor);

      // -Fill in area between two clicks:
      const prev_x = prev_canvas_click_coords[0];
      const width = x - prev_x;
      drawCircle({ x, y });
      ctx.fillStyle = '#212529';
      ctx.fillRect(prev_x, 0, width, canvas_height);

      // void ctx.fillRect(x, y, width, height);

      if (x > prev_x) {
        // -Ensure that second click is larger than first click
        setDurationMaxInput(right_val);
      } else {
        // -If second click is smaller than first click
        //  just swap max and min
        setDurationMinInput(right_val);
        setDurationMaxInput(duration_input_min);
      }

      setClickNum(1);

      ctx.fillStyle = 'green';
    }

    // drawCircle({ x, y });
    setPrevCanvasClickCoords([x, y]);
  };
  // --------------------------------------------

  return (
    <>
      <canvas
        ref={canvas_ref}
        id="canvas"
        width={`${CANVAS_WIDTH}px`}
        height="50px"
        style={{ background: 'lightgray', borderRadius: '5px' }}
        onClick={canvas_click_handler}
      ></canvas>
    </>
  );
}
