'use client';

// dev merge

import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { instance } from '@/lib/api';
import { ValidationResult, isValidForm, isDuplicatedId } from '../../hooks/createAccount/Validation';
import styled from 'styled-components';
import { AiOutlineCamera } from 'react-icons/ai';

interface RequestBody {
    id: string;
    password: string;
    name: string;
    picture?: string;
}

const RegisterForm = () => {
    const [formData, setFormData] = useState<RequestBody>({
        id: '',
        password: '',
        name: '',
        picture: '',
    });
    const [validationResult, setValidationResult] = useState<ValidationResult>({
        isIdValid: false,
        isNameValid: false,
        isPwValid: false,
    });
    const [duplicated, setDuplicated] = useState<boolean>(false); // 아이디 중복 여부 응답값
    const [duplicatedState, setDuplicatedState] = useState<boolean>(false); // 버튼 클릭 여부
    const [duplicatedId, setDuplicatedId] = useState<string>(''); // 아이디 중복 확인 후 수정시 재확인
    const [image, setImage] = useState<string>('');
    const imageRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    const onChangeProfile = () => {
        if (imageRef.current) {
            const profile = imageRef.current.files?.[0];
            if (profile) {
                const reader = new FileReader();
                reader.readAsDataURL(profile);
                reader.onloadend = () => {
                    const imageData = reader.result as string;
                    setFormData({ ...formData, picture: imageData });
                    setImage(imageData);
                };
            }
        }
    };

    const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const onClickDuplicated = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const isDuplicated = await isDuplicatedId(formData.id);

        setDuplicated(isDuplicated);

        if (isDuplicated) {
            setDuplicatedState(false);
            setValidationResult((prevResult) => ({
                ...prevResult,
                isIdValid: !isDuplicated,
            }));
        } else {
            setDuplicatedState(true);
            setDuplicatedId(formData.id);
        }
    };

    useEffect(() => {
        const currentResult = isValidForm(formData);
        setValidationResult(currentResult);
    }, [formData, duplicatedState]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (duplicatedId !== formData.id) {
            setDuplicatedState(false);
            alert('아이디 중복 확인을 해주세요.');
        } else {
            if (validationResult.isTotalValid && !duplicated) {
                try {
                    await instance.post('/signup', formData);
                    router.push('/login');
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    return (
        <StyledContainer>
            <h1>회원가입</h1>
            <StyledDiv>
                <span>프로필 설정</span>
                <span>미설정시 아래와 같은 예시 이미지로 등록됩니다.</span>
            </StyledDiv>
            <StyledForm onSubmit={onSubmit}>
                <StyledProfile>
                    <img
                        src={
                            image ? image : `https://gravatar.com/avatar/0211205be1e2bce90bbe53c5e0d8aaff?s=200&d=retro`
                        }
                        alt="profile-image"
                    />
                    <StyledLabel htmlFor="file">
                        <StyledAiOutlineCamera />
                    </StyledLabel>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                        onChange={onChangeProfile}
                        ref={imageRef}
                    />
                </StyledProfile>
                <div>
                    <label htmlFor="name">
                        <span>이름</span>
                        {validationResult.isNameValid ? (
                            <IsValidSpan style={{ color: '#00956e' }}>* 사용할 수 있는 이름입니다.</IsValidSpan>
                        ) : (
                            <IsValidSpan>* 사용할 수 없는 이름입니다.</IsValidSpan>
                        )}
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="이름은 20자 이하만 가능합니다."
                        onChange={onChangeField}
                    />
                </div>
                <div>
                    <label htmlFor="id" className="labelId">
                        <span>아이디</span>
                        {!validationResult?.isIdValid ? (
                            <IsValidSpan>* 사용할 수 없는 아이디입니다.</IsValidSpan>
                        ) : validationResult.isIdValid && duplicatedState === false ? (
                            <IsValidSpan style={{ color: '#00956e' }}>
                                * 사용할 수 있는 아이디입니다. 중복을 확인해주세요.
                            </IsValidSpan>
                        ) : (
                            <IsValidSpan style={{ color: '#00956e' }}>* 가입할 수 있는 아이디입니다.</IsValidSpan>
                        )}
                        <button className="checkButton" onClick={onClickDuplicated}>
                            중복 확인
                        </button>
                    </label>
                    <input
                        type="text"
                        name="id"
                        placeholder="아이디는 영어와 숫자 조합만 가능합니다."
                        onChange={onChangeField}
                    />
                </div>
                <div>
                    <label htmlFor="password">
                        <span>비밀번호</span>
                        {validationResult?.isPwValid ? (
                            <IsValidSpan style={{ color: '#00956e' }}>* 사용할 수 있는 비밀번호입니다.</IsValidSpan>
                        ) : (
                            <IsValidSpan>* 사용할 수 없는 비밀번호입니다.</IsValidSpan>
                        )}
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호는 5자 이상만 가능합니다."
                        onChange={onChangeField}
                    />
                </div>
                <div>
                    {validationResult.isTotalValid && duplicatedState ? (
                        <button type="submit" className="submitFullButton">
                            회원가입
                        </button>
                    ) : (
                        <button disabled className="submitEmptyButton">
                            회원가입
                        </button>
                    )}
                </div>
                <StyledLink href="/login" className="anchor">
                    <span> 이미 아이디가 있으신가요? 로그인하기</span>
                </StyledLink>
            </StyledForm>
        </StyledContainer>
    );
};

export default RegisterForm;

const StyledContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 3rem;
    height: auto;
`;
const StyledProfile = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 190px;
        height: 190px;
        border: 1.25px dotted #00956e;
        border-radius: 50%;
    }
`;
const StyledAiOutlineCamera = styled(AiOutlineCamera)`
    font-size: 1.8rem;
    font-weight: 300;
    width: 35px;
    height: 35px;
    padding: 2.5px;
    z-index: 999;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
`;
const StyledLabel = styled.label`
    text-align: center !important;
    position: absolute;
    bottom: 10%;
    right: 38.3%;
`;

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
    font-weight: 600;

    span:first-child {
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    span:last-child {
        opacity: 0.35;
        font-size: 0.85rem;
    }
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
            margin-bottom: 0.3rem;
            padding-left: 0.125rem;
            font-weight: 600;
            span {
                margin-right: 0.5rem;
            }
            display: flex;
            align-items: center;
        }
        .labelId {
            position: relative;
            margin-bottom: 0.55rem;
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

        input[type='file'] {
            display: none;
        }

        div {
            border: 1px solid red;
            display: flex;
            flex-direction: row;
            gap: 20px;
            label {
                display: inline-block;
                width: 100px;
                border: 1px solid green;
                padding: 10px;
            }
        }

        button.checkButton {
            position: absolute;
            right: 0;
            border: none;
            border-radius: 4.5px;
            background-color: #00956e;
            color: #eee;
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.4rem 0.5rem;
            cursor: pointer;
            &:hover {
                transition: all 0.3s;
                background-color: #05664c;
            }
        }

        button.submitFullButton {
            margin-top: 1rem;
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
            margin-top: 1rem;
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
    div:nth-child(2) {
        margin-top: 1.25rem;
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

const IsValidSpan = styled.span`
    font-size: 0.65rem;
    color: red;
    opacity: 0.8;
`;
