// hooks/useDynamicSelector.js
import { useSelector } from 'react-redux';

export function useDynamicSelector(sliceName) {
  return useSelector((state) => state[sliceName]);
}
