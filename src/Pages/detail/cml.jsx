import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory, useParams } from "react-router-dom";
import { HTTP } from '../../axios';

const CmlTable = () => {
  const [visible, setVisible] = useState(false);
  const [CMLState, setCMLState] = useState(false);
  const [LineNumber, setLineNumber] = useState('');
  const [RowSelect, setRowSelect] = useState([""]);

  const history = useHistory();
  const { line_number } = useParams();
  // console.log({line_number});

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      // Make GET request to the API endpoint
      const response = await HTTP.post(`/cml/search/${line_number}`);
      setLineNumber(response.data.data[0].line_number_id)
      setData(response.data.data);
      // console.log(response.data.data[0].line_number_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [Add, setAdd] = useState({
    line_number: line_number,
    cml_number: '',
    cml_description: '',
    actual_outside_diameter: '',
    design_thickness: '',
    structural_thickness: '',
    required_thickness: ''
  });

  const dataSource = data.map(item => {
    console.log(data);
    return {
      key: item.id,
      line_number: item.line_number,
      cml_number: item.cml_number,
      cml_description: item.cml_description,
      actual_outside_diameter: item.actual_outside_diameter,
      design_thickness: item.design_thickness,
      structural_thickness: item.structural_thickness,
      required_thickness: item.required_thickness
    }
  });

  const columns = [
    {
      title: 'CML Number',
      dataIndex: 'cml_number',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'CML Description',
      dataIndex: 'cml_description',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Actual Outside Diameter',
      dataIndex: 'actual_outside_diameter',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Design Thickness (mm)',
      dataIndex: 'design_thickness',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Structural Thickness (mm)',
      dataIndex: 'structural_thickness',
      width: '15%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Required Thickness (mm)',
      dataIndex: 'required_thickness',
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
                onClick={() => handleTPViewAction(record)} 
                icon={<FileTextOutlined />} 
                size='small'
            >
                View TP
            </Button>

            <Button 
                type='text' 
                shape='round' 
                onClick={() => handleCMLStateAction(record)} 
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

  const handleTPViewAction = (record) => {
    history.push(`/testPoint/${line_number}/${record.cml_number}`);
  };

  const handleRemoveAction = async (record) => {
    try {
      await HTTP.delete(`/cml/remove/${record.key}`)
      console.log(`remove success`);
      fetchData();
    }catch (error) { 
      console.error(error);
    }
  };

  const handleAction = () => {
    
    setVisible(true)
  };

  const handleModalOk = async () => {
    try {
    HTTP.post('/cml/add', Add)
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

  const handleCMLStateAction = async (record) => {
    setCMLState(true)
    const params = {
      "values": {
        "id": record.key
      }
    }
    try {
      // Make POST request to the API endpoint
      const response = await HTTP.post("/cml/search", params);
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

  const handleCMLStateCancel = () => {
    setCMLState(false);
  };

  const handleCMLStateOk = () => {
    try {
      HTTP.patch('/cml/update', RowSelect)
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
    setCMLState(false);
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
      [fieldName]: value
    }));
  };

  return (
    <div className='cmlTable'>
      <div className='container'>
        <Card
          title={<div style={{ textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: '#1890FF' }}>Piping</div>}
          
        >
          <div className='herder' style={{ float: 'left' , paddingBottom:"10px", textAlign: 'left' }}>
            
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Line Number: </span>
            <span style={{ fontSize: '16px'}}>{line_number}</span>
          </div>
          <div className='add-new-button' style={{ float: 'right' , paddingBottom:"10px"}}>
                <Button 
                    type='primary' 
                    shape='round' 
                    icon={<PlusOutlined />} 
                    size='default' 
                    onClick={() => handleAction()}
                >
                    Add CML
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
        title='Add CML'
        visible={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout='vertical'>
          <Form.Item 
            label= 'CML Number'
            name= 'cml_number'
          >
            <Input
              value={Add.cml_number}
              placeholder='Please input CML Number'
              onChange={(e) => handleFieldChange('cml_number', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label= 'CML Description'
            name= 'cml_description'
            >
            <Input
              value={Add.cml_description}
              placeholder='Please input CML Description'
              onChange={(e) => handleFieldChange('cml_description', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Actual Outside Diameter'
            name='actual_outside_diameter'
          >
            <Input
              disabled
              value={Add.actual_outside_diameter}
              onChange={(e) => handleFieldChange('actual_outside_diameter', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Design Thickness'
            name='design_thickness'
          >
            <Input
              value={Add.design_thickness}
              disabled
              onChange={(e) => handleFieldChange('design_thickness', e.target.value)}
            />
          </Form.Item>
          
          <Form.Item 
            label='Structural Thickness'
            name='structural_thickness'
          >
            <Input
              disabled
              value={Add.structural_thickness}
              onChange={(e) => handleFieldChange('structural_thickness', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label='Required Thickness'>
            <Input
              disabled
              value={Add.required_thickness}
              onChange={(e) => handleFieldChange('required_thickness', e.target.value)}
            />
          </Form.Item>

        </Form>
      </Modal>

      <Modal
        title='Edit CML'
        visible={CMLState}
        onOk={handleCMLStateOk}
        onCancel={handleCMLStateCancel}
      >
            <Form layout='vertical'>
          <Form.Item label='CML Number'>
            <Input
              value={RowSelect.cml_number}
              onChange={(e) => handleInputChange('cml_number', e.target.value)}
            />
          </Form.Item>

          <Form.Item label='CML Description'>
            <Input 
            value={RowSelect.cml_description}
            onChange={(e) => handleInputChange('cml_description', e.target.value)}
            />
          </Form.Item>

          <Form.Item label='Actual Outside Diameter'>
            <Input
            disabled
            value={RowSelect.actual_outside_diameter}
            />
          </Form.Item>

          <Form.Item label='Design Thickness'>
            <Input 
            disabled
            value={RowSelect.design_thickness}
            />
          </Form.Item>
          
          <Form.Item label='Structural Thickness'>
            <Input 
            disabled
            value={RowSelect.structural_thickness}
            />
          </Form.Item>

          <Form.Item label='Required Thickness'>
            <Input
            disabled
            value={RowSelect.required_thickness}
             />
          </Form.Item>

        </Form>
        </Modal>

    </div>
  );
};

export default CmlTable;