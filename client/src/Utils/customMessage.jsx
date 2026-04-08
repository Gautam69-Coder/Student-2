import { message } from 'antd';

export const customMessage = ({ content, type }) => {
    message[type](content);
};