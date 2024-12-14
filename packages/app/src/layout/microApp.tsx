import { start } from 'qiankun';
import { useEffect } from 'react';

const MicroApp = () => {
  /** 加载子应用 */
  const handleLoadMicroApp = () => {
    if (!window.qiankunStarted) {
      window.qiankunStarted = true;
      start();
    }
  };

  useEffect(() => {
    handleLoadMicroApp();
  }, []);

  return (
    <div>
      <div id="subapp"></div>
    </div>
  );
};

export default MicroApp;
