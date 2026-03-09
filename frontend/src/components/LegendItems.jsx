export default function LegendItems({ color, label, border, borderColor }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className={`w-5 h-5 ${border ? `border-2 ${borderColor} bg-white` : color}`}
        ></div>
        <span>{label}</span>
      </div>
    </>
  );
}
