import React, { useState,useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space, DatePicker } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory, useParams } from "react-router-dom";
import { HTTP } from '../../axios';
import moment from 'moment';

const ThicknessTable = () => {
  const [visible, setVisible] = useState(false);
  const [State, setState] = useState(false);
  const [RowSelect, setRowSelect] = useState([""]);

  const [LineNumber, setLineNumber] = useState('');
  const [CmlNumber, setCmlNumber] = useState('');
  const [TPNumber, setTPNumber] = useState('');
  const [data, setData] = useState([]);

  const { line_number } = useParams();
  const { cml_number } = useParams();
  const { tp_number } = useParams();


  const fetchData = async () => {
    try {
      // Make GET request to the API endpoint
      const response = await HTTP.post(`/thickness/search/${line_number}/${cml_number}/${tp_number}`);
      setCmlNumber(response.data.data[0].cml_number);
      setLineNumber(response.data.data[0].line_number);
      setTPNumber(response.data.data[0].tp_number);
      setData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [Add, setAdd] = useState({
    line_number: LineNumber,
    cml_number: CmlNumber,
    tp_number: TPNumber,
    inspection_date: '',
    actual_thickness: ''
  });


  const dataSource = Array.isArray(data) ? data.map(item => {
    return {
      key: item.id,
      line_number: item.line_number,
      cml_number: item.cml_number,
      tp_number: item.tp_number,
      inspection_date: item.inspection_date,
      actual_thickness: item.actual_thickness
    }
  }): [];

  const columns = [
    {
      title: 'Inspection Date',
      dataIndex: 'inspection_date',
      width: '25%',
      editable: true,
      align: 'center',
      onCell: record => ({
        record,
        editable: true,
        dataIndex: 'inspection_date',
        title: 'Inspection Date',
        handleInputChange: handleInputChange, // Callback function for handling input changes
      }),
    },
    {
      title: 'Actual Thickness (mm)',
      dataIndex: 'actual_thickness',
      width: '25%',
      editable: true,
      align: 'center',
      onCell: record => ({
        record,
        editable: true,
        dataIndex: 'actual_thickness',
        title: 'Actual Thickness (mm)',
        handleInputChange: handleInputChange, // Callback function for handling input changes
      }),
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
                onClick={() => handleStateAction(record)} 
                icon={<FormOutlined />} 
                size='small'
            >
                Edit
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
        </Space>)
    }
  ];

  const handleRemoveAction = async (record) => {
    try {
      await HTTP.delete(`/thickness/remove/${record.key}`)
      console.log(`remove success`);
      fetchData();
    }catch (error) { 
      console.error(error);
    }
  };

  const handleModalOk = () => {
    try {
      HTTP.post('/thickness/add', Add)
        .then(response => {
          console.log('Data posted successfully:', response.data);
          fetchData();
          setVisible(false);
        })
        .catch(error => {
          console.error('Error posting data:', error);
        });
      
    }catch (error) {
      console.error(error);
    }
  };

  const handleModalCancel = () => {
    
    setVisible(false);
  };

  const handleStateAction = async (record) => {
    setState(true)
    const params = {
      "values": {
        "id": record.key
      }
    }
    try {
      // Make POST request to the API endpoint
      const response = await HTTP.post("/thickness/search", params);
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

  const handleStateCancel = () => {
    
    setState(false);
  };

  const handleStateOk = () => {
    try {
      HTTP.patch('/thickness/update', RowSelect)
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
    setState(false);
  };

  const handleAction = () => {
    setVisible(true);
  };

  const handleFieldChange = (fieldName, value) => {
    setAdd(prevFormData => ({
      ...prevFormData,
      line_number: LineNumber,
      cml_number: CmlNumber,
      tp_number: TPNumber,
      [fieldName]: value
    }));
  };

  const handleInputChange = (field, value) => {
    setRowSelect(prevRowSelect => ({ 
      ...prevRowSelect, 
      [field]: value 
    }));
  };

  const handleDateChange = (date, dateString) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    handleFieldChange('inspection_date',formattedDate);
    handleInputChange('inspection_date',formattedDate);
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
                <span style={{ fontSize: '16px'}}>{LineNumber}</span>
            </div>
            <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>CML Number: </span>
                <span style={{ fontSize: '16px'}}>{CmlNumber}</span>
            </div>
            <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>TP Number: </span>
                <span style={{ fontSize: '16px'}}>{TPNumber}</span>
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
                <Form.Item 
                  label='Inspection Date'
                  name='inspection_date'
                >
                    <DatePicker 
                      style={{width:"100%"}}
                      value={Add.inspection_date ? moment(Add.inspection_date) : null}
                      onChange={handleDateChange} 
                    />
                </Form.Item>

                <Form.Item
                  label='Actual Thickness'
                  name = "actual_thickness">
                    <Input
                      value={Add.actual_thickness}
                      onChange={(e) => handleFieldChange('actual_thickness', e.target.value)}
                    />
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
                    < DatePicker
                      style={{width:"100%"}}
                      value={RowSelect.inspection_date ? moment(RowSelect.inspection_date) : null}
                      onChange={handleDateChange}
                      />
                </Form.Item>
                <Form.Item label='Actual Thickness'>
                    <Input
                      value={RowSelect.actual_thickness} 
                      placeholder='Please input Actual Thickness'
                      onChange={(e) => handleInputChange('pipe_size', e.target.value)}
                      />                
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ThicknessTable;

