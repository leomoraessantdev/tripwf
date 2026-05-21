export default function Slider({ valor, onChange, min = 0, max = 100, step = 1, label }) {
  const percent = ((valor - min) / (max - min)) * 100

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 text-sm font-semibold text-primary-700 dark:text-ink-100">
          <span>{label}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-accent-500"
        style={{
          background: `linear-gradient(to right, #E36414 0%, #E36414 ${percent}%, var(--slider-trilho, #EADEC8) ${percent}%, var(--slider-trilho, #EADEC8) 100%)`
        }}
      />
      <div className="flex justify-between mt-2 text-xs text-primary-400 dark:text-ink-300">
        <span>€{min}</span>
        <span>€{max}</span>
      </div>
    </div>
  )
}
