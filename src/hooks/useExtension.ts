import { EXTENSION_ID } from '~constants';
import { useEffect, useState } from 'react';
import { logger } from '~utils';

export const useExtensionHelper = () => {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(true);
  const [sentMessage, setSentMessage] = useState(false);

  useEffect(() => {
    checkIfExtensionIsInstalled();
  }, []);

  const checkIfExtensionIsInstalled = () => {
    try {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        { message: 'PING' },
        function (response) {
          logger.debug('Pinged extension and received response: ' + response);
          if (response) {
            logger.debug('Extension received PING message successfully');
            setIsExtensionInstalled(true);
          } else {
            logger.warn(
              'Extension is likely installed but failed to respond to PING request.',
            );
            setIsExtensionInstalled(false);
          }
          setSentMessage(!sentMessage);
        },
      );
    } catch (error) {
      logger.warn('Failed to send PING message to the extension: ' + error);
      setIsExtensionInstalled(false);
      setSentMessage(!sentMessage);
    }
  };

  return { isExtensionInstalled };
};
