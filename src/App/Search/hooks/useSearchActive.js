import { useMemo } from 'react';
import { useDidMount } from 'rooks';
import { useDashboardState } from '@hyperobjekt/react-dashboard';

/**
 * Returns state and setter that determines if the search modal is active
 * @returns {[boolean, (boolean) => void]}
 */
export default function useSearchActive() {
  const searchActive = useDashboardState('searchActive');
  const setState = useDashboardState('set');
  const setSearchActive = (searchActive) => setState({ searchActive });
  // set default on mount if it is not set
  useDidMount(() => {
    if (!searchActive) setSearchActive(false);
  });
  return useMemo(() => {
    return [searchActive, setSearchActive];
  }, [searchActive, setSearchActive]);
}
