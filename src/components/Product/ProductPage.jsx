import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Modal, Space, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiBaseURL = 'https://ecommerce-backend-fawn-eight.vercel.app/api/products';

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchProducts(storedToken);
    } else {
      message.error('No token found. Please log in.');
    }
  }, []);

  const fetchProducts = async (token) => {
    try {
      const response = await axios.get(apiBaseURL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedData = response.data.map((item, index) => ({ ...item, key: index }));
      setData(fetchedData);
      localStorage.setItem('products', JSON.stringify(fetchedData));
    } catch (error) {
      message.error('Failed to fetch products from API');
    }
  };

  const loadProductsFromLocalStorage = () => {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    setData(storedData);
  };

  const saveToLocalStorage = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
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
    message.success('Product deleted successfully');
  };

  const handleOk = (values) => {
    if (isEditing) {
      const newData = data.map(item => (item.key === editingRecord.key ? { ...item, ...values } : item));
      setData(newData);
      saveToLocalStorage(newData);
      message.success('Product updated successfully');
    } else {
      const newData = {
        key: data.length ? data[data.length - 1].key + 1 : 0,
        ...values,
      };
      setData([...data, newData]);
      saveToLocalStorage([...data, newData]);
      message.success('Product created successfully');
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} alt="product" style={{ width: 250, height: 200 }} />
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
      key: 'subtitle',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
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
        Add Product
      </Button>
      <Button type="default" onClick={() => navigate('/')} style={{ marginBottom: 16, marginLeft: 16 }}>
        Go to Home Page
      </Button>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Rate:</strong> {record.rate}</p>
              <p><strong>Color:</strong> {record.color}</p>
              <p><strong>Size:</strong> {record.size}</p>
            </div>
          ),
          rowExpandable: (record) => record.title !== 'Not Expandable',
        }}
        dataSource={data}
      />
      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={isEditing ? editingRecord : { title: '', subtitle: '', image: '', description: '', rate: '', price: '', color: '', size: '' }}
          onFinish={handleOk}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subtitle"
            label="Subtitle"
            rules={[{ required: true, message: 'Please input the subtitle!' }]}
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
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rate"
            label="Rate"
            rules={[{ required: true, message: 'Please input the rate!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: 'Please input the color!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="size"
            label="Size"
            rules={[{ required: true, message: 'Please input the size!' }]}
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

export default ProductPage;
