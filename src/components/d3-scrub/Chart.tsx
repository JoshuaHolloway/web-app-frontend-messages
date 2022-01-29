import BrushChart from './BrushChart';

// ==============================================

export default function Chart({
  data,
  data_labels,
  selection,
  setSelection,
}: {
  data: number[];
  data_labels: string[];
  selection: number[];
  setSelection: (arr: number[]) => void;
}) {
  return (
    <>
      <h2>Product Sales as Function of Date</h2>

      <BrushChart data={data} data_labels={data_labels} selection={selection} setSelection={setSelection} />
    </>
  );
}

// ==============================================
