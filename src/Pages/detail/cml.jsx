import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, FormOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Switch, useHistory, useParams } from "react-router-dom";
import { HTTP } from '../../axios';

const CmlTable = () => {
  const [visible, setVisible] = useState(false);
  const [CMLState, setCMLState] = useState(false);

  const history = useHistory();
  const { line_number } = useParams();
  console.log({line_number});

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      // Make GET request to the API endpoint
      console.log({line_number});
      const response = await HTTP.post(`/cml/search/${line_number}`);
      setData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dataSource = data.map(item => {
    return {
      key: item.id,
      line_number_id: item.line_number_id,
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
                onClick={() => handleTPViewAction()} 
                icon={<FileTextOutlined />} 
                size='small'
            >
                View TP
            </Button>

            <Button 
                type='text' 
                shape='round' 
                onClick={() => handleCMLStateAction()} 
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

  const handleTPViewAction = () => {
    history.push("/testPoint");
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

  const handleCMLStateAction = () => {
    
    setCMLState(true)
  };

  const handleCMLStateCancel = () => {
    
    setCMLState(false);
  };

  const handleCMLStateOk = () => {
    
    setCMLState(false);
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
          <Form.Item label='CML Number'>
            <Input />
          </Form.Item>

          <Form.Item label='CML Description'>
            <Input />
          </Form.Item>

          <Form.Item label='Actual Outside Diameter'>
            <Input />
          </Form.Item>

          <Form.Item label='Design Thickness'>
            <Input />
          </Form.Item>
          
          <Form.Item label='Structural Thickness'>
            <Input />
          </Form.Item>

          <Form.Item label='Required Thickness'>
            <Input />
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
            <Input value={{data}.data.cml_number} onChange={(e) => setData(e.target.value)} />
          </Form.Item>

          <Form.Item label='CML Description'>
            <Input value={{data}.data.cml_description} onChange={(e) => setData(e.target.value)} />
          </Form.Item>

          <Form.Item label='Actual Outside Diameter'>
            <Input value={{data}.data.actual_outside_diameter} onChange={(e) => setData(e.target.value)} />
          </Form.Item>

          <Form.Item label='Design Thickness'>
            <Input value={{data}.data.design_thickness} onChange={(e) => setData(e.target.value)} />
          </Form.Item>
          
          <Form.Item label='Structural Thickness'>
            <Input value={{data}.data.structural_thickness} onChange={(e) => setData(e.target.value)} />
          </Form.Item>

          <Form.Item label='Required Thickness'>
            <Input value={{data}.data.required_thickness} onChange={(e) => setData(e.target.value)} />
          </Form.Item>

        </Form>
        </Modal>

    </div>
  );
};

export default CmlTable;