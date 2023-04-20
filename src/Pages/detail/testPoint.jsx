import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from "react-router-dom";
import { HTTP } from '../../axios';

const { TextArea } = Input;
const TestPointTable = () => {
  const [visible, setVisible] = useState(false);
  const [State, setState] = useState(false);

  const history = useHistory();

  const [data, setData] = useState(" ");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make GET request to the API endpoint
        const response = await HTTP.get("/testPoint/view");
        setData(response.data.data[0]);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dataSource = [
    {
        key: '1',
        tp_number: '1',
        tp_description: '0',
        note: ''
    },
    {
        key: '2',
        tp_number: '1',
        tp_description: '90',
        note: ''
    },
    {
        key: '3',
        tp_number: '3',
        tp_description: '180',
        note: ''
    },
    {
        key: '4',
        tp_number: '4',
        tp_description: '270',
        note: ''
    },
    {
        key: '5',
        tp_number: '1',
        tp_description: '0',
        note: ''
    },
    {
        key: '6',
        tp_number: '2',
        tp_description: '90',
        note: ''
    },
    {
        key: '7',
        tp_number: '3',
        tp_description: '180',
        note: ''
    },
    {
        key: '8',
        tp_number: '4',
        tp_description: '270',
        note: ''
    }
  ];

  const columns = [
    {
      title: 'TP Number',
      dataIndex: 'tp_number',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'TP Description',
      dataIndex: 'tp_description',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'note',
      dataIndex: 'note',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: '8%',
      render: (text, record) => (
        
        <Space>
            <Button 
                type='text' 
                shape='round' 
                onClick={() => handleThicknessViewAction()} 
                icon={<FileTextOutlined />} 
                size='small'
            >
                View Thickness
            </Button>

            <Button 
                type='text' 
                shape='round' 
                onClick={() => handleStateAction()} 
                icon={<FormOutlined />} 
                size='small'
            >
                Edit
            </Button>

            <Button 
            type='text' 
            shape='round' 
            // onClick={() => handleAction()} 
            icon={<DeleteOutlined />} 
            size='small'
            >
                Remove
            </Button>
        </Space>)
    }
  ];

  const handleThicknessViewAction = () => {
    history.push("/thickness");
  };

  const handleAction = () => {
    
    setVisible(true)
  };

  const handleModalOk = () => {
    
    setVisible(false);
  };

  const handleModalCancel = () => {
    
    setVisible(false);
  };

  const handleStateAction = () => {
    
    setState(true)
  };

  const handleStateCancel = () => {
    
    setState(false);
  };

  const handleStateOk = () => {
    
    setState(false);
  };

  return (
    <div className='TPTable'>
      <div className='container'>
        <Card
          title={<div style={{ textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: '#1890FF' }}>Piping</div>}
          
        >
          <div className='herder' style={{ float: 'left' , paddingBottom:"10px", textAlign: 'left' }}>
            <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Line Number: </span>
                <span style={{ fontSize: '16px'}}>6-PL-J4N-01007</span>
            </div>
            <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>CML Number: </span>
                <span style={{ fontSize: '16px'}}>1</span>
            </div>
          </div>
          <div className='add-new-button' style={{ float: 'right' , paddingBottom:"10px"}}>
                <Button 
                    type='primary' 
                    shape='round' 
                    icon={<PlusOutlined />} 
                    size='default' 
                    onClick={() => handleAction()}
                >
                    Add TP
                </Button>
            </div>
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            pagination={false} 
            scroll={{x: 1200}}
            rowKey="key"
            style={{width:"100%"}}
            />
        </Card>
      </div>

      <Modal
        title='Add TP'
        visible={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout='vertical'>
                <Form.Item label='TP Number'>
                    <Input />
                </Form.Item>

                <Form.Item label='TP Description'>
                    <Input />
                </Form.Item>

                <Form.Item label='Note'>
                    <TextArea rows={4}/>
                </Form.Item>

            </Form>
      </Modal>

      <Modal
        title='Edit TP'
        visible={State}
        onOk={handleStateOk}
        onCancel={handleStateCancel}
      >
            <Form layout='vertical'>
                <Form.Item label='TP Number'>
                    <Input value={{data}.data.tp_number} onChange={(e) => setData(e.target.value)} />
                </Form.Item>

                <Form.Item label='TP Description'>
                    <Input value={{data}.data.tp_description} onChange={(e) => setData(e.target.value)} />
                </Form.Item>

                <Form.Item label='Note'>
                    <Input value={{data}.data.note} onChange={(e) => setData(e.target.value)} />
                </Form.Item>

            </Form>
        </Modal>

    </div>
  );
};

export default TestPointTable;