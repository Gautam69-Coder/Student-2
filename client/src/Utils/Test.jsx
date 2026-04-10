import React from 'react';
import { Alert } from 'antd';

const App = () => (
  <>
    <Alert message="Success Text" type="success" />
    <br />
    <Alert message="Info Text" type="info" />
    <br />
    <Alert message="Warning Text" type="warning" />
    <br />
    <Alert message="Error Text" type="error" />
    <br />
    <Alert
      message="Success Text"
      type="success"
      style={{ backgroundColor: "#52c41a", color: "#fff" }}
    />
  </>
);

export default App;