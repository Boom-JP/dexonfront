import React, { useState,useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space, DatePicker } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { HTTP } from '../../axios';
import dayjs from 'dayjs';

const ThicknessTable = () => {
  const [visible, setVisible] = useState(false);
  const [State, setState] = useState(false);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make GET request to the API endpoint
        const response = await HTTP.get("/thickness/view");
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
        inspection_date: '1/1/2021',
        actual_thickness: '6.5'
    },
    {
        key: '2',
        inspection_date: '1/1/2022',
        actual_thickness: '6.78'
    },
    {
        key: '3',
        inspection_date: '1/1/2021',
        actual_thickness: '6.99'
    },
    {
        key: '4',
        inspection_date: '1/1/2022',
        actual_thickness: '6.87'
    },
    {
        key: '5',
        inspection_date: '1/1/2021',
        actual_thickness: '6.63'
    },
    {
        key: '6',
        inspection_date: '1/1/2022',
        actual_thickness: '6.54'
    },
    {
        key: '7',
        inspection_date: '1/1/2021',
        actual_thickness: '6.77'
    },
    {
        key: '8',
        inspection_date: '1/1/2022',
        actual_thickness: '6.43'
    },
    {
        key: '9',
        inspection_date: '1/1/2021',
        actual_thickness: '6.5'
    },
    {
        key: '10',
        inspection_date: '1/1/2022',
        actual_thickness: '6.78'
    },
  ];

  const columns = [
    {
      title: 'Inspection Date',
      dataIndex: 'inspection_date',
      width: '25%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Actual Thickness (mm)',
      dataIndex: 'actual_thickness',
      width: '25%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: '50%',
      render: (text, record) => (
        
        <Space>

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
    <div className='ThicknessTable'>
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
            <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>TP Number: </span>
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
                    Add Thickness
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
        title='Add Thickness'
        visible={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout='vertical'>
                <Form.Item label='Inspection Date'>
                    <DatePicker style={{width:"100%"}} onChange={onChange} />
                </Form.Item>

                <Form.Item label='Actual Thickness'>
                    <Input />
                </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Edit Thickness'
        visible={State}
        onOk={handleStateOk}
        onCancel={handleStateCancel}
      >
            <Form layout='vertical'>
                <Form.Item label='Inspection Date'>
                    <DatePicker style={{width:"100%"}} defaultValue={dayjs({data}.data.inspection_date, 'YYYY-MM-DD')} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Actual Thickness'>
                    <Input value={{data}.data.actual_thickness} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ThicknessTable;

