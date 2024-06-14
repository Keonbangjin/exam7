import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Modal, Space, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiBaseURL = 'https://ecommerce-backend-fawn-eight.vercel.app/api/categories';

const CategoryPage = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchCategories(storedToken);
    } else {
      message.error('No token found. Please log in.');
    }
  }, []);

  const fetchCategories = async (token) => {
    try {
      const response = await axios.get(apiBaseURL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedData = response.data.map((item, index) => ({ ...item, key: index }));
      setData(fetchedData);
      localStorage.setItem('categories', JSON.stringify(fetchedData));
    } catch (error) {
      message.error('Failed to fetch categories from API');
    }
  };

  const loadCategoriesFromLocalStorage = () => {
    const storedData = JSON.parse(localStorage.getItem('categories')) || [];
    setData(storedData);
  };

  const saveToLocalStorage = (categories) => {
    localStorage.setItem('categories', JSON.stringify(categories));
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    const newData = data.filter(item => item.key !== key);
    setData(newData);
    saveToLocalStorage(newData);
    message.success('Category deleted successfully');
  };

  const handleOk = (values) => {
    if (isEditing) {
      const newData = data.map(item => (item.key === editingRecord.key ? { ...item, ...values } : item));
      setData(newData);
      saveToLocalStorage(newData);
      message.success('Category updated successfully');
    } else {
      const newData = {
        key: data.length ? data[data.length - 1].key + 1 : 0,
        ...values,
      };
      setData([...data, newData]);
      saveToLocalStorage([...data, newData]);
      message.success('Category created successfully');
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} alt="category" style={{ width: '50px', height: '50px' }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Category
      </Button>
      <Button type="default" onClick={() => navigate('/')} style={{ marginBottom: 16, marginLeft: 16 }}>
        Go to Home Page
      </Button>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        style={{ background: '#f0f2f5', border: '1px solid #52c41a', borderRadius: '5px' }}
      />
      <Modal
        title={isEditing ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={isEditing ? editingRecord : { name: '', image: '' }}
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: 'Please input the image URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
