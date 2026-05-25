// src/pages/Profile.tsx
import React, { useState } from 'react';
import { Card, Typography, Button, Upload, message, Input, Form, Modal } from 'antd';
import { DownloadOutlined, UploadOutlined, KeyOutlined } from '@ant-design/icons';
import { Layout } from '@/components/common/Layout';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { useUser } from '@/hooks/useUser';
import { DataExportService } from '@/utils/dataExport';
import { aiService } from '@/utils/aiService';

const { Title, Paragraph } = Typography;

export function Profile() {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const { user, isTrial } = useUser();

  const handleExport = async () => {
    try {
      const jsonData = await DataExportService.exportAllData();
      DataExportService.downloadExportFile(jsonData);
      message.success('数据已导出，请妥善保存备份文件');
    } catch (error: any) {
      message.error('导出失败：' + error.message);
    }
  };

  const handleImport = async (file: File) => {
    try {
      await DataExportService.handleFileImport(file);
      message.success('数据已导入恢复');
    } catch (error: any) {
      message.error('导入失败：' + error.message);
    }
    return false; // 阻止默认上传行为
  };

  const handleSetApiKey = (values: { apiKey: string }) => {
    aiService.setApiKey(values.apiKey);
    setShowApiKeyModal(false);
    message.success('Claude API Key已设置');
  };

  return (
    <Layout>
      <Title level={2}>个人中心</Title>

      {user && (
        <Card style={{ marginBottom: '16px' }}>
          <Paragraph>
            <strong>邮箱:</strong> {user.email}
          </Paragraph>
          <Paragraph>
            <strong>注册时间:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </Paragraph>
          {isTrial && (
            <Paragraph type="warning">
              当前为体验模式
            </Paragraph>
          )}
        </Card>
      )}

      <StatsPanel />

      <Card style={{ marginTop: '16px' }}>
        <Title level={4}>数据管理</Title>
        <Paragraph style={{ marginBottom: '16px' }}>
          数据完全本地存储，定期备份以防丢失
        </Paragraph>
        <div style={{ marginBottom: '16px' }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ marginRight: '12px' }}
          >
            导出数据备份
          </Button>
          <Upload
            accept=".json"
            beforeUpload={handleImport}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              导入数据恢复
            </Button>
          </Upload>
        </div>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <Title level={4}>AI服务配置</Title>
        <Paragraph style={{ marginBottom: '16px' }}>
          GoodsKeeper支持多种AI服务，推荐使用DeepSeek（免费额度大）
        </Paragraph>
        <Button
          icon={<KeyOutlined />}
          onClick={() => setShowApiKeyModal(true)}
        >
          设置AI API Key
        </Button>
      </Card>

      <Modal
        title="设置AI API Key"
        open={showApiKeyModal}
        onCancel={() => setShowApiKeyModal(false)}
        footer={null}
      >
        <Form onFinish={handleSetApiKey}>
          <Form.Item
            name="apiKey"
            rules={[{ required: true, message: '请输入API Key' }]}
          >
            <Input.Password placeholder="AI API Key（支持DeepSeek/通义千问/Claude）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
        <Paragraph type="secondary" style={{ marginTop: '12px' }}>
          推荐方案：DeepSeek（免费500万tokens）→ https://platform.deepseek.com
        </Paragraph>
        <Paragraph type="secondary" style={{ marginTop: '4px' }}>
          其他选项：通义千问 → https://dashscope.aliyun.com
        </Paragraph>
      </Modal>
    </Layout>
  );
}