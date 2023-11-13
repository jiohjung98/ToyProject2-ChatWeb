'use client';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { instance } from '@/lib/api';
import styled from 'styled-components';

interface RequestBody {
    id: string;
    password: string;
}

const LoginForm = () => {
    const [formData, setFormData] = useState<RequestBody>({
        id: '',
        password: '',
    });
    const [loginFail, setLoginFail] = useState<string>('');
    const FAIL_MESSAGE = '* 아이디 또는 비밀번호가 일치하지 않습니다.';

    const router = useRouter();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginFail('');
        try {
            const res = await instance.post('login', formData);
            const isLoggedIn = Object.keys(res).includes('accessToken');
            if (isLoggedIn) {
                sessionStorage.setItem('userId', formData.id);
                router.push('/');
            } else {
                setLoginFail(FAIL_MESSAGE);
                setFormData({ ...formData, id: formData.id, password: formData.password });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <StyledContainer>
            <div>
                <img src="/Logo.png" alt="chat-logo" />
            </div>
            <h1>로그인</h1>
            <StyledDiv>
                <span>
                    일상 속 모든 대화를 <span style={{ color: '#00956e', fontWeight: 600 }}>편리하게</span>{' '}
                    관리해보세요.
                </span>
            </StyledDiv>
            <StyledForm onSubmit={onSubmit}>
                <div>
                    <label htmlFor="id">아이디</label>
                    <input type="text" name="id" onChange={onChange} />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" name="password" onChange={onChange} />
                </div>
                <div>
                    <StyledFailMessage>
                        <span>{loginFail}</span>
                    </StyledFailMessage>
                </div>
                <div>
                    {formData.id === '' || formData.password === '' ? (
                        <button className="submitEmptyButton">로그인</button>
                    ) : (
                        <button className="submitFullButton">로그인</button>
                    )}
                </div>
                <StyledLink href="/createAccount" className="anchor">
                    <span> 이미 아이디가 있으신가요? 회원가입하기</span>
                </StyledLink>
            </StyledForm>
        </StyledContainer>
    );
};

export default LoginForm;

const StyledContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const StyledForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    div {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        padding: 0 12rem;

        label {
            text-align: left;
            padding-left: 0.125rem;
            margin-bottom: 0.3rem;
            font-weight: 600;
            span {
                margin-right: 0.5rem;
            }
            display: flex;
            align-items: center;
        }

        input {
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 4.5px;
            padding: 0.9rem;
            width: 100%;
            outline: none;
            &:focus {
                border: 1px solid #00956e;
            }
        }
        button.submitFullButton {
            border: none;
            border-radius: 4.5px;
            background-color: #00956e;
            color: #eee;
            font-weight: 600;
            font-size: 1.05rem;
            padding: 1rem 0;
            width: 100%;
            cursor: pointer;
            &:hover {
                transition: all 0.3s;
                background-color: #05664c;
            }
        }
        button.submitEmptyButton {
            border: none;
            border-radius: 4.5px;
            background-color: #939393;
            color: #eee;
            font-weight: 600;
            font-size: 1.05rem;
            padding: 1rem 0;
            width: 100%;
        }
    }
`;
const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2.5rem;
    font-weight: 600;

    span {
        font-size: 1rem;
    }
`;
const StyledLink = styled(Link)`
    all: unset;
    cursor: pointer;
    margin-top: 0.5rem;
    span {
        color: #000;
        opacity: 0.75;
        font-size: 0.9rem;
        border-bottom: 0.1px solid #000;
    }
`;
const StyledFailMessage = styled.span`
    width: 100%;
    color: red;
    margin-left: 0.125rem;
    font-size: 0.8rem;
`;
