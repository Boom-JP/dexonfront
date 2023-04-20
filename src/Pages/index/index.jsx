import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space, DatePicker } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from "react-router-dom";
import { HTTP } from '../../axios';
import dayjs from 'dayjs';

const PipeTable = () => {
  const [visible, setVisible] = useState(false);
  const [InfoState, setInfoState] = useState(false);

  const history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make GET request to the API endpoint
        const response = await HTTP.get("/pipes/view");
        setData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dataSource = data.map(item => {
    return {
      key: item.id,
      line_number: item.line_number,
      location: item.location,
      from: item.from,
      to: item.to,
      drawing_number: item.drawing_number,
      service: item.service,
      material: item.material,
      inservice_date: item.inservice_date,
      pipe_size: item.pipe_size,
      original_thickness: item.original_thickness,
      stress: item.stress,
      joint_efficiency: item.joint_efficiency,
      ca: item.ca,
      design_life: item.design_life,
      design_pressure: item.design_pressure,
      operating_pressure: item.operating_pressure,
      design_temperature: item.design_temperature,
      operating_temperature: item.operating_temperature
    }
  });

  const columns = [
    {
      title: 'Line Number',
      dataIndex: 'line_number',
      key: 'line_number',
      align: 'center',
      width: '15%',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      align: 'center',
      width: '10%',
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      align: 'center',
      width: '20%',
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      align: 'center',
      width: '20%',
    },
    {
      title: 'Pipe Size (inch)',
      dataIndex: 'pipe_size',
      key: 'pipe_size',
      align: 'center',
      width: '8%',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      align: 'center',
      width: '8%',
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      align: 'center',
      width: '19%',
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
                onClick={() => handleInfoStateAction()} 
                icon={<FormOutlined />} 
                size='small'
            >
                Info
            </Button>

            <Button 
                type='text' 
                shape='round' 
                onClick={() => handleDetailAction()} 
                icon={<FileTextOutlined />} 
                size='small'
            >
                Detail
            </Button>

            <Button 
            type='text' 
            shape='round' 
            onClick={() => handleAction()} 
            icon={<DeleteOutlined />} 
            size='small'
            >
                Remove
            </Button>
        </Space>
      ),
    },
  ];


  const handleDetailAction = () => {
    history.push("/cml");
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

  const handleInfoStateAction = () => {
    // console.log({data}.data.data[0]);
    setInfoState(true)
  };

  const handleInfoStateCancel = () => {
    
    setInfoState(false);
  };

  const handleInfoStateOk = () => {
    
    setInfoState(false);
  };

  return (
    <div className='pipeTable'>
      <div className='container'>
        <Card
          title={<div style={{ textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: '#1890FF' }}>Piping</div>}
          extra={
            <div className='add-new-button' style={{ float: 'right' }}>
                <Button 
                    type='primary' 
                    shape='round' 
                    icon={<PlusOutlined />} 
                    size='default' 
                    onClick={() => handleAction()}
                >
                    Add Piping
                </Button>
            </div>
          }
        >
          <Table 
            dataSource={dataSource}
            columns={columns} 
            pagination={false} 
            scroll={{x: 1200}}
            rowKey={(record) => record.uid}
            />
        </Card>
      </div>

      <Modal
        title='Add Piping'
        visible={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout='vertical'>
          <Form.Item label='Line Number'>
            <Input />
          </Form.Item>

          <Form.Item label='Location'>
            <Input />
          </Form.Item>

          <Form.Item label='From'>
            <Input />
          </Form.Item>

          <Form.Item label='To'>
            <Input />
          </Form.Item>
          
          <Form.Item label='Drawing Number'>
            <Input />
          </Form.Item>

          <Form.Item label='Service'>
            <Input />
          </Form.Item>

          <Form.Item label='Material'>
            <Input />
          </Form.Item>
          
          <Form.Item label='Inservice date'>
            <Input />
          </Form.Item>

          <Form.Item label='Pipe Size (inch)'>
            <Input />
          </Form.Item>

          <Form.Item label='Original Thickness'>
            <Input />
          </Form.Item>

          <Form.Item label='Stress'>
            <Input />
          </Form.Item>

          <Form.Item label='Joint Efficiency'>
            <Input />
          </Form.Item>

          <Form.Item label='CA'>
            <Input />
          </Form.Item>

          <Form.Item label='Design Life'>
            <Input />
          </Form.Item>

          <Form.Item label='Design Pressure'>
            <Input />
          </Form.Item>

          <Form.Item label='Operating Pressure'>
            <Input />
          </Form.Item>

          <Form.Item label='Design Temperature'>
            <Input />
          </Form.Item>
          
          <Form.Item label='Operating Temperature'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Piping Information'
        visible={InfoState}
        onOk={handleInfoStateOk}
        onCancel={handleInfoStateCancel}
      >
            <Form 
              layout='vertical'
            >
                <Form.Item label='Line Number'>
                    <Input value={{data}.data.line_number} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Location'>
                    <Input value={{data}.data.location} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='From'>
                    <Input value={{data}.data.from} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='To'>
                    <Input value={{data}.data.to} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Drawing Number'>
                  <Input value={{data}.data.drawing_number} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Service'>
                    <Input value={{data}.data.service} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Material'>
                    <Input value={{data}.data.material} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Inservice Date'>
                  <DatePicker style={{width:"100%"}} defaultValue={dayjs({data}.data.inservice_date, 'YYYY-MM-DD')} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Pipe Size (inch)'>
                    <Input value={{data}.data.pipe_size} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Original Thickness'>
                  <Input value={{data}.data.original_thickness} onChange={(e) => setData(e.target.value)}/>
                </Form.Item>
                <Form.Item label='Stress'>
                  <Input value={{data}.data.stress} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Joint Efficiency'>
                  <Input value={{data}.data.joint_efficiency} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='CA'>
                  <Input value={{data}.data.ca} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Design Life'>
                  <Input value={{data}.data.design_life} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Design Pressure'>
                  <Input value={{data}.data.design_pressure} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Operating Pressure'>
                  <Input value={{data}.data.operating_pressure} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Design Temperature'>
                  <Input value={{data}.data.design_temperature} onChange={(e) => setData(e.target.value)} />
                </Form.Item>
                <Form.Item label='Operating Temperature'>
                  <Input value={{data}.data.operating_temperature} onChange={(e) => setData(e.target.value)}/>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default PipeTable;