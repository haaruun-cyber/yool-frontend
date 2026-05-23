import clsx from 'clsx';

const STYLES = {
  not_started: 'bg-notion-hover text-ink-muted',
  in_progress: 'bg-blue-500/15 text-blue-400',
  done: 'bg-emerald-500/15 text-emerald-400',
  open: 'bg-notion-hover text-ink-muted',
};

const LABELS = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  open: 'Not started',
};

export function StatusPill({ value, onChange, disabled }) {
  if (onChange && !disabled) {
    return (
      <select
        value={value || 'not_started'}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'cursor-pointer rounded-md px-2 py-0.5 text-xs font-medium outline-none ring-0',
          STYLES[value] || STYLES.not_started
        )}
      >
        <option value="not_started">Not started</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
    );
  }
  return (
    <span className={clsx('inline-flex rounded-md px-2 py-0.5 text-xs font-medium', STYLES[value] || STYLES.not_started)}>
      {LABELS[value] || 'Not started'}
    </span>
  );
}
