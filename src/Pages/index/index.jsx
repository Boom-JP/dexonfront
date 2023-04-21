import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space, DatePicker } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from "react-router-dom";
import { HTTP } from '../../axios';
import dayjs from 'dayjs';
import moment from 'moment';

const PipeTable = () => {
  const [visible, setVisible] = useState(false);
  const [InfoState, setInfoState] = useState(false);
  const [RowSelect, setRowSelect] = useState([""]);

  const history = useHistory();
  const [data, setData] = useState([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const [AddPiping, setAddpiping] = useState({
    line_number: '',
    location: '',
    from: '',
    to: '',
    drawing_number: '',
    service: '',
    material: '',
    inservice_date: null,
    pipe_size: '',
    original_thickness: '',
    stress: '',
    joint_efficiency: '',
    ca: '',
    design_life: '',
    design_pressure: '',
    operating_pressure: '',
    design_temperature: '',
    operating_temperature: ''
  });

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
                onClick={() => handleInfoStateAction(record)} 
                icon={<FormOutlined />} 
                size='small'
            >
                Info
            </Button>

            <Button 
                type='text' 
                shape='round' 
                onClick={() => handleDetailAction(record)} 
                icon={<FileTextOutlined />} 
                size='small'
            >
                Detail
            </Button>

            <Button 
            type='text' 
            shape='round' 
            onClick={() => handleRemoveAction(record)} 
            icon={<DeleteOutlined />} 
            size='small'
            >
                Remove
            </Button>
        </Space>
      ),
    },
  ];

  const handleDetailAction = (record) => {
    console.log(record);
    history.push(`/cml/${record.line_number}`);
  };

  const handleAction = () => {
    setVisible(true);
  };

  const handleRemoveAction = async (record) => {
    try {
      await HTTP.delete(`/pipes/remove/${record.key}`)
      console.log(`remove success`);
      fetchData();
    }catch (error) { 
      console.error(error);
    }
  };

  const handleModalOk = async () => {
    try {
    HTTP.post('/pipes/add', AddPiping)
      .then(response => {
        console.log('Data posted successfully:', response.data);
        fetchData();
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
    setVisible(false);
  }catch (error) {
    console.error(error);
  }
  };

  const handleModalCancel = () => {
    setVisible(false);
  };

  const handleInfoStateAction = async (record) => {
    setInfoState(true)
    const params = {
      "values": {
        "id": record.key
      }
    }
    try {
      // Make POST request to the API endpoint
      const response = await HTTP.post("/pipes/search", params);
      const filteredData = data.filter(item => item.key === record.key);
      const updatedRowSelect = response.data.data[0];
      // Update RowSelect with the new values
      setRowSelect(updatedRowSelect);
      // console.log(RowSelect);
      console.log(updatedRowSelect);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setRowSelect(prevRowSelect => ({ 
      ...prevRowSelect, 
      [field]: value 
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setAddpiping(prevFormData => ({
      ...prevFormData,
      [fieldName]: value
    }));
  };

  const handleDateChange = (date, dateString) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    handleFieldChange('inservice_date',formattedDate);
    handleInputChange('inservice_date',formattedDate);
  };

  const handleInfoStateCancel = () => {
    
    setInfoState(false);
  };

  const handleInfoStateOk = async () => {
    try {
      HTTP.patch('/pipes/update', RowSelect)
        .then(response => {
          console.log('Data posted successfully:', response.data);
          fetchData();
        })
        .catch(error => {
          console.error('Error posting data:', error);
        });
      setVisible(false);
    }catch (error) {
      console.error(error);
    }
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
            rowKey={"key"}
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
          <Form.Item 
            label= 'Line Number'
            name= 'line_name'
          >
            <Input
              value={AddPiping.line_number}
              placeholder='Please input line number'
              onChange={(e) => handleFieldChange('line_number', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label= 'Location'
            name= 'location'
          >
            <Input
              value={AddPiping.location}
              placeholder='Please input location'
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label='From'
            name='from'
          >
            <Input
              value={AddPiping.from}
              placeholder='Please input From'
              onChange={(e) => handleFieldChange('from', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label='To'
            name='to'
          >
            <Input
              value={AddPiping.to}
              placeholder='Please input To'
              onChange={(e) => handleFieldChange('to', e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label='Drawing Number'
            name='drawing_name'
          >
            <Input
              value={AddPiping.drawing_number}
              placeholder='Please input Drawing Number'
              onChange={(e) => handleFieldChange('drawing_number', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label='Service'
            name='service'
          >
            <Input
              value={AddPiping.service}
              placeholder='Please input Service'
              onChange={(e) => handleFieldChange('service', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Material'
            name='material'
          >
            <Input 
            value={AddPiping.material}
            placeholder='Please input Material'
            onChange={(e) => handleFieldChange('material', e.target.value)}
            />
          </Form.Item>
          
          <Form.Item 
            label='Inservice date'
            name='inservice_date'
          >
            <DatePicker
              style={{width:"100%"}}
              value={AddPiping.inservice_date ? moment(AddPiping.inservice_date) : null}
              onChange={handleDateChange}
            />
          </Form.Item>

          <Form.Item
            label='Pipe Size (inch)'
            name='pipe_size'
          >
            <Input
              value={AddPiping.pipe_size}
              placeholder='Please input Pipe Size'
              onChange={(e) => handleFieldChange('pipe_size', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Original Thickness'
            name='original_thickness'>
            <Input
              value={AddPiping.original_thickness}
              placeholder='Please input Original Thickness'
              onChange={(e) => handleFieldChange('original_thickness', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Stress'
            name='stress'>
            <Input 
              value={AddPiping.stress}
              placeholder='Please input Stress'
              onChange={(e) => handleFieldChange('stress', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Joint Efficiency'
            name='joint_efficiency'>
            <Input 
              value={AddPiping.joint_efficiency}
              placeholder='Please input Joint Efficiency'
              onChange={(e) => handleFieldChange('joint_efficiency', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='CA'
            name='ca'
          >
            <Input 
            value={AddPiping.ca}
            placeholder='Please input CA'
            onChange={(e) => handleFieldChange('ca', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Life'
            name='design_life'
            >
            <Input 
            value={AddPiping.design_life}
            placeholder='Please input Design Life'
            onChange={(e) => handleFieldChange('design_life', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Pressure'
            name= 'design_pressure'
            >
            <Input 
              value={AddPiping.design_pressure}
              placeholder='Please input Design Pressure'
              onChange={(e) => handleFieldChange('design_pressure', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Operating Pressure'
            name= 'operating_pressure'
            >
            <Input 
              value={AddPiping.operating_pressure}
              placeholder='Please input Operating Pressure'
              onChange={(e) => handleFieldChange('operating_pressure', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Temperature'
            name= 'design_temperature'
          >
            <Input 
              value={AddPiping.design_temperature}
              placeholder='Please input Design Temperature'
              onChange={(e) => handleFieldChange('design_temperature', e.target.value)}
            />
          </Form.Item>
          
          <Form.Item 
            label='Operating Temperature'
            name= 'operating_temperature'
          >
            <Input 
              value={AddPiping.operating_temperature}
              placeholder='Please input '
              onChange={(e) => handleFieldChange('operating_temperature', e.target.value)}
            />
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
          <Form.Item
            label='Line Number'
          >
            <Input 
              value={RowSelect.line_number}
              onChange={(e) => handleInputChange('line_name', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Location'
          >
            <Input 
              value={RowSelect.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='From'
          >
            <Input 
              value={RowSelect.from} 
              onChange={(e) => handleInputChange('from', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='To'
          >
            <Input 
              value={RowSelect.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Drawing Number'
          >
            <Input 
              value={RowSelect.drawing_number} 
              onChange={(e) => handleInputChange('drawing_number', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Service'
          >
            <Input 
              value={RowSelect.service} 
              onChange={(e) => handleInputChange('service', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Material'
          >
            <Input 
              value={RowSelect.material} 
              onChange={(e) => handleInputChange('material', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Inservice Date'
          >
            <DatePicker 
            style={{ width: "100%" }} 
            value={RowSelect.inservice_date ? moment(RowSelect.inservice_date) : null}
            onChange={handleDateChange}
          />
          </Form.Item>

          <Form.Item 
            label='Pipe Size (inch)'
          >
            <Input 
              value={RowSelect.pipe_size} 
              onChange={(e) => handleInputChange('pipe_size', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Original Thickness'
          >
            <Input 
              value={RowSelect.original_thickness} 
              onChange={(e) => handleInputChange('original_thickness', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Stress'
          >
            <Input 
              value={RowSelect.stress} 
              onChange={(e) => handleInputChange('stress', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Joint Efficiency'
          >
            <Input 
              value={RowSelect.joint_efficiency} 
              onChange={(e) => handleInputChange('joint_efficiency', e.target.value)}
            />
          </Form.Item>
          <Form.Item label='CA'>
            <Input 
              value={RowSelect.ca} 
              onChange={(e) => handleInputChange('ca', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Life'
          >
            <Input 
              value={RowSelect.design_life} 
              onChange={(e) => handleInputChange('design_life', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Pressure'
          >
            <Input 
            value={RowSelect.design_pressure} 
            onChange={(e) => handleInputChange('design_pressure', e.target.value)}
          />
          </Form.Item>

          <Form.Item 
            label='Operating Pressure'
          >
            <Input 
              value={RowSelect.operating_pressure} 
              onChange={(e) => handleInputChange('operating_pressure', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Temperature'
          >
            <Input 
              value={RowSelect.design_temperature} 
              onChange={(e) => handleInputChange('design_temperature', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Operating Temperature'
          >
            <Input 
              value={RowSelect.operating_temperature} 
              onChange={(e) => handleInputChange('operating_temperature', e.target.value)}
            />
          </Form.Item>
        </Form>
        </Modal>
    </div>
  );
};

export default PipeTable;