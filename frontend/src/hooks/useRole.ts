import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { Role } from '@/types/auth.types';

export const useRole = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role);

  return {
    role,
    isCoach: role === 'COACH',
    isCaptain: role === 'CAPTAIN',
    isPlayer: role === 'PLAYER',
    hasRole: (allowedRoles: Role[]) => role ? allowedRoles.includes(role) : false,
  };
};
