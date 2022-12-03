import React from 'react';
import { useRouter } from 'next/router'
import { useCookies } from "react-cookie";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Button, Checkbox, Form, Input, message } from 'antd';
import axios from "@/utils/axios";
import moment from 'moment';

const Login = () => {
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);

    const onFinish = (values: any) => {
        // TODO: remember me
        axios.post('/v1/authorizations', {
            grant_type: 'password',
            client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
            username: values.username,
            password: values.password,
        })
            .then(function (response) {
                if (response.status === 201) {
                    messageApi.success('登录成功').then(r => {
                        setCookie('access_token', response.data.data.access_token, {
                            path: '/',
                            expires: moment().add(response.data.data.expires_in, 'seconds').toDate(),
                        });
                        setCookie('refresh_token', response.data.data.refresh_token, {
                            path: '/',
                            expires: moment().add(response.data.data.expires_in, 'seconds').toDate(),
                        });
                        router.back();
                    });
                }
            })
            .catch(function (error) {
                messageApi.error(error.response.data.message).then(r => {});
            });
    };

    const onFinishFailed = (error: any) => {
        messageApi.error(error).then(r => {});
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <Card type="inner" title="登录" extra={<a href="#">注册</a>} className="max-w-xl w-full md:w-2/5">
                    <Form
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{required: true, message: 'Please input your username!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码'}]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                            placeholder="密码"/>
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>
                            <a className="float-right" href="">
                                Forgot password
                            </a>
                        </Form.Item>
                        <Form.Item className="flex items-center justify-end mt-4">
                            Or <a href="" className="underline">register now!</a>
                            <Button type="primary" htmlType="submit" className="ml-4 bg-[#1677ff]">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default Login;