import { message } from 'antd';
import { toUpperName } from './ToUpperName';

export const customMessage = ({ content, type }) => {
    message[type](toUpperName(content));
};