import { message } from 'antd';
import { toUpperName } from './toUpperName';

export const customMessage = ({ content, type = 'info' }) => {
    const formatted = typeof content === 'string' ? toUpperName(content) : content;
    if (typeof message[type] === 'function') {
        message[type](formatted);
    } else {
        message.info(formatted);
    }
};

export { toUpperName };
