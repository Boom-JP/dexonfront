import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory, useParams } from "react-router-dom";
import { HTTP } from '../../axios';
const { TextArea } = Input;

const TestPointTable = () => {
  const [visible, setVisible] = useState(false);
  const [State, setState] = useState(false);
  const [LineNumber, setLineNumber] = useState('');
  const [CmlNumber, setCmlNumber] = useState('');
  const [RowSelect, setRowSelect] = useState([""]);
  const [data, setData] = useState([]);

  const { line_number } = useParams();
  const { cml_number } = useParams();

  const history = useHistory();

  const fetchData = async () => {
    try {
      const response = await HTTP.post(`/testPoint/search/${line_number}/${cml_number}`);
      setCmlNumber(response.data.data[0].cml_number);
      setLineNumber(response.data.data[0].line_number);
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
    tp_number: '',
    tp_description: '',
    note: ''
  });

  const dataSource = Array.isArray(data) ? data.map(item => {
    return {
      key: item.id,
      line_number: item.line_number,
      cml_number: item.cml_number,
      tp_number: item.tp_number,
      tp_description: item.tp_description,
      note: item.note
    }
  }): [];
  
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
                onClick={() => handleThicknessViewAction(record)} 
                icon={<FileTextOutlined />} 
                size='small'
            >
                View Thickness
            </Button>

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

  const handleThicknessViewAction = (record) => {
    history.push(`/thickness/${line_number}/${cml_number}/${record.tp_number}`);
  };

  const handleRemoveAction = async (record) => {
    try {
      await HTTP.delete(`/testPoint/remove/${record.key}`)
      console.log(`remove success`);
      fetchData();
    }catch (error) { 
      console.error(error);
    }
  };

  const handleAction = () => {
    setVisible(true)
  };

  const handleModalOk = () => {
    try {
      HTTP.post('/testPoint/add', Add)
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
      const response = await HTTP.post("/testPoint/search", params);
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
      HTTP.patch('/testPoint/update', RowSelect)
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

  const handleInputChange = (field, value) => {
    setRowSelect(prevRowSelect => ({ 
      ...prevRowSelect, 
      [field]: value 
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setAdd(prevFormData => ({
      ...prevFormData,
      line_number: LineNumber,
      cml_number: CmlNumber,
      [fieldName]: value
    }));
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
                <span style={{ fontSize: '16px'}}>{LineNumber}</span>
            </div>
            <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>CML Number: </span>
                <span style={{ fontSize: '16px'}}>{CmlNumber}</span>
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
                    Add Test Point
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
                <Form.Item 
                  label= 'TP Number'
                  name= 'tp_number'
                >
                    <Input
                      value={Add.tp_number}
                      placeholder='Please input TP Number'
                      onChange={(e) => handleFieldChange('tp_number', e.target.value)}
                    />
                </Form.Item>

                <Form.Item 
                  label='TP Description'
                  name= 'tp_description'
                >
                    <Input
                      value={Add.tp_description}
                      placeholder='Please input TP Description'
                      onChange={(e) => handleFieldChange('tp_description', e.target.value)}
                    />
                </Form.Item>

                <Form.Item 
                  label='Note'
                  name= 'note'
                >
                    <TextArea 
                      rows={4}
                      value={Add.note}
                      placeholder='Please input Note'
                      onChange={(e) => handleFieldChange('note', e.target.value)}
                    />
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
                    <Input 
                      value={RowSelect.tp_number} 
                      onChange={(e) => handleInputChange('tp_number', e.target.value)}
                    />
                </Form.Item>

                <Form.Item label='TP Description'>
                    <Input 
                      value={RowSelect.tp_description} 
                      onChange={(e) => handleInputChange('tp_description', e.target.value)}
                    />
                </Form.Item>

                <Form.Item label='Note'>
                    <TextArea 
                      rows= {4}
                      value={RowSelect.note} 
                      onChange={(e) => handleInputChange('note', e.target.value)}
                    />
                </Form.Item>

            </Form>
        </Modal>

    </div>
  );
};

export default TestPointTable;