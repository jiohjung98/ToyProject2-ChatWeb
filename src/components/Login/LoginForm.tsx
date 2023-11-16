'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { instance } from '@/lib/api';
import styled from 'styled-components';

interface RequestBody {
  id: string;
  password: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
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
      const res: ResponseBody = await instance.post('login', formData);
      if (res) {
        const isLoggedIn = Object.keys(res).includes('accessToken');

        if (isLoggedIn) {
          localStorage.setItem('userId', formData.id);
          router.push('/');
        } else {
          setLoginFail(FAIL_MESSAGE);
          setFormData({ ...formData, id: formData.id, password: formData.password });
        }
      }
    } catch (e) {
      setLoginFail(FAIL_MESSAGE);
      setFormData({ ...formData, id: formData.id, password: formData.password });
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
          일상 속 모든 대화를 <span style={{ color: '#00956e', fontWeight: 600 }}>편리하게</span> 관리해보세요.
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
        <StyledLink href="/createaccount" className="anchor">
          <span> 아이디가 없으신가요? 회원가입하기</span>
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

    @media screen and (max-width: 700px) {
      padding: 0 4rem;
    }

    @media screen and (max-width: 700px) {
      padding: 0 2rem;
    }

    label {
      padding-left: 0.125rem;

      margin-bottom: 0.3rem;

      font-weight: 600;

      span {
        margin-right: 0.5rem;
      }

      display: flex;
      align-items: center;
      text-align: left;
    }

    input {
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4.5px;

      padding: 0.9rem;

      width: 100%;

      outline: none;

      &:focus {
        border: 1px solid ${({ theme }) => theme.color.mainGreen};
      }

      @media screen and (max-width: 700px) {
        padding: 0.75rem;
      }
    }
    button.submitFullButton {
      border: none;
      border-radius: 4.5px;

      background-color: ${({ theme }) => theme.color.mainGreen};

      color: #eee;
      font-weight: 600;
      font-size: 1.05rem;

      padding: 1rem 0;

      width: 100%;

      cursor: pointer;

      &:hover {
        transition: all 0.3s;

        background-color: ${({ theme }) => theme.color.darkGreen};
      }
    }

    button.submitEmptyButton {
      border: none;
      border-radius: 4.5px;

      background-color: ${({ theme }) => theme.color.darkGray};

      color: #eee;
      font-weight: 600;
      font-size: ${({ theme }) => theme.fontSize.md};

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
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;
const StyledLink = styled(Link)`
  all: unset;

  cursor: pointer;

  margin-top: 0.5rem;

  span {
    color: #000;
    font-size: ${({ theme }) => theme.fontSize.sm};

    opacity: 0.75;

    border-bottom: 0.1px solid #000;
  }
`;
const StyledFailMessage = styled.span`
  width: 100%;

  margin-left: 0.125rem;

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: red;
`;
