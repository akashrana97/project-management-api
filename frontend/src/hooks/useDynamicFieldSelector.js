// hooks/useDynamicFieldSelector.js
import { useSelector } from 'react-redux';

export function useDynamicFieldSelector(sliceName, field) {
  return useSelector((state) => state[sliceName]?.[field]);
}
