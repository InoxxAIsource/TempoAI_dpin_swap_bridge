interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'failed';
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const statusConfig = {
    completed: {
      color: 'text-green-600 dark:text-green-400 border-green-600/20 bg-green-600/10',
      label: 'Completed',
    },
    pending: {
      color: 'text-yellow-600 dark:text-yellow-400 border-yellow-600/20 bg-yellow-600/10',
      label: 'Pending',
    },
    failed: {
      color: 'text-red-600 dark:text-red-400 border-red-600/20 bg-red-600/10',
      label: 'Failed',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
