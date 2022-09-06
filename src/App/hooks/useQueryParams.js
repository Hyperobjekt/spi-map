import { history } from 'App/history';
import { useEffect, useState } from 'react';

const getParams = (search) => Object.fromEntries(new URLSearchParams(search));

const useQueryParams = () => {
  const [params, setParams] = useState(getParams(window.location.search));

  const listener = (location, action) => {
    setParams(getParams(location.search));
  };

  useEffect(() => {
    const unlisten = history.listen(listener);
    return unlisten;
  }, []);

  return params;
};

export default useQueryParams;
