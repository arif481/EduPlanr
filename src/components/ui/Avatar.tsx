/**
 * Avatar Component
 * User profile image with fallback initials
 */

import React from 'react';
import Image from 'next/image';
import { cn, getInitials, stringToColor } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-2 h-2' },
  sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-3 h-3' },
  lg: { container: 'w-12 h-12', text: 'text-base', status: 'w-3.5 h-3.5' },
  xl: { container: 'w-16 h-16', text: 'text-lg', status: 'w-4 h-4' },
};

const statusColors = {
  online: 'bg-neon-green',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-neon-yellow',
};

export function Avatar({
  src,
  name = 'User',
  size = 'md',
  className,
  showStatus = false,
  status = 'online',
}: AvatarProps) {
  const styles = sizeStyles[size];
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center',
          'ring-2 ring-dark-600/50',
          styles.container
        )}
        style={{ backgroundColor: src ? undefined : bgColor }}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <span className={cn('font-semibold text-white', styles.text)}>
            {initials}
          </span>
        )}
      </div>

      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-dark-900',
            statusColors[status],
            styles.status
          )}
        />
      )}
    </div>
  );
}

/**
 * Avatar Group Component
 */
interface AvatarGroupProps {
  users: Array<{ name: string; src?: string | null }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  users,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.src}
          name={user.name}
          size={size}
          className="ring-2 ring-dark-900"
        />
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'rounded-full bg-dark-700 flex items-center justify-center',
            'ring-2 ring-dark-900 text-gray-300 font-medium',
            styles.container,
            styles.text
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
